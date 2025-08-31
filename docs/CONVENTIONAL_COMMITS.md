# Conventional Commits Quick Reference

This document provides a quick reference for the conventional commit types used in this project.

## Commit Types

| Type       | Description               | Version Bump | Changelog Section        |
|------------|---------------------------|--------------|--------------------------|
| `feat`     | New feature               | Minor        | Features                 |
| `fix`      | Bug fix                   | Patch        | Bug Fixes                |
| `perf`     | Performance improvement   | Patch        | Performance Improvements |
| `revert`   | Reverts a previous commit | Patch        | Reverts                  |
| `docs`     | Documentation changes     | Patch        | Documentation            |
| `style`    | Code style changes        | Patch        | Styles                   |
| `refactor` | Code refactoring          | Patch        | Code Refactoring         |
| `test`     | Test updates              | Patch        | Tests                    |
| `build`    | Build system changes      | Patch        | Build System             |
| `ci`       | CI configuration changes  | Patch        | Continuous Integration   |
| `chore`    | Other changes             | Patch        | Chores                   |

## Examples

### Features
```
feat(ui): add trade deletion functionality

Added delete trade functionality with confirmation dialog and toast notifications.
```

### Bug Fixes
```
fix(api): resolve portfolio calculation error

Fixed issue where portfolio values were not updating correctly after trade deletion.
```

### Breaking Changes
```
feat(ui): remove deprecated tradeType field

BREAKING CHANGE: The tradeType field has been removed from the trade schema and related components.
```

## Scope Examples

Common scopes used in this project:

- `ui`: User interface components and pages
- `api`: API routes and server functions
- `store`: Redux store and state management
- `chart`: Chart components and visualizations
- `form`: Form components and validation
- `auth`: Authentication related changes
- `docs`: Documentation updates

## Commit Message Structure

```
<type>(<scope>): <short summary>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Keep the subject line under 72 characters. Use the body to explain what and why, not how.