# Testing & Jerk — Developer and User Guide

This document explains how to set up the project for development and testing, how to run unit tests (Jest + ts-jest), and notes about the `jerk` dependency included in this repository.

**Contents**
- Prerequisites
- Install dependencies
- Using `jerk` (notes)
- Running tests (Jest)
- Writing new tests
- Troubleshooting / PowerShell notes

---

## Prerequisites

- Node.js (recommended LTS): 18.x or newer. Confirm with `node -v`.
- npm (bundled with Node) or a compatible package manager (yarn, pnpm).
- Git (for cloning and working with the repo).
- On Windows, an elevated PowerShell is not required, but you may need to adjust ExecutionPolicy (see below) when running npm scripts in PowerShell.

## Install dependencies

From the repository root run:

```powershell
npm install
```

This will install all dependencies listed in `package.json` (including `jerk`, `jest`, `ts-jest`, and other runtime/dev dependencies).

If you prefer to use `npm.cmd` explicitly in PowerShell (avoids some ExecutionPolicy issues):

```powershell
npm.cmd install
```

---

## Using `jerk` (notes)

- This repository includes the `jerk` npm package as a dependency (see `package.json`). The codebase does not contain a direct source reference to `jerk` in the application code (it appears only in `package.json` and the lockfile). If your feature requires `jerk`, consult the package's documentation on npm: https://www.npmjs.com/package/jerk
- Typical steps to use `jerk` in your code:
  - Import or require it in the module that needs it: `import jerk from 'jerk'` (or `const jerk = require('jerk')`).
  - Follow the package's API to initialize a client and call its functions. Environment variables (API keys) should be stored in `.env` and referenced via `process.env`.
- If you add code that uses `jerk`, ensure you add appropriate mocks in tests (see the testing section below) so unit tests do not make network calls.

---

## Running tests (Jest + ts-jest)

This project uses Jest with `ts-jest` to run TypeScript tests. The Jest config is in `jest.config.cjs` and the test setup file is `jest.setup.ts`.

Common commands (from project root):

```powershell
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run a single test file (example)
npx jest __tests__/auth/confirm.test.ts

# Or run by pattern
npx jest -t "confirm"
```

Notes:
- The `test` script in `package.json` runs `jest --passWithNoTests` which allows running even if there are no tests present.
- If PowerShell blocks `npm` scripts due to ExecutionPolicy, either run the commands in Command Prompt (`cmd`) or call `npm.cmd` in PowerShell. See Troubleshooting below.

---

## Writing new tests

- Put unit tests under the `__tests__` folder or alongside source files using the `.test.ts` or `.test.tsx` suffix.
- Use the existing tests as examples:
  - `__tests__/api/events.test.ts` — unit tests that mock `@supabase/supabase-js` and `next/server` to validate request handling logic for the events API route.
  - `__tests__/auth/confirm.test.ts` — tests that mock `@/lib/supabase/server` and `next/navigation`.
- When testing API route functions exported as named functions (like `POST` or `GET`), call them directly and pass a minimal `Request`-like object with `json()` or `url` as needed.
- Mock external services (Supabase, network, storage) using `jest.mock(...)`. Example patterns used in this repo:

```ts
// Mocking a module
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      insert: jest.fn(() => ({ select: jest.fn(() => ({ single: jest.fn() })) })),
    })),
  })),
}));
```

- Use `moduleNameMapper` in `jest.config.cjs` to map the `@/` alias to the project root (already configured).

---

## Troubleshooting / PowerShell notes

- PowerShell may block script execution for `npm` with an error like: "cannot be loaded because running scripts is disabled on this system." If you see this, options:
  - Run the same command in Command Prompt (`cmd.exe`):

    ```cmd
    npm test
    ```

  - Call `npm.cmd` from PowerShell (works without changing ExecutionPolicy):

    ```powershell
    npm.cmd test
    ```

  - Or change the ExecutionPolicy for the current user:

    ```powershell
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
    # then run
    npm test
    ```

    Only change ExecutionPolicy if you understand the security implications.

---

## Adding tests for new features

- When you add a new API route or server-side module, write unit tests that:
  - Validate input parsing and validation errors.
  - Mock external services (Supabase, third-party APIs) and assert behavior when those services return success or error.
  - Keep tests self-contained and avoid hitting real external services.

## Useful commands summary

```powershell
npm install
npm test
npm run test:watch
npm run test:coverage
npx jest path/to/testfile.test.ts
```

If you want, I can also add a short CONTRIBUTING-testing section to the main `README.md` or add example test templates for common patterns (Supabase mocks, Next.js route handlers). Tell me which you prefer.
