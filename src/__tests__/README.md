# Testing Documentation

This directory contains tests for the UE5 Player Stats Monitor application. The tests are organized by type and component.

## Test Structure

- `components/`: Tests for React components
- `store/`: Tests for Redux reducers and actions
- `integration/`: Tests for integration between Redux and React
- `e2e/`: End-to-end tests for the full application flow
- `utils/`: Test utilities, including a custom render function for Redux components
- `setup.ts`: Setup file for Vitest

## Running Tests

To run all tests once:

```bash
npm test
```

To run tests in watch mode (tests will re-run when files change):

```bash
npm run test:watch
```

## Test Types

### Unit Tests

Unit tests verify that individual components and functions work correctly in isolation.

- Redux reducer tests verify that reducers correctly update state based on actions
- React component tests verify that components render correctly and respond to props and state changes

### Integration Tests

Integration tests verify that different parts of the application work correctly together.

- Redux-React integration tests verify that Redux state changes correctly update React components

### End-to-End Tests

End-to-end tests verify the full application flow, including IPC communication.

- App flow tests simulate the full application flow, including receiving messages from the main process

## Test Utilities

The `test-utils.tsx` file provides a custom render function for testing components that use Redux. This function wraps the component with a Redux Provider and a configurable store.

## Adding New Tests

When adding new components or Redux slices, follow these guidelines:

1. Create a test file with the same name as the component or slice, with a `.test.tsx` or `.test.ts` extension
2. Use the appropriate test utilities for the type of component or function being tested
3. Test both the happy path and edge cases
4. For components that use Redux, use the `renderWithProviders` function from `test-utils.tsx`