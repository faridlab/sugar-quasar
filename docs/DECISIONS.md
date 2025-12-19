# Sugar Quasar v2.0 - Architecture Decisions Summary

This document summarizes all agreed-upon decisions for the project rewrite.

## Final Decisions

### Technology Stack

| Category | Choice | Rationale |
|----------|--------|-----------|
| **Framework** | Vue 3 (latest) | Modern composition API, better TypeScript |
| **UI Framework** | Quasar 2 (latest) | Container for the app, powerful built-in features |
| **Build Tool** | Vite 6.x | Fast, modern, Quasar-Vite support |
| **Runtime** | Bun | Fast JavaScript runtime |
| **Package Manager** | Yarn 4.x | Workspaces support, reliability |
| **Language** | TypeScript (very strict) | Type safety, better DX |
| **State Management** | Pinia | Modern Vue 3 state management |
| **Server State** | TanStack Query | Caching, background refetch, optimistic updates |
| **Validation** | Zod | TypeScript inference, schema-first |
| **HTTP Client** | Axios | Mature, interceptors, well-typed |
| **Testing** | Vitest + Playwright | Unit + E2E testing |
| **i18n** | Vue I18n 10.x | Multi-language support |

### Architecture

| Aspect | Choice | Details |
|--------|--------|---------|
| **Pattern** | Full DDD + Clean Architecture | Entities, Value Objects (no Domain Events - handled in handlers) |
| **CQRS** | Yes | Separate Commands (write) and Queries (read) |
| **SOLID** | Yes | All principles applied |
| **Quasar Role** | Application Container | Quasar wraps everything, DDD layers inside |
| **Project Structure** | Single Package | Folder-based layer separation |

### Implementation Approach

| Aspect | Choice |
|--------|--------|
| **Forms/Tables** | Explicit typed components (not dynamic generation) |
| **Migration** | Fresh start (new Quasar project) |
| **Feature Scope** | Keep all current features |
| **TypeScript Strictness** | Very strict (noUncheckedIndexedAccess, etc.) |

## Quick Reference: Layer Responsibilities

```
┌────────────────────────────────────────────────────────────────┐
│ QUASAR (Container)                                             │
│ - quasar.config.ts                                             │
│ - Boot files                                                   │
│ - CLI commands                                                 │
├────────────────────────────────────────────────────────────────┤
│ PRESENTATION (Vue + Quasar)                                    │
│ - Components (use Quasar components)                           │
│ - Pages & Layouts                                              │
│ - Composables                                                  │
│ - Pinia Stores (thin, UI state only)                          │
│ - Directives (v-can)                                           │
├────────────────────────────────────────────────────────────────┤
│ APPLICATION (Pure TypeScript)                                  │
│ - Commands & Command Handlers                                  │
│ - Queries & Query Handlers                                     │
│ - DTOs & Mappers                                               │
│ - Ports (interfaces for external services)                     │
├────────────────────────────────────────────────────────────────┤
│ DOMAIN (Pure TypeScript - NO DEPENDENCIES)                     │
│ - Entities (rich models with business logic)                   │
│ - Value Objects (immutable, self-validating)                   │
│ - Repository Interfaces                                        │
│ - Domain Services                                              │
│ - Result Pattern (error handling)                              │
│ - NO Domain Events (side effects in handlers/composables)      │
├────────────────────────────────────────────────────────────────┤
│ INFRASTRUCTURE (Pure TypeScript)                               │
│ - Repository Implementations                                   │
│ - API Client (Axios)                                           │
│ - External Service Adapters                                    │
│ - Storage Adapters                                             │
└────────────────────────────────────────────────────────────────┘
```

## Quasar Features to Leverage

- **$q.notify()** - Toast notifications
- **$q.dialog()** - Confirmation dialogs
- **$q.loading** - Loading overlay
- **$q.loadingBar** - Navigation progress
- **$q.localStorage/sessionStorage** - Storage wrappers
- **$q.dark** - Dark mode
- **$q.screen** - Responsive breakpoints
- **QTable** - Data tables
- **QForm** - Form handling
- **QLayout/QPage/QDrawer** - Layouts
- **Boot files** - App initialization sequence

## Features to Rebuild

1. **Authentication & Authorization**
   - Login/Logout/Register
   - Password reset
   - Email verification
   - Permission-based access (`v-can` directive)

2. **User Management**
   - CRUD operations
   - Role assignment
   - Profile management

3. **Role & Permission Management**
   - Role CRUD
   - Permission assignment

4. **Resource Management**
   - Countries, Provinces, Cities
   - Addresses, Contacts
   - Banners, FAQ, Terms
   - System Parameters
   - Notifications
   - File Management

5. **UI Features**
   - Responsive layouts
   - Dark mode support
   - Loading states
   - Error handling
   - i18n support

## Migration Phases

1. **Phase 1: Project Setup**
   - Create new Quasar + Vite + TypeScript project
   - Configure strict TypeScript
   - Setup Pinia + TanStack Query
   - Configure Vitest + Playwright

2. **Phase 2: Domain Layer**
   - Core abstractions (Entity, ValueObject, AggregateRoot)
   - Result pattern
   - User, Role, Permission entities
   - Repository interfaces

3. **Phase 3: Application Layer**
   - Auth commands/queries
   - User commands/queries
   - DTOs and mappers

4. **Phase 4: Infrastructure Layer**
   - Axios setup
   - Repository implementations
   - Storage adapters

5. **Phase 5: Presentation Layer**
   - Base components
   - Layouts
   - Auth pages
   - User management pages
   - Other feature pages

6. **Phase 6: Integration & Testing**
   - Wire up DI
   - Unit tests
   - E2E tests

---

## Status: AGREED

All decisions above have been discussed and agreed upon. Ready to proceed with implementation when confirmed.
