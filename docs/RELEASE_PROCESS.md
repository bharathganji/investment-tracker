# Release Process

This document explains how the automated release process works for this project.

## Overview

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) to automate the release process. On every push to the `main` branch, semantic-release will:

1. Analyze commits since the last release
2. Determine the next version based on commit types
3. Generate release notes from commit messages
4. Update the CHANGELOG.md
5. Create a GitHub release

## Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope: ui|api|docs|test|chore, etc.
  │
  └─⫸ Commit Type: feat|fix|perf|refactor|style|test|build|ci|docs|chore
```

### Commit Types

- `feat`: A new feature (triggers a minor version bump)
- `fix`: A bug fix (triggers a patch version bump)
- `perf`: Performance improvements (triggers a patch version bump)
- `revert`: Reverts a previous commit (triggers a patch version bump)
- `docs`: Documentation changes (triggers a patch version bump)
- `style`: Code style changes (triggers a patch version bump)
- `refactor`: Code refactoring (triggers a patch version bump)
- `test`: Test updates (triggers a patch version bump)
- `build`: Build system changes (triggers a patch version bump)
- `ci`: CI configuration changes (triggers a patch version bump)
- `chore`: Other changes (triggers a patch version bump)

### Breaking Changes

To indicate a breaking change, add `BREAKING CHANGE:` to the commit body:

```
feat(ui): remove deprecated tradeType field

BREAKING CHANGE: The tradeType field has been removed from the trade schema
```

Breaking changes trigger a major version bump.

## Versioning

We follow [Semantic Versioning](https://semver.org/):

- Major version: Breaking changes
- Minor version: New features
- Patch version: Bug fixes and other changes

## Release Process

### Automatic Releases

1. Push commits to the `main` branch
2. GitHub Actions workflow runs semantic-release
3. If there are releasable changes, a new release is created automatically

### Local Testing

To test the release process locally without actually publishing:

```bash
npm run release:dry
```

This will show what would be released without making any changes.

### Manual Release

To manually trigger a release (not recommended):

```bash
npm run release
```

## Changelog

The CHANGELOG.md file is automatically updated with each release. It includes:

- New version number and release date
- Categorized changes (Features, Bug Fixes, etc.)
- Links to commits and pull requests

## Configuration

The release process is configured in:

- `.releaserc.json`: Main configuration file
- `.github/workflows/release.yml`: GitHub Actions workflow
- `package.json`: Scripts for local testing

## Troubleshooting

If releases are not being generated:

1. Check that commits follow the conventional commit format
2. Verify the GitHub Actions workflow is running
3. Check the workflow logs for errors
4. Ensure the GITHUB_TOKEN has the necessary permissions

If you need to make manual adjustments:

1. Update the version in package.json
2. Update CHANGELOG.md
3. Create a git tag manually
4. Push the changes and tag to GitHub

## Repository URL Setup

When running semantic-release locally for the first time, you may encounter an error about a missing repository URL:

```
ENOREPOURL The `repositoryUrl` option is required.
```

This is expected if the repository hasn't been pushed to GitHub yet. Once you push your repository to GitHub, semantic-release will automatically detect the repository URL from the git origin.

If you need to set it manually, you can add it to your package.json:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/your-repo.git"
  }
}
```

Alternatively, you can set it in the `.releaserc.json` configuration:

```json
{
  "repositoryUrl": "https://github.com/your-username/your-repo.git",
  "branches": ["main"],
  ...
}
```