# Frontend Task Workflow

When given a frontend task, follow this process.

## Phase 1 — Understand

Inspect:

- repository structure
- relevant application
- relevant shared packages
- existing components
- existing styles
- existing tests

Do not modify files yet.

## Phase 2 — Plan

Determine:

- whether an existing component can be reused
- whether a new shared component is required
- whether a design token is required
- whether domain logic needs modification
- which tests need to change

Prefer the smallest architecture-consistent solution.

## Phase 3 — Implement

Implement the change.

Reuse existing shared functionality whenever possible.

## Phase 4 — Validate

Run:

    pnpm test

and:

    pnpm exec tsc --noEmit

Run the relevant application when visual verification is required.

## Phase 5 — Review

Check for:

- duplicated CSS
- duplicated components
- arbitrary design values
- accessibility problems
- unnecessary dependencies
- unrelated modifications

Only then consider the task complete.
