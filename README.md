# GYMNASIUM-IONIC

GYMNASIUM-IONIC is a React + Ionic (with Capacitor for native mobile app) project for Gymnasium gym.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install all modules you need.

```bash
npm i
```

## Run the application

For running the application on IOS use:
flag --mode development or --mode production

```bash
npx vite build --mode development && npx cap copy ios && npx cap run ios --target=AD6EBF25-06D7-47BD-858D-BC948EF0F4A7
```

For running the application on ANDROID use:
flag --mode development or --mode production

```bash
npx vite build --mode development && npx cap copy android && npx cap run android --target=Pixel_8_API_33
```

For running the application on BROWSER use:

```bash
npx vite --open --host=0.0.0.0 --port=8100
```

For running the application on real device use (Google Pixel 8 Pro):

```bash
npx vite build --mode production && npx cap copy android && npx cap run android --target=37171FDJG007N0
```

For running the application on real device use (Iphone 7):

```bash
npx vite build --mode production && npx cap copy ios && npx cap run ios --target=2a2bf6075987ccc23d490f2b4f93eaad1bf83e99
```

## Run e2e tests

Runs the end-to-end tests.

```bash
  npx playwright test
```

Starts the interactive UI mode.

```bash
  npx playwright test --ui
```

Runs the tests only on Desktop Chrome.

```bash
  npx playwright test --project=chromium
```

Runs the tests in a specific file.

```bash
  npx playwright test example
```

Runs the tests in debug mode.

```bash
  npx playwright test --debug
```

Auto generate tests with Codegen.

```bash
  npx playwright codegen
```

Runs the tests with specific project

```bash
npx playwright test --ui --project=system-administrator-chromium
```
