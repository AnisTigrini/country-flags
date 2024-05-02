import { defineConfig } from "tsup";

export default defineConfig({
    format : ['cjs', 'esm'],
    entry : ['./src/index.ts'],
    dts : true,
    clean : true,
    skipNodeModulesBundle : true,
    shims : true
})