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
from dataclasses import dataclass, field


@dataclass
class ParsedQuestion:
    """A single parsed question with its options and correct answer."""
    number: int
    content: str
    options: dict  # {"A": "...", "B": "...", "C": "...", "D": "..."}
    correct_answer: Optional[str] = None  # "A", "B", "C", or "D"
    type: str = "multiple_choice"


# Regex patterns
QUESTION_PATTERN = re.compile(
    r"^C[aâ]u\s*(\d+)\s*[:.]\s*(.+)", re.IGNORECASE
)
OPTION_PATTERN = re.compile(
    r"^([A-Da-d])\s*[.)]\s*(.+)", re.IGNORECASE
)


def parse_docx(file_path: str) -> List[ParsedQuestion]:
    """
    Parse a .docx file and extract questions.
    Bold options are treated as the correct answer.
    """
    from docx import Document

    doc = Document(file_path)
    questions: List[ParsedQuestion] = []
    current_question: Optional[ParsedQuestion] = None

    for para in doc.paragraphs:
        text = para.text.strip()
        if not text:
            continue

        # Check if this paragraph is a question line
        q_match = QUESTION_PATTERN.match(text)
        if q_match:
            # Save previous question if exists
            if current_question is not None:
                questions.append(current_question)

            q_num = int(q_match.group(1))
            q_content = q_match.group(2).strip()
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

    # Append the last question
    if current_question is not None:
        questions.append(current_question)

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

    for page in doc:
        blocks = page.get_text("dict", flags=fitz.TEXT_PRESERVE_WHITESPACE)["blocks"]
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

                line_text = line_text.strip()
                if not line_text:
                    continue

                # Check for question line
                q_match = QUESTION_PATTERN.match(line_text)
                if q_match:
                    if current_question is not None:
                        questions.append(current_question)
                    q_num = int(q_match.group(1))
                    q_content = q_match.group(2).strip()
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

    if current_question is not None:
        questions.append(current_question)

    doc.close()
    return questions


def parse_file(file_path: str) -> List[ParsedQuestion]:
    """
    Parse a file based on its extension.
    Supported: .docx, .pdf
    """
    lower = file_path.lower()
    if lower.endswith(".docx"):
        return parse_docx(file_path)
    elif lower.endswith(".pdf"):
        return parse_pdf(file_path)
    else:
        raise ValueError(f"Unsupported file type. Only .docx and .pdf are supported.")
