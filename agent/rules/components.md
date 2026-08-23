# Component Rules

## Before creating a component

Search:

    packages/ui
    apps/*

for existing components.

## Shared component

A component belongs in @personal-platform/ui when:

- it is generic
- multiple applications can use it
- it has no product-specific business logic

## Application component

A component belongs in an application when:

- it represents a product concept
- it contains product-specific behavior
- it is unlikely to be reused elsewhere

Examples:

    PomodoroTimer
    BreathingExercise
    HabitCalendar

## Component API

Prefer small, explicit APIs.

Avoid:

- unnecessary prop complexity
- deeply nested configuration objects
- hidden global state

Prefer composition where appropriate.

Example:

    <Card>
      <CardHeader />
      <CardContent />
    </Card>
