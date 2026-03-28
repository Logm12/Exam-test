"""
Document parser for extracting multiple-choice questions from Word (.docx) and PDF files.

Format convention (Myaloha-style, Vietnamese):
- Questions start with "Cau X:" or "Cau X." (with or without diacritics)
- Options start with "A.", "B.", "C.", "D." on separate lines
- Correct answer is indicated by BOLD formatting (or red color in Word)

No AI engine is used. Extraction is regex + formatting-based only.
"""

import re
from typing import List, Optional
from dataclasses import dataclass
import os
import shutil
import subprocess
import tempfile


@dataclass
class ParsedQuestion:
    """A single parsed question with its options and correct answer."""
    number: int
    content: str
    options: dict  # {"A": "...", "B": "...", "C": "...", "D": "..."}
    correct_answer: Optional[str] = None  # "A", "B", "C", or "D"
    type: str = "multiple_choice"


def _norm_line(text: str) -> str:
    text = (text or "").replace("\u00a0", " ").strip()
    # normalize common OCR/Word quirks
    text = re.sub(r"\s+", " ", text)
    return text


# Regex patterns
# Accept: "Cau 1:", "Câu 1.", "CÂU 1 :" and even missing space "Câu1:"
QUESTION_PATTERN = re.compile(r"^C(?:a|â)u\s*(\d+)\s*[:.]\s*(.*)$", re.IGNORECASE)
# Accept: "A.", "A)", "A:", "A -" etc.
OPTION_PATTERN = re.compile(r"^([A-Da-d])\s*[\.)\]:\-]\s*(.+)$", re.IGNORECASE)


def parse_docx(file_path: str) -> List[ParsedQuestion]:
    """
    Parse a .docx file and extract questions.
    Bold options are treated as the correct answer.
    """
    from docx import Document

    doc = Document(file_path)
    questions: List[ParsedQuestion] = []
    current_question: Optional[ParsedQuestion] = None

    def flush_current() -> None:
        nonlocal current_question
        if current_question is None:
            return
        current_question.content = _norm_line(current_question.content)
        # Only keep if it looks like a valid MCQ (at least 2 options)
        if current_question.options and len(current_question.options) >= 2:
            questions.append(current_question)
        current_question = None

    for para in doc.paragraphs:
        text = _norm_line(para.text)
        if not text:
            continue

        # Check if this paragraph is a question line
        q_match = QUESTION_PATTERN.match(text)
        if q_match:
            # Save previous question if exists
            flush_current()

            q_num = int(q_match.group(1))
            q_content = (q_match.group(2) or "").strip()
            current_question = ParsedQuestion(
                number=q_num,
                content=q_content,
                options={},
            )
            continue

        # Check if this paragraph is an option line
        o_match = OPTION_PATTERN.match(text)
        if o_match and current_question is not None:
            option_letter = o_match.group(1).upper()
            option_text = o_match.group(2).strip()
            current_question.options[option_letter] = option_text

            # Detect if this option is bold (correct answer)
            is_bold = _is_paragraph_bold(para)
            is_red = _is_paragraph_red(para)
            if is_bold or is_red:
                current_question.correct_answer = option_letter
            continue

        # Continuation lines: append to current question content until options begin
        if current_question is not None and not current_question.options:
            current_question.content = (current_question.content + "\n" + text).strip()

    # Append the last question
    flush_current()

    return questions


def _is_paragraph_bold(para) -> bool:
    """Check if the majority of text runs in a paragraph are bold."""
    runs = para.runs
    if not runs:
        return False

    bold_chars = 0
    total_chars = 0
    for run in runs:
        length = len(run.text.strip())
        total_chars += length
        if run.bold:
            bold_chars += length

    if total_chars == 0:
        return False
    return (bold_chars / total_chars) > 0.5


def _is_paragraph_red(para) -> bool:
    """Check if any run in the paragraph uses red-ish color."""
    for run in para.runs:
        if run.font.color and run.font.color.rgb:
            rgb = str(run.font.color.rgb)
            # Check for red-ish colors (R > 180, G < 80, B < 80)
            try:
                r = int(rgb[0:2], 16)
                g = int(rgb[2:4], 16)
                b = int(rgb[4:6], 16)
                if r > 180 and g < 80 and b < 80:
                    return True
            except (ValueError, IndexError):
                pass
    return False


def parse_pdf(file_path: str) -> List[ParsedQuestion]:
    """
    Parse a .pdf file and extract questions.
    Uses PyMuPDF to extract text with font info. Bold text flags correct answers.
    """
    import fitz  # PyMuPDF

    doc = fitz.open(file_path)
    questions: List[ParsedQuestion] = []
    current_question: Optional[ParsedQuestion] = None

    def flush_current() -> None:
        nonlocal current_question
        if current_question is None:
            return
        current_question.content = _norm_line(current_question.content)
        if current_question.options and len(current_question.options) >= 2:
            questions.append(current_question)
        current_question = None

    for page in doc:
        # Some PyMuPDF versions don't expose TEXT_PRESERVE_WHITESPACE
        try:
            blocks = page.get_text("dict", flags=getattr(fitz, "TEXT_PRESERVE_WHITESPACE", 0))["blocks"]
        except Exception:
            blocks = page.get_text("dict").get("blocks", [])
        for block in blocks:
            if "lines" not in block:
                continue
            for line in block["lines"]:
                line_text = ""
                is_bold = False
                bold_chars = 0
                total_chars = 0

                for span in line["spans"]:
                    span_text = span["text"]
                    line_text += span_text
                    char_count = len(span_text.strip())
                    total_chars += char_count
                    # Check bold flag (bit 4 in font flags)
                    if span.get("flags", 0) & (1 << 4):
                        bold_chars += char_count

                if total_chars > 0:
                    is_bold = (bold_chars / total_chars) > 0.5

                line_text = _norm_line(line_text)
                if not line_text:
                    continue

                # Check for question line
                q_match = QUESTION_PATTERN.match(line_text)
                if q_match:
                    flush_current()
                    q_num = int(q_match.group(1))
                    q_content = (q_match.group(2) or "").strip()
                    current_question = ParsedQuestion(
                        number=q_num,
                        content=q_content,
                        options={},
                    )
                    continue

                # Check for option line
                o_match = OPTION_PATTERN.match(line_text)
                if o_match and current_question is not None:
                    option_letter = o_match.group(1).upper()
                    option_text = o_match.group(2).strip()
                    current_question.options[option_letter] = option_text
                    if is_bold:
                        current_question.correct_answer = option_letter
                    continue

                if current_question is not None and not current_question.options:
                    current_question.content = (current_question.content + "\n" + line_text).strip()

    flush_current()

    doc.close()
    return questions


def parse_file(file_path: str) -> List[ParsedQuestion]:
    """
    Parse a file based on its extension.
    Supported: .doc, .docx, .pdf
    """
    lower = file_path.lower()
    if lower.endswith(".docx"):
        return parse_docx(file_path)
    elif lower.endswith(".doc"):
        return parse_doc(file_path)
    elif lower.endswith(".pdf"):
        return parse_pdf(file_path)
    else:
        raise ValueError("Unsupported file type. Only .doc, .docx and .pdf are supported.")


def parse_doc(file_path: str) -> List[ParsedQuestion]:
    """Parse legacy Word .doc by converting to .docx (LibreOffice) then parsing."""
    with tempfile.TemporaryDirectory(prefix="exam_import_") as out_dir:
        converted = _convert_doc_to_docx(file_path, out_dir)
        return parse_docx(converted)


def _convert_doc_to_docx(doc_path: str, out_dir: str) -> str:
    soffice = (
        os.environ.get("SOFFICE_PATH")
        or shutil.which("soffice")
        or shutil.which("libreoffice")
    )
    if not soffice:
        # Common macOS install paths (LibreOffice.app)
        mac_candidates = [
            "/Applications/LibreOffice.app/Contents/MacOS/soffice",
            "/Applications/LibreOffice.app/Contents/MacOS/soffice.bin",
        ]
        for candidate in mac_candidates:
            if os.path.exists(candidate) and os.access(candidate, os.X_OK):
                soffice = candidate
                break

    if not soffice:
        raise ValueError(
            "Cannot convert .doc files because LibreOffice (soffice) was not found. "
            "Install LibreOffice or upload a .docx instead. "
            "On macOS: install LibreOffice, then ensure /Applications/LibreOffice.app exists, "
            "or set SOFFICE_PATH to the soffice binary."
        )

    cmd = [
        soffice,
        "--headless",
        "--nologo",
        "--nolockcheck",
        "--norestore",
        "--convert-to",
        "docx",
        "--outdir",
        out_dir,
        doc_path,
    ]

    try:
        subprocess.run(
            cmd,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=45,
        )
    except subprocess.TimeoutExpired as e:
        raise ValueError("Timed out converting .doc to .docx") from e
    except subprocess.CalledProcessError as e:
        stderr = (e.stderr or b"").decode("utf-8", errors="ignore").strip()
        raise ValueError(f"Failed to convert .doc to .docx: {stderr or 'unknown error'}") from e

    base = os.path.splitext(os.path.basename(doc_path))[0]
    expected = os.path.join(out_dir, f"{base}.docx")
    if os.path.exists(expected):
        return expected

    # Fallback: LibreOffice may change casing or output name slightly
    for name in os.listdir(out_dir):
        if name.lower().endswith(".docx"):
            return os.path.join(out_dir, name)

    raise ValueError("Conversion succeeded but .docx output not found")
