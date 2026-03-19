# React Native Policy

## 1. Scope

- This document defines implementation rules for React Native projects.
- It derives from the architectural principles defined in AGENTS.md.
- It does not redefine abstract architectural theory.
- Native module implementation details are out of scope unless they affect application boundaries.

---

## 2. Architectural Layer Mapping

The application is organized into logical layers:

- Presentation: screens, presentational components, navigation UI
- Application: hooks and use cases (state orchestration and procedural flow)
- Domain: normalized types and pure business logic
- Infrastructure: API, storage, device APIs, native bridges, external SDKs

Dependency direction must always move inward.

- Presentation -> Application / Domain
- Application -> Domain / Infrastructure
- Infrastructure -> Domain
- Domain -> must not depend on outer layers

Navigation acts as a presentation concern.
It must not become a container for business logic.

---

## 3. Physical Directory Policy

The project uses a feature-first structure.

Top-level `src` directories are:

```txt
src/
  assets/
  components/
  config/
  features/
  hooks/
  navigation/
  store/
  theme/
  utils/
```

Rules:

- `features` is the primary application module boundary.
- Top-level screens must not be created.
- Top-level types must not be created by default.
- Top-level app must not be created by default.
- Shared modules must exist only when sharing is real and established.
- Directory names must be responsibility-revealing.

---

## 4. Directory Responsibilities

### `src/assets`

Static resources used by the application.

Examples:

- images
- icons
- fonts
- static animation files

Do not place executable logic here.

### `src/components`

Reusable UI components shared across multiple features.

Examples:

- buttons
- inputs
- dialogs
- generic layout primitives
- shared visual wrappers

Rules:

- Components here must be feature-agnostic.
- If a component is specific to one feature, it belongs inside that feature.
- Shared UI must not contain feature business rules.

### `src/config`

Application-level configuration and stable system constants.

Examples:

- route names
- storage keys
- environment access
- API base configuration
- app-wide settings

Rules:

- Use `config` as the single top-level location for configuration-like values.
- Do not split configuration values between `config` and a separate top-level `constants` directory.
- Values here must be stable, explicit, and non-feature-owned.

### `src/features`

Primary feature modules.

Each feature owns its screens, feature-specific components, local hooks, types, services, and domain-specific logic as appropriate.

Example:

```txt
src/
  features/
    auth/
      components/
      hooks/
      screens/
      services/
      types.ts
      model.ts
    profile/
      components/
      hooks/
      screens/
      services/
      types.ts
```

Rules:

- Feature code must be colocated with the feature that owns it.
- Screens are feature-owned modules.
- Feature-specific types must live inside the feature.
- Feature-specific services must live inside the feature unless they are truly cross-feature.
- A feature must expose a clear public surface when needed.

### `src/hooks`

Shared React hooks used across features.

Examples:

- app lifecycle hooks
- keyboard hooks
- shared async hooks
- shared viewport or safe-area hooks

Rules:

- Hooks here must be cross-feature.
- Feature-specific hooks belong inside the owning feature.
- Hooks may orchestrate logic, but must not become a dumping ground for unrelated code.

### `src/navigation`

Navigation definitions and route composition.

Examples:

- root navigator
- stack definitions
- tab definitions
- route binding configuration

Rules:

- Navigation must remain thin.
- Navigation may reference feature-owned screens directly.
- Navigation must not contain business rules, data shaping, or feature orchestration beyond routing concerns.
- Navigation must not become a substitute feature layer.

### `src/store`

Global state for cross-screen or cross-feature concerns.

Examples:

- authenticated session state
- app-wide UI state
- global preference state
- cross-feature coordination state

Rules:

- Only state with real cross-feature or cross-screen ownership belongs here.
- Feature-local state must remain inside the feature.
- Store modules must not become a hidden application layer containing unrelated logic.

### `src/theme`

Design system definitions.

Examples:

- colors
- spacing
- typography
- radius
- elevation
- shared tokens
- theme helpers

Rules:

- Theme defines presentation tokens, not feature behavior.
- Theme values must be reusable and app-wide.
- Feature-owned visual constants should stay inside the feature unless they become shared design tokens.

### `src/utils`

Shared pure utilities.

Examples:

- formatters
- parsers
- value transforms
- pure helpers
- generic validation helpers

Rules:

- Utilities here must be framework-independent when possible.
- Utilities must be pure unless there is a strong reason otherwise.
- React-dependent logic does not belong here.
- Feature-specific utilities belong inside the owning feature.

---

## 5. Module Boundaries & Import Rules

### Allowed Imports

- Screens and components may import hooks and Domain types.
- Hooks may import Domain types and service public functions.
- Services may import Domain types and infrastructure providers.
- Providers may import React Native APIs, native bridges, and external SDKs.

### Forbidden Imports

- Screens and components must not import provider implementations directly.
- Hooks must not import DTO, Raw, or ApiResponse definitions.
- Domain must not import from screens, hooks, services, or native modules.
- UI must not depend on transport formats or SDK response shapes.

### Boundary Entry Rule

Infrastructure modules must expose meaningful functions.
Consumers must import those functions directly.
Avoid barrel exports for architectural enforcement.

---

## 6. Feature Structure Policy

Features are the default unit of organization.

A feature may contain:

```txt
feature-name/
  components/
  hooks/
  screens/
  services/
  types.ts
  model.ts
  utils.ts
  index.ts
```

Not every feature requires every subdirectory or file.
Only create structure that is justified by actual complexity.

Rules:

- Organize by ownership first, not by file type first.
- Keep related files physically close to the feature that owns them.
- Prefer small, explicit modules over broad shared buckets.
- Promote code to shared top-level directories only after reuse is established.

---

## 7. File Responsibility Principle

Each file must represent a single cohesive responsibility.

- One screen file must correspond to one screen responsibility.
- One hook file must correspond to one use case or state concern.
- One service file must correspond to one external resource or action.
- One adapter file must correspond to one boundary integration.
- Helper functions are allowed if they support the same responsibility.
- Avoid grouping multiple unrelated actions into a single file.
- Increasing file count is acceptable if it preserves structural clarity.
- If a file name requires "and" to describe its purpose, split it.

---

## 8. Screen, Component, and Hook Rules

### Screens

Screens compose UI and connect navigation to application logic.

Screens may:

- Read route params
- Call hooks
- Compose presentational components
- Trigger navigation

Screens must not:

- Call APIs directly
- Read from AsyncStorage directly
- Contain domain rule evaluation
- Depend on external response shapes

### Components

Components are presentational by default.

Components may:

- Receive Domain types or UI-safe view models
- Emit user interaction events
- Hold local UI state

Components must not:

- Access services directly
- Normalize external data
- Contain navigation-specific business decisions

### Hooks

Hooks represent application-layer orchestration.

Hooks may:

- Coordinate screen state
- Call services
- Convert AppError into UI-consumable state
- Bridge user intent into application flow

Hooks must not:

- Expose Raw or DTO types
- Access native modules directly unless they are explicit infrastructure contracts
- Embed presentation layout logic

---

## 9. Screen Policy

Screens are feature-owned modules.

Rules:

- Do not create a top-level `src/screens`.
- Screen files must live inside their owning feature.
- A screen may compose feature UI, call hooks, and bind navigation input/output.
- A screen must not become a transport adapter or SDK boundary.

Example:

```txt
src/
  features/
    auth/
      screens/
        LoginScreen.tsx
```

---

## 10. Navigation Policy

Navigation is a presentation concern.

- Route params must be validated and normalized at the screen boundary.
- Navigation libraries must not define domain models.
- Navigation side effects must be triggered from screens or hooks, not services.
- Deep link parsing must normalize external payloads before they reach Domain or Application layers.
- Navigation configuration must remain declarative and thin.

Do not place business rules inside screen option factories, route guards, or navigation containers.

---

## 11. Type Policy

Types are colocated with ownership.

Rules:

- Do not create a top-level `src/types` by default.
- Feature-specific types must live inside the owning feature.
- Shared types may be extracted only when they are stable, cross-feature, and meaningfully reused.
- API response shapes must not be treated as app-wide truth by default.
- Domain types should represent application meaning, not transport shape.

---

## 12. State Policy

State must have a clear owner.

- Navigation state: owned by the navigator
- Screen UI state: owned by the screen or local hook
- Application flow state: owned by feature hooks or use cases
- Server state: fetched in services and consumed through hooks
- Persisted local state: owned by infrastructure and surfaced as normalized values

Do not centralize unrelated concerns into a single global store.

Global state is allowed only when ownership is truly cross-screen and cohesive.

---

## 13. Data Boundary Policy

All external data must be normalized at the boundary.

- API responses must be normalized in service or provider modules.
- AsyncStorage, SecureStore, Keychain, SQLite, and filesystem access belong to infrastructure.
- Native module payloads must be mapped into Domain types before leaving infrastructure.
- Push notification payloads, deep link params, and device metadata are external data.
- `snake_case` must not exist inside Domain types.

Structural similarity is not a reason to bypass transformation.

---

## 14. Hook and Utility Policy

Hooks and utilities serve different purposes and must remain distinct.

Rules:

- `hooks` contains React-aware shared logic.
- `utils` contains shared non-React helpers.
- A hook must not be stored under `utils`.
- A pure helper must not be stored under `hooks`.
- This separation is mandatory.

---

## 15. Native Modules and External SDKs

External SDKs and device APIs must be wrapped by explicit contracts.

- React Native platform APIs must not leak through the application unchecked.
- Analytics, crash reporting, push, camera, location, and biometric APIs must be accessed through replaceable adapters.
- SDK-specific models must not escape infrastructure boundaries.
- Permission status values must be normalized before use in Application or Presentation layers.

Direct SDK usage inside screens or components is prohibited.

---

## 16. Error Handling Policy

All infrastructure errors must be converted into `AppError`.

`AppError` must:

- Represent application-level meaning
- Include a machine-readable `code` field
- Avoid exposing raw transport, SDK, or native error details

User-facing messages must be derived from `AppError`
through a single transformation function.

UI must not hardcode transport-specific or SDK-specific error handling branches.

---

## 17. Shared Code Promotion Policy

Code becomes shared only when real reuse exists.

Rules:

- Do not move code to top-level shared directories preemptively.
- Duplication is temporarily acceptable when ownership is still feature-local.
- Promote to shared only after reuse is proven and the abstraction is stable.
- Shared code must remain generic and must not carry feature assumptions.

---

## 18. Naming Policy

Directory and module names must reveal responsibility.

Rules:

- Avoid ambiguous names.
- Avoid catch-all names that hide ownership.
- Avoid broad buckets that collect unrelated code.
- Prefer names that describe purpose directly.

Examples of preferred names:

- `navigation`
- `theme`
- `store`
- `config`

Examples to avoid unless strictly defined:

- `common`
- `helpers`
- `misc`
- `stage`

If a concept cannot be named clearly, its responsibility is probably not yet clear enough.

---

## 19. Dependency Rules

The following are mandatory:

- A shared top-level module must not depend on a specific feature.
- A feature may depend on shared modules.
- A feature should not depend deeply on internal files of another feature unless an explicit boundary is defined.
- Domain logic must not depend on presentation details.
- Infrastructure concerns must not be imported directly into generic shared UI.
- When cross-feature dependency is required, expose an explicit interface or public entrypoint.

---

## 20. Testing Policy

- Domain: pure unit tests
- Services / adapters: tests with mocked API, storage, or SDK boundaries
- Hooks: tests for state transitions and application flow
- Screens: interaction tests with mocked hooks
- Components: render and interaction tests
- Native integrations: thin adapter tests only
- Do not test implementation details; test observable behavior

---

## 21. Default Position

When there is uncertainty:

- prefer feature ownership
- prefer colocation
- prefer thinner top-level structure
- prefer explicit boundaries
- prefer shared extraction later, not earlier

This is the default standard for the codebase.

---

## 22. Styling Policy

Use React Native default styling as the standard.

### Default Rule

- Use `StyleSheet.create` for component styles.
- Use style arrays for state-based variants when needed.
- Use inline style objects only for truly runtime-calculated values that do not fit a stable stylesheet.

### Theme Rule

If a value comes from app theme tokens, prefer `StyleSheet.create` with `theme.colors.*`.

- Theme tokens are the single source of truth for semantic colors.
- Do not duplicate semantic colors in unrelated local constants.

### Component Rule

Inside a component, keep style ownership consistent.

- Layout, spacing, radius, typography, and color should normally live in the same stylesheet.
- Avoid mixing large inline objects with stylesheet-driven components.
- If a style difference is only a state variant, prefer `[styles.base, isActive ? styles.active : null]`.

### Runtime Rule

Inline style objects are allowed only when values are computed from runtime context.

Examples:

- animated values
- platform-derived offsets
- dimensions derived from props

Even in these cases, keep the inline part as small as possible and move stable values into `StyleSheet.create`.

### Migration Rule

- New code must follow React Native default styling.
- Existing code should be migrated incrementally when touched.
- Do not introduce new styling layers unless there is a clear technical reason.
