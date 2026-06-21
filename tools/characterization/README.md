# Characterization harness (Phase 2 safety net)

Protects the **math engines** of both apps before any logic is refactored. There
are no unit tests, so instead we freeze the *behaviour*: for known inputs we
snapshot every numeric output of the model, then assert it never changes
unintentionally.

- `curvature-drop-calc.spec.ts` — builds a fresh `CurveAppClass`, applies input
  overrides per scenario, calls `Update()`, snapshots all numeric fields (120 each).
- `fed-wabis.spec.ts` — applies known saved states to `FeDomeApp`, calls
  `Update()`, snapshots all numeric fields (60 each).

Baselines live next to each spec in `*-snapshots/*.json` and **are committed**.

## Usage

```bash
pnpm characterize          # verify current behaviour matches the baselines
pnpm characterize:update   # regenerate baselines (only when a change is intended)
```

Playwright boots each app's Vite dev server automatically (ports 5301/5302).

## Workflow during Phase 3 (curvature-drop-calc migration)

1. Run `pnpm characterize` → green (baseline).
2. Make the change (e.g. switch edc to ESM + jsgraph-vendor).
3. Run `pnpm characterize` again. If it stays green, the math is provably
   unchanged. If a value moved unexpectedly, stop and investigate before
   committing. Only run `:update` when a difference is understood and intended.

Numbers are rounded to 10 significant figures to absorb last-ULP noise.
