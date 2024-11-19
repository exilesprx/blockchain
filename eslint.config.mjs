import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "**/node_modules",
        "**/jest.config.ts",
        "**/babel.config.js",
        "build/**/*",
        "coverage/**/*",
    ],
}, ...compat.extends("airbnb-base", "airbnb-typescript/base"), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        globals: {
            ...globals.node,
        },

        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",

        parserOptions: {
            project: "tsconfig.eslint.json",
        },
    },

    settings: {
        "import/resolver": {
            node: {
                extensions: [".js", ".ts"],
            },
        },
    },

    rules: {
        "no-console": 2,

        "import/extensions": ["error", "ignorePackages", {
            js: "never",
            ts: "never",
        }],
    },
}, {
    files: ["src/**/*/ts"],
}, {
    files: ["**/*.test.ts"],

    languageOptions: {
        globals: {
            ...globals.jest,
        },
    },
}];
