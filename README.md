# hikvision-player

## Setup

Install the dependencies:

```bash
pnpm install
```

## Get started

Build the library:

```bash
pnpm run build
```

Build the library in watch mode:

```bash
pnpm run dev
```

## Rsbuild Usage

Copy the Hikvision SDK assets to a public path in the consuming app:

```ts
// rsbuild.config.ts
import { defineConfig } from "@rsbuild/core"

export default defineConfig({
    output: {
        copy: [
            {
                from: "node_modules/hikvision-player/dist/assets/hikvision",
                to: "hikvision",
            },
        ],
    },
})
```

Then pass that public path to the player:

```tsx
import Player from "hikvision-player"

export default function Page() {
    return <Player basePath="/hikvision/" />
}
```

`basePath` must point to the directory that contains `h5player.min.js`, `playctrl*`, `talk*`, and `transform`.
