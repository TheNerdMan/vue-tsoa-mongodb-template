# Vue TSOA MongoDB Template - Frontend

Vue 3 frontend application for the Vue TSOA MongoDB Template with user authentication.

# Prerequisites
MS Kiota (for SDK generation)
```bash
dotnet tool install --global Microsoft.OpenApi.Kiota
```

## Tiny usage: Kiota client (http utils)

In the frontend you can import the shared Kiota client and token helpers from `src/utils/http.ts`:

```ts
import apiClient, { setAuthToken, clearAuthToken, isAuthenticated } from './src/utils/http';

// Use the client for authentication endpoints
await apiClient.admin.login();
```

```ts
const doLogin = await apiClient.admin.login();

// After logging in, persist the token and the client will send it on subsequent requests
setAuthToken(doLogin.data, { persist: true });

// To log out and clear the persisted token
clearAuthToken();

if (isAuthenticated()) {
	// show admin UI
}
```

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
