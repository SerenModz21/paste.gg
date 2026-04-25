import { defineConfig, type UserConfig } from "tsdown";
import Replace from "unplugin-replace/rolldown";
import pkg from "./package.json" with { type: "json" };

// This tsdown config was originally made by https://github.com/sapphiredev

const baseOptions = {
    clean: true,
    entry: ["src/index.ts"],
    dts: true,
    minify: false,
    deps: { skipNodeModulesBundle: true },
    sourcemap: true,
    target: "es2021",
    tsconfig: "tsconfig.json",
    plugins: [
        Replace({
            values: [
                {
                    find: /\[VI\]{{inject}}\[\/VI\]/,
                    replacement: pkg.version,
                },
            ],
        }),
    ],
    treeshake: true,
} satisfies UserConfig;

export default defineConfig([
    {
        ...baseOptions,
        outDir: "dist/cjs",
        format: "cjs",
        banner: { js: "'use strict';\n" },
    },
    {
        ...baseOptions,
        outDir: "dist/esm",
        format: "esm",
    },
]);
