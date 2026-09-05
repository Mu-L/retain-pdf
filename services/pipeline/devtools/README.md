# Devtools

`devtools/` holds local diagnostics, migration helpers, probes, and other scripts that are useful while developing RetainPDF but are not part of the production pipeline.

## Offline translation regression

From the repository root (uses the selected Python environment):

```bash
.venv/bin/python services/pipeline/devtools/run_translation_tests.py
.venv/bin/python services/pipeline/devtools/run_translation_tests.py --reverse
.venv/bin/python services/pipeline/devtools/run_translation_tests.py --suite benchmarks
```

The default includes the runner's own regression tests and all translation and benchmark tests, including concurrency,
checkpoint recovery, full-message golden fixtures and production-entry fake-transport
contracts. `--reverse` reverses file order, not individual tests. `--collect-only`
lists coverage without executing tests. The runner has a 300-second timeout and
propagates pytest's exit status.

This is a curated offline test entrypoint, not a network sandbox. Tests must replace
external services; subprocess probes must install their own network guards. It does
not launch `live_smoke.py` or promptfoo. Live evaluations require separate explicit
authorization. The main `Tests` workflow runs this full suite in normal order;
the manual `Translation Offline Order Check` workflow runs reverse file order.
Neither workflow requests provider secrets or launches a live evaluation. CI
installs Typst 0.14.2 for the real formula-compilation regression; locally install
Typst or set `TYPST_BIN` to its executable.

Keep these layers separate: component tests locate individual rules; static golden
fixtures lock complete messages and identities; capture replay checks saved-input
integrity; production-entry fake transport checks routing and repair budgets.
Never refresh golden expectations automatically to make a refactor pass.

## Code size

Run the repository code counter from the project root:

```bash
python services/pipeline/devtools/count_code.py
```

Useful options:

- `--json` prints the same totals as JSON.
- `--all` relaxes the default source and directory filters while still skipping `.git`, binary files, and files larger than 2 MiB.

The default scan skips obvious dependencies, caches, build outputs, temporary data, and job data such as `node_modules/`, `target/`, `dist/`, `build/`, `__pycache__/`, `.venv/`, `data/jobs/`, and `tmp/`.
