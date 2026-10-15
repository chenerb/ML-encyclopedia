"""Exercise the content checker through its command-line interface."""

from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


CHECKER = Path(__file__).resolve().parents[1] / "scripts" / "check_content.py"


class ContentCheckerTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)

    def write(self, name, content=""):
        path = self.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")

    def check(self):
        return subprocess.run(
            [sys.executable, str(CHECKER), "--root", str(self.root)],
            capture_output=True,
            text=True,
            check=False,
        )

    def assert_ok(self, result):
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_missing_local_link_reports_source_line_and_target(self):
        self.write("README.md", "# Guide\n\n[Continue](docs/missing.md)\n")

        result = self.check()

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("README.md:3:", result.stdout)
        self.assertIn("docs/missing.md", result.stdout)

    def test_ignores_fenced_code_inline_code_remote_urls_and_anchors(self):
        self.write(
            "README.md",
            "```markdown\n[example](missing.md)\n```\n"
            "~~~~markdown\n[example](also-missing.md)\n~~~~\n"
            "`[example](inline-missing.md)`\n"
            "``[example](other-inline-missing.md)``\n"
            "[web](https://example.org/not-local.md)\n"
            "[web](http://example.org/not-local.md)\n"
            "[mail](mailto:reader@example.org)\n"
            "[anchor](#this-heading-does-not-need-to-exist)\n",
        )

        self.assert_ok(self.check())

    def test_decodes_chinese_and_spaces_and_ignores_target_fragment(self):
        self.write("assets/中文 文件.md")
        self.write(
            "README.md",
            "[read](assets/%E4%B8%AD%E6%96%87%20%E6%96%87%E4%BB%B6.md#section)\n"
            "[read](<assets/中文 文件.md>)\n",
        )

        self.assert_ok(self.check())

    def test_unmatched_backticks_do_not_hide_local_links(self):
        self.write("README.md", "``literal [broken](missing.md)`\n")

        result = self.check()

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("README.md:1:", result.stdout)
        self.assertIn("missing.md", result.stdout)

    def test_checks_image_and_reference_link_targets(self):
        self.write("README.md", "![plot](missing.png)\n\n[read][book]\n[book]: absent.md\n")

        result = self.check()

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("README.md:1:", result.stdout)
        self.assertIn("missing.png", result.stdout)
        self.assertIn("README.md:4:", result.stdout)
        self.assertIn("absent.md", result.stdout)

    def test_balanced_parentheses_and_optional_link_titles(self):
        self.write("assets/plot(v2).png")
        self.write("README.md", '![plot](assets/plot(v2).png "A plot")\n')

        self.assert_ok(self.check())

    def test_course_article_requires_question_and_answer(self):
        self.write("docs/02-mathematics/01-algebra.md", "# Algebra\n")

        result = self.check()

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("docs/02-mathematics/01-algebra.md:1:", result.stdout)
        self.assertIn("exams/02-mathematics/01-algebra-题目.md", result.stdout)
        self.assertIn("exams/02-mathematics/01-algebra-答案解析.md", result.stdout)

    def test_nested_chapter_five_article_uses_flat_exam_names(self):
        self.write("docs/05-deep-learning/01-cnn/01-introduction.md", "# CNN\n")
        self.write("exams/05-deep-learning/01-cnn-01-introduction-题目.md")
        self.write("exams/05-deep-learning/01-cnn-01-introduction-答案解析.md")

        self.assert_ok(self.check())

    def test_all_exam_types_need_pairs_in_both_directions(self):
        self.write("exams/01-introduction/挑战卷-题目.md", "# Questions\n")
        self.write("exams/02-mathematics/压力面-答案解析.md", "# Answers\n")

        result = self.check()

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("exams/01-introduction/挑战卷-题目.md:1:", result.stdout)
        self.assertIn("挑战卷-答案解析.md", result.stdout)
        self.assertIn("exams/02-mathematics/压力面-答案解析.md:1:", result.stdout)
        self.assertIn("压力面-题目.md", result.stdout)

    def test_internal_design_documents_do_not_require_exams(self):
        self.write("docs/superpowers/plans/2026-10-15-design.md", "# Design\n")

        self.assert_ok(self.check())

    def test_python_syntax_error_reports_file_and_line(self):
        self.write("examples/python/broken.py", "# Example\nprint(\"bad\"quote\")\n")

        result = self.check()

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("examples/python/broken.py:2:", result.stdout)
        self.assertIn("syntax", result.stdout.lower())

    def test_python_examples_are_parsed_without_importing_dependencies(self):
        self.write(
            "examples/python/valid.py",
            "import dependency_that_is_not_installed\nraise RuntimeError('do not execute')\n",
        )

        self.assert_ok(self.check())


if __name__ == "__main__":
    unittest.main()
