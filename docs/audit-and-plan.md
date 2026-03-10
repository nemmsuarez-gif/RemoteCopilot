# Step 1 — Codebase Audit

## Current state
The repository is effectively empty (`.gitkeep` only), so there is no existing runnable frontend/backend implementation to audit.

## Architecture overview (current)
- No application architecture exists yet.
- No package manager lockfile, framework config, or source structure existed before this change.

## Main folders/files (before)
- `.gitkeep`

## Frontend stack (current)
- Not present.

## Backend stack (current)
- Not present.

## Auth setup (current)
- Not present.

## Database/schema summary (current)
- Not present.

## Current AI integration points
- Not present.

## Weak points / likely bugs / gaps
- Entire product logic missing.
- No data model.
- No validation/parsing/scoring services.
- No persistence layer abstraction.
- No tests.

## Recommendations before feature work
1. Establish explicit domain schema and migrations.
2. Create a modular ingestion pipeline independent of source channel.
3. Isolate parsing/normalization/scoring into pure functions with unit tests.
4. Add AI provider abstraction and prompt builders.
5. Add dedupe foundation and lifecycle tracking columns.
6. Enforce validation boundaries between transport/domain/persistence.
7. Add CI for unit tests and linting.
