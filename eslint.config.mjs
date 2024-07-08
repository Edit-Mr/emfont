import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: globals.browser
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: 'emfont' }]
    }
  },
  pluginJs.configs.recommended,
];
