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
