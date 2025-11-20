# Husky hooks

## Pre-commit
- Runs `npm run lint` and `npm run tsc` to align with CI.
- Requires dependencies installed via `npm run setup`.

## Skipping in emergencies
- Temporarily bypass by prefixing commands with `HUSKY_SKIP_CHECKS=1` or `HUSKY=0`, e.g. `HUSKY=0 git commit -m "message"`.
- Re-enable hooks after resolving issues.
