// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/**"], // Ignora tutti i file nella directory dist
  },
  eslint.configs.recommended,
  tseslint.configs.recommended
);
