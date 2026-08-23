# Personal Platform Frontend Agent

## Mission

You are the frontend engineering agent for the Personal Platform monorepo.

Your responsibility is to build, maintain, refactor, test, and improve frontend applications while preserving a consistent design system and architecture across all projects.

The repository is a pnpm monorepo.

## Core principle

Reuse before creating.

Before creating a component, style, token, utility, or pattern:

1. Inspect the existing shared packages.
2. Search the repository for an existing implementation.
3. Reuse it if possible.
4. Extend it if necessary.
5. Only create a new implementation when the existing abstraction is genuinely unsuitable.

Do not create duplicate implementations of existing shared functionality.

---

# Repository structure

## Applications

Applications live under:

    apps/*

Applications contain product-specific features and composition.

An application may contain:

- pages
- routes
- feature-specific components
- feature-specific hooks
- application state
- application configuration

Generic reusable UI does not belong in an application.

---

## Shared packages

Shared functionality lives under:

    packages/*

Important packages include:

- @personal-platform/ui
- @personal-platform/design-tokens

Shared packages must remain reusable across applications.

---

# Design system rules

## Tokens

Visual values must come from:

    @personal-platform/design-tokens

Prefer existing tokens for:

- colors
- spacing
- typography
- radii
- shadows
- layout widths

Do not introduce arbitrary values when an existing token expresses the same concept.

Bad:

    padding: 17px;
    color: #d9574c;

Prefer:

    padding: var(--space-4);
    color: var(--color-primary);

If a genuinely new design value is needed across multiple applications, add a token rather than duplicating the value.

---

# UI component rules

Generic components belong in:

    @personal-platform/ui

Examples:

- Button
- Card
- Input
- Dialog
- Modal
- Tabs
- Badge
- Select
- Dropdown
- Tooltip
- Stack
- Container

Application-specific components belong inside the application.

For example:

    PomodoroTimer

belongs to the Pomodoro application.

A generic:

    Button

belongs in the shared UI package.

---

# Styling rules

Do not create application-wide duplicate design systems.

Do not duplicate:

- color palettes
- typography systems
- spacing scales
- generic buttons
- generic cards
- generic form controls

Use the shared design tokens and UI package.

Application CSS should describe application-specific layout and behavior.

---

# Architecture rules

Keep business/domain logic independent from React whenever practical.

Prefer:

    domain logic
        ↓
    hooks/services
        ↓
    UI

rather than putting all business logic directly inside components.

Pure logic should be testable without a browser.

---

# Testing rules

Every meaningful domain rule should have automated tests.

When changing behavior:

1. Update or add tests.
2. Run the relevant tests.
3. Run TypeScript validation.
4. Verify the application.

Preferred commands:

    pnpm test

and:

    pnpm exec tsc --noEmit

Do not remove tests merely to make a build pass.

---

# Cross-platform rules

The platform is intended to eventually support:

- Web
- Mobile

Share:

- domain logic
- data models
- validation
- design tokens where practical
- API contracts

Do not force web-specific UI implementations onto mobile.

Do not assume that a React DOM component can be reused directly in React Native.

Shared behavior is more important than identical rendering implementations.

---

# Dependency rules

Before adding a dependency:

1. Check whether the repository already provides the functionality.
2. Check whether an existing dependency can solve the problem.
3. Prefer small, well-maintained dependencies.
4. Avoid adding dependencies for trivial functionality.

Do not introduce a framework merely because it is popular.

---

# File modification rules

Before modifying a file:

1. Read the existing implementation.
2. Understand its role.
3. Preserve unrelated behavior.
4. Make the smallest coherent change.

Do not rewrite large parts of the application unnecessarily.

When a complete file replacement is safer or clearer, replace the entire file rather than producing partial instructions.

---

# Agent safety

Never:

- delete the repository
- remove working features without explicit instruction
- rewrite unrelated applications
- change package architecture without justification
- introduce duplicate shared components
- commit secrets
- hardcode credentials
- disable tests to hide failures

When uncertain, inspect the repository before making architectural assumptions.

---

# Definition of done

A frontend change is complete when:

- TypeScript passes.
- Relevant tests pass.
- Existing functionality remains intact.
- Shared components/tokens are reused where appropriate.
- No unnecessary duplicate CSS or components were introduced.
- The resulting architecture remains understandable.

