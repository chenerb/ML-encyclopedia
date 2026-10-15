#!/usr/bin/env python3
"""Check local links, course/exam coverage, and example syntax using only stdlib.

Run from any directory: python scripts/check_content.py --root /path/to/repository
Heading fragments and remote URLs are deliberately outside this check's scope.
"""

import argparse
import ast
import html
import os
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit


IGNORED_DIRECTORIES = {".git", ".venv", "venv", "node_modules", "__pycache__", "dist", "build"}
NUMBERED_NAME = re.compile(r"^\d{2}-")
FENCE = re.compile(r"^ {0,3}(`{3,}|~{3,})(.*)$")
INLINE_LINK = re.compile(r"!?\[[^\]\n]*\]\(")
REFERENCE = re.compile(r"^ {0,3}\[[^\]\n]+\]:\s*(<[^>\n]*>|\S+)", re.MULTILINE)
EXAM_SUFFIXES = ("-题目.md", "-答案解析.md")


def repository_files(root):
    """Exclude dependency checkouts and generated output, while retaining source docs."""
    for directory, names, filenames in os.walk(root):
        names[:] = sorted(name for name in names if name not in IGNORED_DIRECTORIES)
        for filename in sorted(filenames):
            yield Path(directory) / filename


def blank(text):
    """Mask examples without changing offsets or diagnostic line numbers."""
    return "".join("\n" if character == "\n" else " " for character in text)


def without_code(text):
    lines = []
    fence_character = None
    fence_length = 0
    for line in text.splitlines(keepends=True):
        match = FENCE.match(line.rstrip("\r\n"))
        if fence_character is not None:
            lines.append(blank(line))
            if (match and match.group(1)[0] == fence_character
                    and len(match.group(1)) >= fence_length and not match.group(2).strip()):
                fence_character = None
        elif match:
            fence_character = match.group(1)[0]
            fence_length = len(match.group(1))
            lines.append(blank(line))
        else:
            lines.append(line)
    text = "".join(lines)
    inline_code = re.compile(r"(?<!`)(`+)(?!`)(.*?)(?<!`)\1(?!`)", re.DOTALL)
    return inline_code.sub(lambda match: blank(match.group(0)), text)


def link_destination(text, start):
    """Read an inline destination, including angle paths or balanced parentheses."""
    cursor = start
    while cursor < len(text) and text[cursor].isspace():
        cursor += 1
    if cursor < len(text) and text[cursor] == "<":
        end = text.find(">", cursor + 1)
        return text[cursor + 1:end] if end != -1 else ""
    beginning = cursor
    depth = 0
    while cursor < len(text):
        character = text[cursor]
        if character == "\\" and cursor + 1 < len(text):
            cursor += 2
            continue
        if character == "(":
            depth += 1
        elif character == ")":
            if depth == 0:
                break
            depth -= 1
        elif character.isspace() and depth == 0:
            break
        cursor += 1
    return text[beginning:cursor]


def markdown_targets(text):
    text = without_code(text)
    for match in INLINE_LINK.finditer(text):
        yield text.count("\n", 0, match.start()) + 1, link_destination(text, match.end())
    for match in REFERENCE.finditer(text):
        target = match.group(1)
        if target.startswith("<"):
            target = target[1:-1]
        yield text.count("\n", 0, match.start()) + 1, target


def diagnostic(root, source, line, message):
    return f"{source.relative_to(root).as_posix()}:{line}: {message}"


def check_markdown(root, source):
    errors = []
    try:
        text = source.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as error:
        return [diagnostic(root, source, 1, f"cannot read Markdown: {error}")]
    for line, target in markdown_targets(text):
        target = html.unescape(re.sub(r"\\([\\`*{}\[\]()#+\-.!_> ])", r"\1", target))
        if not target or target.startswith("#"):
            continue
        try:
            url = urlsplit(target)
        except ValueError as error:
            errors.append(diagnostic(root, source, line, f"invalid link {target!r}: {error}"))
            continue
        if url.scheme or url.netloc:
            continue
        path = unquote(url.path)
        if not path:
            continue
        destination = root / path.lstrip("/") if path.startswith("/") else source.parent / path
        if not destination.exists():
            errors.append(diagnostic(root, source, line, f"missing local target: {target}"))
    return errors


def course_articles(root, markdown):
    for source in markdown:
        parts = source.relative_to(root).parts
        if (len(parts) >= 3 and parts[0] == "docs"
                and NUMBERED_NAME.match(parts[1]) and NUMBERED_NAME.match(source.name)):
            yield source


def check_course_exams(root, articles):
    errors = []
    for source in articles:
        relative = source.relative_to(root / "docs")
        chapter = relative.parts[0]
        # Chapter 05 has nested topics; its exam files flatten those path components.
        stem = "-".join(relative.with_suffix("").parts[1:])
        for suffix in EXAM_SUFFIXES:
            expected = root / "exams" / chapter / (stem + suffix)
            if not expected.is_file():
                errors.append(diagnostic(
                    root, source, 1,
                    f"missing course exam: {expected.relative_to(root).as_posix()}",
                ))
    return errors


def check_exam_pairs(root, exams):
    errors = []
    for source in exams:
        for index, suffix in enumerate(EXAM_SUFFIXES):
            if source.name.endswith(suffix):
                partner = source.with_name(source.name[:-len(suffix)] + EXAM_SUFFIXES[1 - index])
                if not partner.is_file():
                    errors.append(diagnostic(
                        root, source, 1,
                        f"missing exam partner: {partner.relative_to(root).as_posix()}",
                    ))
                break
    return errors


def check_python(root, examples):
    errors = []
    for source in examples:
        try:
            ast.parse(source.read_text(encoding="utf-8"), filename=str(source))
        except SyntaxError as error:
            errors.append(diagnostic(root, source, error.lineno or 1, f"Python syntax error: {error.msg}"))
        except (OSError, UnicodeError) as error:
            errors.append(diagnostic(root, source, 1, f"cannot read Python example: {error}"))
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1],
                        help="repository root (defaults to this script's repository)")
    arguments = parser.parse_args()
    root = arguments.root.resolve()
    if not root.is_dir():
        parser.error(f"repository root is not a directory: {root}")
    files = sorted(repository_files(root))
    markdown = [source for source in files if source.suffix.lower() == ".md"]
    articles = list(course_articles(root, markdown))
    exams = [source for source in markdown if source.relative_to(root).parts[0] == "exams"]
    examples = [source for source in files if source.suffix == ".py"
                and source.relative_to(root).parts[0] == "examples"]
    errors = []
    for source in markdown:
        errors.extend(check_markdown(root, source))
    errors.extend(check_course_exams(root, articles))
    errors.extend(check_exam_pairs(root, exams))
    errors.extend(check_python(root, examples))
    for error in errors:
        print(error)
    print(f"Checked {len(markdown)} Markdown files, {len(articles)} course articles, "
          f"{len(exams)} exam files, and {len(examples)} Python examples.")
    if errors:
        print(f"Content check failed: {len(errors)} error(s).")
        return 1
    print("Content check passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
