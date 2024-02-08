import { esbuildPluginVersionInjector } from "esbuild-plugin-version-injector";
import { defineConfig } from "tsup";

// This tsup config was originally made by https://github.com/sapphiredev

export default defineConfig({
    clean: true,
    entry: ["src/index.ts"],
    dts: true,
    minify: false,
    skipNodeModulesBundle: true,
    sourcemap: true,
    target: "es2021",
    tsconfig: "tsconfig.json",
    keepNames: true,
    esbuildPlugins: [esbuildPluginVersionInjector()],
    treeshake: true,
    format: ["cjs", "esm"],
});
