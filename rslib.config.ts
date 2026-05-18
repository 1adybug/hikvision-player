import { pluginBabel } from "@rsbuild/plugin-babel"
import { pluginReact } from "@rsbuild/plugin-react"
import { defineConfig } from "@rslib/core"

export default defineConfig({
    source: {
        entry: {
            index: "./src/index.tsx",
        },
    },
    lib: [
        {
            bundle: false,
            dts: true,
            format: "esm",
        },
    ],
    output: {
        copy: [
            {
                from: "assets/hikvision",
                info: { minimized: true },
                to: "assets/hikvision",
            },
        ],
        target: "web",
    },
    plugins: [
        pluginReact(),
        pluginBabel({
            include: /\.[jt]sx?$/,
            exclude: [/[\\/]node_modules[\\/]/],
            babelLoaderOptions(opts) {
                opts.plugins ??= []
                opts.plugins.unshift("babel-plugin-react-compiler")
            },
        }),
    ],
})
