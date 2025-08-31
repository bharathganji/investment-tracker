# Investment Tracker

A comprehensive investment tracking application built with Next.js, TypeScript, and Tailwind CSS.

## Overview

This is a full-featured investment tracker application that allows users to:
- Log trades with detailed information
- Track portfolio holdings and performance
- Monitor investment goals and progress
- Analyze performance metrics and charts
- Manage settings and preferences

## Features

### Trade Management
- Add, edit, and delete trades with detailed information
- Track buy/sell orders with quantities, prices, and fees
- Automatic fee calculation and P&L tracking

### Portfolio Tracking
- Real-time portfolio value calculation
- Holdings table with average cost and current value
- Portfolio allocation charts and visualizations

### Performance Analytics
- ROI and CAGR calculations
- Fee analysis and breakdown
- Performance charts and metrics
- Daily/weekly/monthly returns tracking

### Goal Tracking
- Set investment goals with target amounts and deadlines
- Track progress with visual indicators
- Assign assets to specific goals

### User Experience
- Responsive design for mobile and desktop
- Dark/light theme support
- Loading states and error handling
- Toast notifications for user feedback

## Technologies Used

### Core Stack
- [Next.js](https://nextjs.org) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [tRPC](https://trpc.io) - End-to-end typesafe APIs

### UI Components
- [shadcn/ui](https://ui.shadcn.com/) - Reusable component library
- [Recharts](https://recharts.org/) - Charting library for data visualization
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Sonner](https://sonner.emilkowal.dev/) - Toast notifications

### Utilities
- [date-fns](https://date-fns.org/) - Date manipulation utilities
- [react-hook-form](https://react-hook-form.com/) - Form validation
- [zod](https://zod.dev/) - Schema validation
- [uuid](https://github.com/uuidjs/uuid) - Unique ID generation

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Testing
```bash
npm run test
```

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── _components/     # Shared components
│   ├── api/            # API routes
│   ├── dashboard/      # Dashboard page
│   ├── portfolio/      # Portfolio page
│   ├── trade-entry/    # Trade entry page
│   ├── trade-history/  # Trade history page
│   ├── analytics/      # Analytics page
│   ├── goals/          # Goals page
│   └── settings/       # Settings page
├── components/         # shadcn/ui components
├── lib/                # Business logic and utilities
├── server/             # Server-side code
├── styles/             # Global styles
└── types/              # Type definitions
```

## Deployment

This application can be deployed to any platform that supports Next.js applications:
- [Vercel](https://vercel.com/)
- [Netlify](https://netlify.com/)
- [Docker](https://docker.com/)
## Versioning

This project follows [Semantic Versioning](https://semver.org/) and uses [Conventional Commits](https://www.conventionalcommits.org/) for automatic versioning and changelog generation. The version is automatically bumped and released when changes are merged to the main branch.

### Release Process

Releases are automatically generated using [semantic-release](https://github.com/semantic-release/semantic-release) on every push to the main branch. The release process:

1. Analyzes commits since the last release
2. Determines the next version based on commit types (feat = minor, fix = patch, etc.)
3. Generates release notes from commit messages
4. Updates the CHANGELOG.md
5. Creates a GitHub release

### Commit Message Format

We follow the Conventional Commits specification:

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
 │       │
  │       └─⫸ Commit Scope: ui|api|docs|test|chore, etc.
## Documentation

- [Release Process](docs/RELEASE_PROCESS.md) - How releases are automatically generated
- [Conventional Commits](docs/CONVENTIONAL_COMMITS.md) - Commit message guidelines and examples
- [Semantic Release Setup Summary](docs/SEMANTIC_RELEASE_SETUP_SUMMARY.md) - Overview of the semantic release configuration
- [Release Process](docs/RELEASE_PROCESS.md) - How releases are automatically generated
- [Conventional Commits](docs/CONVENTIONAL_COMMITS.md) - Commit message guidelines and examples
  │
 └─⫸ Commit Type: feat|fix|perf|refactor|style|test|build|ci|docs|chore
```

Examples:
- `feat(ui): add trade deletion functionality`
- `fix(api): resolve portfolio calculation error`
- `docs: update README with deployment instructions`


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
