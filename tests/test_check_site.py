"""Check built-site links through real HTML fixtures and the public CLI."""

from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


CHECKER = Path(__file__).resolve().parents[1] / "scripts" / "check_site.py"


class SiteCheckerTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)

    def write(self, name, content=""):
        path = self.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")

    def check(self, base="/ML-encyclopedia/"):
        return subprocess.run(
            [sys.executable, str(CHECKER), "--root", str(self.root), "--base", base],
            capture_output=True,
            text=True,
            check=False,
        )

    def assert_ok(self, result):
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_decodes_chinese_spaces_and_ignores_query_and_fragment(self):
        self.write("index.html", '<a href="/ML-encyclopedia/%E4%B8%AD%E6%96%87%20%E9%A1%B5.html?q=1&amp;x=2#missing-heading">Read</a>')
        self.write("中文 页.html", "<h1>Chapter</h1>")

        result = self.check()

        self.assert_ok(result)
        self.assertIn("2 HTML pages", result.stdout)
        self.assertIn("1 local href", result.stdout)

    def test_resolves_relative_files_and_directory_indexes(self):
        self.write(
            "docs/start/index.html",
            '<a href="../next/">Next</a>\n<a href="../../about.html">About</a>',
        )
        self.write("docs/next/index.html", '<a href="/ML-encyclopedia/">Home</a>')
        self.write("about.html")
        self.write("index.html")

        self.assert_ok(self.check())

    def test_missing_target_reports_html_filename_and_line(self):
        self.write("index.html", '<h1>Home</h1>\n<a href="/ML-encyclopedia/missing/">Missing</a>\n')

        result = self.check()

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("index.html:2:", result.stdout)
        self.assertIn("missing/", result.stdout)

    def test_custom_base_accepts_its_routes_and_rejects_absolute_links_outside_it(self):
        self.write("index.html", '<a href="/preview/docs/page/">Page</a>')
        self.write("docs/page/index.html")
        self.assert_ok(self.check(base="/preview/"))

        self.write("index.html", '<a href="/docs/page/">Page</a>')

        result = self.check(base="/preview/")

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("index.html:1:", result.stdout)
        self.assertIn("/docs/page/", result.stdout)

    def test_skips_external_anchor_query_and_non_anchor_attributes(self):
        self.write(
            "index.html",
            '<a href="https://example.invalid/missing">Web</a>\n'
            '<a href="//example.invalid/missing">Web</a>\n'
            '<a href="mailto:reader@example.org">Email</a>\n'
            '<a href="#missing-heading">Section</a>\n'
            '<a href="?q=example#missing-heading">Query</a>\n'
            '<a>Without href</a>\n<img src="missing.png">\n'
            '<script>const example = \'<a href="missing.html">\';</script>',
        )

        self.assert_ok(self.check())

    def test_directory_without_index_is_not_a_valid_page_target(self):
        self.write("index.html", '<a href="/ML-encyclopedia/empty/">Empty directory</a>')
        self.write("empty/.keep")

        result = self.check()

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("index.html:1:", result.stdout)
        self.assertIn("empty/", result.stdout)


if __name__ == "__main__":
    unittest.main()
