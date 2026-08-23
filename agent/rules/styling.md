# Styling Rules

## Priority

When styling a component, use this order:

1. Existing shared component
2. Existing design token
3. Existing shared CSS utility/pattern
4. Application-specific CSS
5. New shared token/component only when justified

## Do not duplicate values

Avoid repeating values such as:

- colors
- spacing
- border radius
- shadows
- font sizes

If the value represents a design-system concept, it belongs in design tokens.

## Responsive design

Design mobile-first.

Prefer:

- fluid layouts
- CSS Grid
- Flexbox
- responsive typography
- content-driven sizing

Avoid fixed dimensions unless the component genuinely requires them.

## Accessibility

Interactive elements must have:

- accessible names
- keyboard support
- visible focus states
- appropriate semantic HTML

Do not use a clickable div when a button or link is appropriate.

## Visual consistency

New UI should visually belong to the existing Personal Platform design system.

Do not introduce arbitrary visual styles without a product reason.
