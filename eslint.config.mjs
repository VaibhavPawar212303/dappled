import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    // Override or disable specific rules
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-vars": "warn", // or "off"
      "@typescript-eslint/no-non-null-asserted-optional-chain": "warn", // or "off"
      "react-hooks/rules-of-hooks": "warn", // be cautious with this one!
      "no-var": "off"
    }
  }
];

export default eslintConfig;
