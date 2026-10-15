#!/usr/bin/env python3
"""Check a built site's local anchor destinations without accessing the network.

Only a[href] paths are checked. Remote URLs, query strings, and heading
fragments are outside the check's scope. A page route must resolve to an
output file or a directory containing index.html.
"""

import argparse
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit


class AnchorParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = []

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            for name, value in attrs:
                if name == "href" and value is not None:
                    self.links.append((self.getpos()[0], value.strip()))
                    break


def check_page(root, source, base):
    relative = source.relative_to(root).as_posix()
    errors = []
    checked = 0
    try:
        parser = AnchorParser()
        parser.feed(source.read_text(encoding="utf-8"))
        parser.close()
    except (OSError, UnicodeError) as error:
        return [f"{relative}:1: cannot read HTML: {error}"], checked

    for line, href in parser.links:
        try:
            link = urlsplit(href)
        except ValueError as error:
            errors.append(f"{relative}:{line}: invalid href {href!r}: {error}")
            continue
        if link.scheme or link.netloc or not link.path:
            continue
        checked += 1
        path = unquote(urlsplit(urljoin(base + relative, href)).path)
        if base != "/" and path == base.rstrip("/"):
            path = base
        if not path.startswith(base):
            errors.append(f"{relative}:{line}: local href is outside base {base}: {href}")
            continue
        destination = (root / path[len(base):]).resolve()
        try:
            destination.relative_to(root)
        except ValueError:
            errors.append(f"{relative}:{line}: local href escapes output directory: {href}")
            continue
        is_file = destination.is_file() and not path.endswith("/")
        has_index = destination.is_dir() and (destination / "index.html").is_file()
        if not is_file and not has_index:
            errors.append(f"{relative}:{line}: missing local output target: {href}")
    return errors, checked


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path,
                        default=Path(__file__).resolve().parents[1] / "web" / "dist",
                        help="built output directory (default: web/dist)")
    parser.add_argument("--base", default="/ML-encyclopedia/",
                        help="URL base path (default: /ML-encyclopedia/)")
    arguments = parser.parse_args()
    root = arguments.root.resolve()
    if not root.is_dir():
        parser.error(f"output root is not a directory: {root}")
    if (not arguments.base.startswith("/") or arguments.base.startswith("//")
            or "?" in arguments.base or "#" in arguments.base):
        parser.error("base must be an absolute URL path without a query or fragment")
    base = arguments.base.rstrip("/") + "/"
    pages = sorted(root.rglob("*.html"))
    errors = []
    checked = 0
    for source in pages:
        page_errors, page_checked = check_page(root, source, base)
        errors.extend(page_errors)
        checked += page_checked
    for error in errors:
        print(error)
    print(f"Scanned {len(pages)} HTML pages; checked {checked} local hrefs.")
    if errors:
        print(f"Site check failed: {len(errors)} error(s).")
        return 1
    print("Site check passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
