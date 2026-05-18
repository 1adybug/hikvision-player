import { defineConfig } from "@1adybug/eslint"

export default defineConfig({
    target: "browser",
    directories: {
        web: "src/**/*.{ts,tsx}",
    },
    ignores: ["assets/**", "dist/**", "rslib.config.ts"],
})
