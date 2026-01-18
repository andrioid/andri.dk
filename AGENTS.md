# Project Agent Guidelines

## Build, Lint, and Test Commands

### Build Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Build with type checking
npm run check

# Preview production build
npm run preview

# Format code with Prettier
npm run format

# Verify code formatting
npm run verify:formatting

# Verify TypeScript types
npm run verify:types
```

### Test Commands

This project uses Astro with no explicit test framework mentioned.
For running single tests, if using Jest or Vitest:

- `npm test` or `npm run test` to run all tests
- `npm run test -- --watch` for watch mode
- `npm run test -- path/to/test-file` for specific file

### Development

```bash
# Run in development mode
npm run dev

# Verify types
npm run verify:types

# Run linter
npx eslint src/

# Verify formatting
npm run verify:formatting
```

## Code Style Guidelines

### General

- Follow JavaScript/TypeScript best practices
- Use TypeScript for type safety
- Prefer functional programming style where appropriate
- Maintain consistent file naming (kebab-case for files, PascalCase for components)
- Use absolute imports with path aliases (@components, @lib, @layouts, ~)

### Imports

- Group imports: standard library, external packages, internal imports
- Use absolute imports with path aliases for internal files
- Sort imports alphabetically where possible
- Import types using `import type` syntax

### Formatting

- Use Prettier for code formatting (configured)
- Follow TypeScript/JavaScript style conventions
- Maintain consistent indentation (use project's .editorconfig if available)
- Use camelCase for variables and functions
- Use PascalCase for component names
- Use UPPER_CASE for constants

### Naming Conventions

- Variables: camelCase
- Components: PascalCase
- Constants: UPPER_CASE
- Files: kebab-case
- Functions: camelCase
- Interfaces and Types: PascalCase
- React components: PascalCase

### Error Handling

- Use TypeScript types to prevent runtime errors
- Implement proper try-catch blocks for async operations
- Use error boundaries in React when needed
- Log errors appropriately with context when needed

### Documentation

- Use JSDoc for functions and complex code blocks
- Comment complex logic and non-obvious code decisions
- Maintain clear and concise documentation

### Dependencies

- Prioritize minimal dependencies
- Keep dependency versions consistent
- Use peer dependencies appropriately for components
- Regularly check for security vulnerabilities

## Configuration Files

- ESLint configuration in `.eslintrc.js` with TypeScript parser
- Prettier with Astro plugin in `.prettierrc.mjs`
- TypeScript configuration in `tsconfig.json` with strict mode
- Astro configuration in `astro.config.mjs`

## CI/CD and Quality Checks

- Uses Astro for build system
- Type checking with TypeScript
- Code formatting with Prettier
- ESLint for code quality
- GitHub Actions workflows (if present)

## Special Considerations

- This is an Astro project with React integration
- Uses TypeScript for type safety
- Supports modern JavaScript features
- Follows Astro's component structure and conventions
- Uses Tailwind CSS for styling
