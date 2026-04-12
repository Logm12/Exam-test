import csv
import io
from datetime import datetime
from typing import Any, Iterable, Literal, Optional

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_active_admin
from app.db.session import get_db
from app.models.exam import Exam
from app.models.organization import OrganizationalUnit
from app.models.student import Student
from app.models.submission import Submission
from app.models.user import User


router = APIRouter()


ExportFormat = Literal["csv", "xlsx"]


def _safe_dt(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, datetime):
        return value.isoformat()
    return str(value)


def _csv_bytes(headers: list[str], rows: Iterable[list[Any]]) -> bytes:
    output = io.StringIO(newline="")
    writer = csv.writer(output)
    writer.writerow(headers)
    for row in rows:
        writer.writerow(["" if v is None else v for v in row])
    # utf-8-sig adds BOM for better Excel compatibility
    return output.getvalue().encode("utf-8-sig")


def _xlsx_bytes(sheet_name: str, headers: list[str], rows: Iterable[list[Any]]) -> bytes:
    from openpyxl import Workbook

    wb = Workbook()
    ws = wb.active
    ws.title = sheet_name[:31] if sheet_name else "Report"
    ws.append(headers)
    for row in rows:
        ws.append(["" if v is None else v for v in row])

    stream = io.BytesIO()
    wb.save(stream)
    return stream.getvalue()


def _file_response(content: bytes, *, filename: str, export_format: ExportFormat) -> StreamingResponse:
    if export_format == "csv":
        media_type = "text/csv; charset=utf-8"
    else:
        media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    resp = StreamingResponse(iter([content]), media_type=media_type)
    resp.headers["Content-Disposition"] = f"attachment; filename={filename}"
    return resp


@router.get("/exams/{exam_id}/scores")
async def export_exam_scores(
    *,
    db: AsyncSession = Depends(get_db),
    exam_id: int,
    export_format: ExportFormat = Query("csv", alias="format"),
    current_user: User = Depends(get_current_active_admin),
):
    """Export exam score list (Admin only)."""
    _ = current_user
    stmt = (
        select(
            Student.stt,
            Student.full_name,
            Student.date_of_birth,
            Student.class_name,
            Student.mssv,
            Student.school,
            User.username,
            Submission.score,
            Submission.correct_count,
            Submission.violation_count,
            Submission.time_spent_seconds,
        )
        .join(User, Submission.user_id == User.id)
        .outerjoin(Student, Student.user_id == User.id)
        .where(Submission.exam_id == exam_id)
        .order_by(Student.stt.asc().nullslast(), Submission.submitted_at.desc().nullslast(), Submission.id.desc())
    )
    result = await db.execute(stmt)
    rows_raw = result.all()

    headers = [
        "STT",
        "HoTen",
        "NgaySinh",
        "Lop",
        "MSSV",
        "Truong",
        "Username",
        "Diem",
        "SoCauDung",
        "SoLanChuyenTab",
        "ThoiGianLamBai",
    ]
    rows = [
        [
            stt,
            full_name or "",
            _safe_dt(date_of_birth),
            class_name or "",
            mssv or "",
            school or "",
            username or "",
            score,
            correct_count,
            violation_count,
            time_spent_seconds,
        ]
        for (
            stt,
            full_name,
            date_of_birth,
            class_name,
            mssv,
            school,
            username,
            score,
            correct_count,
            violation_count,
            time_spent_seconds,
        ) in rows_raw
    ]

    if export_format == "csv":
        content = _csv_bytes(headers, rows)
        filename = f"exam_{exam_id}_scores.csv"
    else:
        content = _xlsx_bytes(f"Exam {exam_id} Scores", headers, rows)
        filename = f"exam_{exam_id}_scores.xlsx"
    return _file_response(content, filename=filename, export_format=export_format)


@router.get("/submissions")
async def export_submission_history(
    *,
    db: AsyncSession = Depends(get_db),
    export_format: ExportFormat = Query("csv", alias="format"),
    exam_id: Optional[int] = None,
    user_id: Optional[int] = None,
    current_user: User = Depends(get_current_active_admin),
):
    """Export submission history (Admin only). Optionally filter by exam_id and/or user_id."""
    _ = current_user
    stmt = (
        select(
            Submission.id,
            Exam.id.label("exam_id"),
            Exam.title.label("exam_title"),
            User.id.label("user_id"),
            User.username,
            Submission.score,
            Submission.status,
            Submission.violation_count,
            Submission.forced_submit,
            Submission.submitted_at,
        )
        .join(Exam, Submission.exam_id == Exam.id)
        .join(User, Submission.user_id == User.id)
    )
    if exam_id is not None:
        stmt = stmt.where(Submission.exam_id == exam_id)
    if user_id is not None:
        stmt = stmt.where(Submission.user_id == user_id)
    stmt = stmt.order_by(Submission.submitted_at.desc().nullslast(), Submission.id.desc())

    result = await db.execute(stmt)
    rows_raw = result.all()

    headers = [
        "submission_id",
        "exam_id",
        "exam_title",
        "user_id",
        "username",
        "score",
        "status",
        "violation_count",
        "forced_submit",
        "submitted_at",
    ]
    rows = [
        [
            sub_id,
            ex_id,
            ex_title,
            u_id,
            uname,
            score,
            status,
            vio,
            forced,
            _safe_dt(submitted_at),
        ]
        for (sub_id, ex_id, ex_title, u_id, uname, score, status, vio, forced, submitted_at) in rows_raw
    ]

    suffix = "all"
    if exam_id is not None and user_id is not None:
        suffix = f"exam_{exam_id}_user_{user_id}"
    elif exam_id is not None:
        suffix = f"exam_{exam_id}"
    elif user_id is not None:
        suffix = f"user_{user_id}"

    if export_format == "csv":
        content = _csv_bytes(headers, rows)
        filename = f"submission_history_{suffix}.csv"
    else:
        content = _xlsx_bytes("Submission History", headers, rows)
        filename = f"submission_history_{suffix}.xlsx"
    return _file_response(content, filename=filename, export_format=export_format)


@router.get("/candidates")
async def export_candidates(
    *,
    db: AsyncSession = Depends(get_db),
    export_format: ExportFormat = Query("csv", alias="format"),
    current_user: User = Depends(get_current_active_admin),
):
    """Export candidate (student) data (Admin only)."""
    _ = current_user
    stmt = (
        select(
            Student.stt,
            Student.full_name,
            Student.date_of_birth,
            Student.class_name,
            Student.mssv,
            Student.school,
            User.id.label("user_id"),
            User.username,
            OrganizationalUnit.name.label("org_unit_name"),
        )
        .select_from(User)
        .outerjoin(Student, Student.user_id == User.id)
        .outerjoin(OrganizationalUnit, User.org_unit_id == OrganizationalUnit.id)
        .where(User.role == "student")
        .order_by(Student.stt.asc().nullslast(), User.id.asc())
    )
    result = await db.execute(stmt)
    rows_raw = result.all()

    headers = [
        "stt",
        "full_name",
        "date_of_birth",
        "class_name",
        "mssv",
        "school",
        "user_id",
        "username",
        "org_unit_name",
    ]
    rows = [
        [
            stt,
            full_name or "",
            _safe_dt(date_of_birth),
            class_name or "",
            mssv or "",
            school or "",
            user_id,
            username or "",
            org_unit_name or "",
        ]
        for (stt, full_name, date_of_birth, class_name, mssv, school, user_id, username, org_unit_name) in rows_raw
    ]

    if export_format == "csv":
        content = _csv_bytes(headers, rows)
        filename = "candidates.csv"
    else:
        content = _xlsx_bytes("Candidates", headers, rows)
        filename = "candidates.xlsx"
    return _file_response(content, filename=filename, export_format=export_format)
