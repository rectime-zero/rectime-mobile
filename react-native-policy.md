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

- Presentation → Application / Domain
- Application → Domain / Infrastructure
- Infrastructure → Domain
- Domain → must not depend on outer layers

Navigation acts as a presentation concern.
It must not become a container for business logic.

---

## 3. Module Boundaries & Import Rules

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

## 4. File Responsibility Principle

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

## 5. Screen, Component, and Hook Rules

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

## 6. Navigation Policy

Navigation is a presentation concern.

- Route params must be validated and normalized at the screen boundary.
- Navigation libraries must not define domain models.
- Navigation side effects must be triggered from screens or hooks, not services.
- Deep link parsing must normalize external payloads before they reach Domain or Application layers.
- Navigation configuration must remain declarative and thin.

Do not place business rules inside screen option factories, route guards, or navigation containers.

---

## 7. Data, Storage, and Native Boundary Rules

All external data must be normalized at the boundary.

- API responses must be normalized in service or provider modules.
- AsyncStorage, SecureStore, Keychain, SQLite, and filesystem access belong to infrastructure.
- Native module payloads must be mapped into Domain types before leaving infrastructure.
- Push notification payloads, deep link params, and device metadata are external data.
- `snake_case` must not exist inside Domain types.

Structural similarity is not a reason to bypass transformation.

---

## 8. Native Modules and External SDKs

External SDKs and device APIs must be wrapped by explicit contracts.

- React Native platform APIs must not leak through the application unchecked.
- Analytics, crash reporting, push, camera, location, and biometric APIs must be accessed through replaceable adapters.
- SDK-specific models must not escape infrastructure boundaries.
- Permission status values must be normalized before use in Application or Presentation layers.

Direct SDK usage inside screens or components is prohibited.

---

## 9. State Ownership

State must have a clear owner.

- Navigation state: owned by the navigator
- Screen UI state: owned by the screen or local hook
- Application flow state: owned by feature hooks or use cases
- Server state: fetched in services and consumed through hooks
- Persisted local state: owned by infrastructure and surfaced as normalized values

Do not centralize unrelated concerns into a single global store.

Global state is allowed only when ownership is truly cross-screen and cohesive.

---

## 10. Error Handling Policy

All infrastructure errors must be converted into `AppError`.

`AppError` must:

- Represent application-level meaning
- Include a machine-readable `code` field
- Avoid exposing raw transport, SDK, or native error details

User-facing messages must be derived from `AppError`
through a single transformation function.

UI must not hardcode transport-specific or SDK-specific error handling branches.

---

## 11. Testing Policy

- Domain: pure unit tests
- Services / adapters: tests with mocked API, storage, or SDK boundaries
- Hooks: tests for state transitions and application flow
- Screens: interaction tests with mocked hooks
- Components: render and interaction tests
- Native integrations: thin adapter tests only
- Do not test implementation details; test observable behavior
