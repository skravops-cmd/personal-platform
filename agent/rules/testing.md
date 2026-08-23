# Testing Rules

Tests should verify behavior, not implementation details.

Prioritize testing:

- domain logic
- state transitions
- validation
- important user interactions

Avoid tests that merely verify internal implementation details.

## Domain logic

Pure functions should have direct unit tests.

Example:

    getNextMode("work", 4)

should be tested independently from React.

## Before completing a change

Run:

    pnpm test

and:

    pnpm exec tsc --noEmit

If either fails, investigate the failure rather than disabling the check.
