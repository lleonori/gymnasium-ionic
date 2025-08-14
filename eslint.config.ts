import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";
import path from "path";

export default [
  // Ignora cartelle e file generati
  {
    ignores: [
      "dist/**",
      "coverage/**",
      "android/**",
      "ios/**",
      "build/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "eslint.config.ts",
      "vitest.config.ts",
      "vite.config.ts",
      "capacitor.config.ts",
      "playwright.config.ts",
      "e2e/**",
    ],
  },

  // Base config JS + TS con type-check
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: path.resolve(__dirname),
      },
    },
  },

  // Config per React + Hooks + Accessibilità
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11y,
      import: importPlugin,
      "unused-imports": unusedImports,
    },
    rules: {
      // React
      "react/react-in-jsx-scope": "off", // JSX moderno non richiede import React
      "react/jsx-uses-react": "off",
      "react/prop-types": "off", // Usiamo TS per i tipi
      "react/jsx-curly-brace-presence": [
        "warn",
        { props: "never", children: "never" },
      ],

      // React Hooks
      "react-hooks/rules-of-hooks": "error", // Regole fondamentali
      "react-hooks/exhaustive-deps": "warn", // Suggerisce deps mancanti

      // Accessibilità
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/no-autofocus": "warn",

      // Import
      "import/order": [
        "warn",
        {
          groups: [
            ["builtin", "external"],
            "internal",
            ["parent", "sibling"],
            "index",
          ],
          "newlines-between": "always",
        },
      ],
      "import/no-unresolved": "off", // Evita problemi con alias o Capacitor

      // Unused imports/vars
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // Best practices generali
      "no-console": ["warn", { allow: ["warn", "error"] }],
      eqeqeq: ["error", "always"],
      "no-var": "error",
      "prefer-const": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
