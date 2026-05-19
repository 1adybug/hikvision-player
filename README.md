# hikvision-player

`hikvision-player` 是一个面向 React 的海康威视 H5 播放器组件封装。组件负责加载 `h5player.min.js`、创建 `JSPlugin` 实例、注册窗口事件，并可以通过 React 属性声明式地完成预览、回放、分屏、音量、全屏等常用操作。

## 安装

```bash
pnpm add hikvision-player
```

本包要求消费端提供 React 运行时：

```bash
pnpm add react react-dom
```

> 当前 `peerDependencies` 要求 `react >= 19.2.6`、`react-dom >= 19.2.6`。

## 使用前准备

海康 H5 SDK 依赖一组静态资源，包括 `h5player.min.js`、`playctrl*`、`talk*` 和 `transform` 目录。包内已经随 `dist/assets/hikvision` 发布这些文件，但消费端应用需要保证这些文件能在浏览器中被直接访问。

推荐在消费端构建时把资源复制到公开目录，然后通过 `basePath` 告诉组件资源访问路径。

### Rsbuild 中复制资源

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

复制后，浏览器应能访问：

```text
/hikvision/h5player.min.js
/hikvision/playctrl1/Decoder.js
/hikvision/playctrl2/Decoder.wasm
/hikvision/talk/AudioInterCom.js
/hikvision/transform/libSystemTransform.wasm
```

### 其他构建工具

如果使用 Vite、Webpack、Next.js 或其他工具，也可以把 `node_modules/hikvision-player/dist/assets/hikvision` 原样复制到应用的 `public/hikvision` 目录，再传入：

```tsx
<HikvisionPlayer basePath="/hikvision/" />
```

`basePath` 必须指向包含 `h5player.min.js` 的目录，并且建议以 `/` 结尾。组件会自动拼接出默认脚本地址：`${basePath}h5player.min.js`。

如果资源脚本部署在独立地址，也可以直接传入 `scriptUrl`：

```tsx
<HikvisionPlayer basePath="https://static.example.com/hikvision/" scriptUrl="https://static.example.com/hikvision/h5player.min.js" />
```

## 基础预览

组件默认在 `src` 存在时自动播放；当 `playing={false}` 时会停止当前窗口播放。

```tsx
import HikvisionPlayer from "hikvision-player"

export default function CameraPreview() {
    return <HikvisionPlayer basePath="/hikvision/" src="ws://example.com/live/stream" style={{ width: "100%", height: 480 }} />
}
```

根元素是一个 `div`，组件不会默认设置宽高。实际使用时请通过 `style`、`className` 或 `classNames.root` 设置明确的播放区域尺寸。

## 手动控制播放状态

```tsx
import { useState } from "react"

import HikvisionPlayer from "hikvision-player"

export default function ControlledPreview() {
    const [playing, setPlaying] = useState(true)

    return (
        <>
            <button type="button" onClick={() => setPlaying(value => !value)}>
                {playing ? "停止" : "播放"}
            </button>

            <HikvisionPlayer
                basePath="/hikvision/"
                src="ws://example.com/live/stream"
                playing={playing}
                muted={false}
                volume={60}
                style={{ width: 800, height: 450 }}
            />
        </>
    )
}
```

## 回放

同时传入 `startTime` 和 `endTime` 时，组件会按回放模式调用海康 SDK 的 `JS_Play(url, config, windowIndex, startTime, endTime)`。

```tsx
import HikvisionPlayer from "hikvision-player"

export default function Playback() {
    return (
        <HikvisionPlayer
            basePath="/hikvision/"
            src="ws://example.com/playback/stream"
            startTime="2026-05-19 09:00:00"
            endTime="2026-05-19 10:00:00"
            playbackMode={1}
            style={{ width: "100%", height: 520 }}
        />
    )
}
```

`playbackMode` 可选值：

| 值  | 说明         |
| --- | ------------ |
| `1` | 绝对时间正放 |
| `3` | 绝对时间倒放 |

未显式传入 `playbackMode` 时，只要 `startTime` 和 `endTime` 同时存在，组件会默认使用 `1`。

## 分屏播放

通过 `split` 设置分屏数量，通过 `selectedWindow` 切换选中的窗口，通过 `windowIndex` 指定当前声明式播放要落在哪个窗口。

```tsx
import { useState } from "react"

import HikvisionPlayer, { type HikvisionSplit } from "hikvision-player"

export default function MultiWindowPreview() {
    const [selectedWindow, setSelectedWindow] = useState(0)
    const split: HikvisionSplit = 2

    return (
        <HikvisionPlayer
            basePath="/hikvision/"
            src="ws://example.com/live/stream"
            split={split}
            selectedWindow={selectedWindow}
            windowIndex={selectedWindow}
            style={{ width: 960, height: 540 }}
            onWindowSelect={setSelectedWindow}
        />
    )
}
```

`split` 可选值：

| 值  | 说明 |
| --- | ---- |
| `1` | 1x1  |
| `2` | 2x2  |
| `3` | 3x3  |
| `4` | 4x4  |

## 获取原始 SDK 实例

组件通过 `player` 属性和 `onReady` 回调暴露原始 `JSPlugin` 实例。未封装的海康 SDK 能力可以直接从该实例调用。

```tsx
import { useRef } from "react"

import HikvisionPlayer, { type HikvisionPlayerInstance } from "hikvision-player"

export default function PlayerWithSdkApi() {
    const playerRef = useRef<HikvisionPlayerInstance | null>(null)

    async function capture() {
        await playerRef.current?.JS_CapturePicture?.(0, "capture.jpeg", "JPEG")
    }

    async function enableZoom() {
        await playerRef.current?.JS_EnableZoom?.(0)
    }

    return (
        <>
            <button type="button" onClick={capture}>
                抓图
            </button>
            <button type="button" onClick={enableZoom}>
                电子放大
            </button>

            <HikvisionPlayer player={playerRef} basePath="/hikvision/" src="ws://example.com/live/stream" style={{ width: 800, height: 450 }} />
        </>
    )
}
```

组件卸载时会自动尝试调用 `JS_StopRealPlayAll`、`JS_StopTalk` 和 `JS_Destroy` 释放资源。

## 初始化配置

`pluginOptions` 会透传给 `new JSPlugin(options)`，适合配置窗口数量、调试日志、MSE worker、样式等 SDK 初始化选项。

```tsx
<HikvisionPlayer
    basePath="/hikvision/"
    src="ws://example.com/live/stream"
    pluginOptions={{
        iMaxSplit: 4,
        iCurrentSplit: 1,
        openDebug: true,
        mseWorkerEnable: true,
        bSupporDoubleClickFull: true,
        oStyle: {
            borderSelect: "#2f80ed",
        },
    }}
    style={{ width: 960, height: 540 }}
/>
```

`szId` 和 `szBasePath` 由组件内部管理，不能通过 `pluginOptions` 覆盖。

## 播放配置

`playOptions` 会透传给 SDK 的 `JS_Play`。组件会自动把 `src` 写入 `playURL`，并且组件上的高级属性会覆盖 `playOptions` 中的同名字段。

```tsx
<HikvisionPlayer
    basePath="/hikvision/"
    src="ws://example.com/live/stream"
    mode={0}
    keepDecoder={0}
    token="your-token"
    playOptions={{
        mode: 1,
        token: "fallback-token",
    }}
    style={{ width: 800, height: 450 }}
/>
```

上面的例子中，最终播放配置会使用组件属性里的 `mode={0}` 和 `token="your-token"`。

## 样式

可以直接给根元素传入标准 `div` 属性：

```tsx
<HikvisionPlayer basePath="/hikvision/" src="ws://example.com/live/stream" className="camera-player" style={{ width: "100%", height: "60vh" }} />
```

也可以通过 `classNames` 分别控制根元素和播放器挂载容器：

```tsx
<HikvisionPlayer
    basePath="/hikvision/"
    src="ws://example.com/live/stream"
    classNames={{
        root: "camera-player",
        viewport: "camera-player__viewport",
    }}
/>
```

默认情况下组件会隐藏 SDK 子窗口边框，并按照 `split` 修正 `.sub-wnd` 的宽高。传入 `showBorder={true}` 后会保留 SDK 默认边框样式。

## Props

| 属性             | 类型                                                   | 默认值                       | 说明                                                    |
| ---------------- | ------------------------------------------------------ | ---------------------------- | ------------------------------------------------------- |
| `basePath`       | `string`                                               | 包内资源路径                 | 海康 SDK 静态资源目录，必须包含 `h5player.min.js`       |
| `scriptUrl`      | `string`                                               | `${basePath}h5player.min.js` | `h5player.min.js` 的完整脚本地址                        |
| `src`            | `string`                                               | -                            | 预览或回放的流媒体地址                                  |
| `playing`        | `boolean`                                              | -                            | `false` 时停止当前窗口；其他值会在 `src` 存在时自动播放 |
| `mode`           | `0 \| 1`                                               | `0`                          | 播放解码模式，`0` 普通模式，`1` 高级模式                |
| `windowIndex`    | `number`                                               | 当前 SDK 选中窗口或 `0`      | 声明式播放、声音、音量等操作的目标窗口                  |
| `token`          | `string`                                               | -                            | 后端开启安全认证时使用的 token                          |
| `keepDecoder`    | `0 \| 1`                                               | `0`                          | 切换播放时是否保留解码资源                              |
| `startTime`      | `string`                                               | -                            | 回放开始时间                                            |
| `endTime`        | `string`                                               | -                            | 回放结束时间                                            |
| `playbackMode`   | `1 \| 3`                                               | 回放时为 `1`                 | 回放方向模式                                            |
| `split`          | `1 \| 2 \| 3 \| 4`                                     | `1`                          | 分屏数量                                                |
| `selectedWindow` | `number`                                               | -                            | 要切换选中的窗口下标                                    |
| `muted`          | `boolean`                                              | -                            | 是否关闭当前窗口声音                                    |
| `volume`         | `number`                                               | -                            | 当前窗口音量，透传给 `JS_SetVolume`                     |
| `fullScreen`     | `boolean`                                              | -                            | 是否整体全屏，透传给 `JS_FullScreenDisplay`             |
| `connectTimeout` | `number`                                               | -                            | 取流连接超时时间，会在播放前同步给 SDK                  |
| `interruptTime`  | `number`                                               | -                            | 断流检测回调间隔                                        |
| `autoResize`     | `boolean`                                              | `true`                       | 窗口或容器尺寸变化时自动调用 `JS_Resize`                |
| `showBorder`     | `boolean`                                              | `false`                      | 是否保留 SDK 子窗口边框                                 |
| `pluginOptions`  | `Omit<HikvisionPluginOptions, "szId" \| "szBasePath">` | -                            | `JSPlugin` 初始化配置                                   |
| `playOptions`    | `HikvisionPlayOptions`                                 | -                            | `JS_Play` 播放配置                                      |
| `player`         | `Ref<HikvisionPlayerInstance \| null>`                 | -                            | 原始 `JSPlugin` 实例引用                                |
| `classNames`     | `PlayerClassNames`                                     | -                            | 内部元素 className 映射                                 |
| `onReady`        | `(player) => void`                                     | -                            | 播放器实例创建且事件注册完成后触发                      |
| `onLoadError`    | `(error) => void`                                      | -                            | 脚本加载或播放器初始化失败时触发                        |
| `onPlaySuccess`  | `(player) => void`                                     | -                            | 声明式播放成功时触发                                    |
| `onPlayError`    | `(error) => void`                                      | -                            | 声明式播放失败时触发                                    |

组件根元素继承 `div` 的标准属性，例如 `id`、`className`、`style`、`data-*` 等；组件不接收 `children`。

## 窗口事件

| 事件属性                                               | 触发时机             |
| ------------------------------------------------------ | -------------------- |
| `onWindowSelect(windowIndex)`                          | 播放窗口选中变化     |
| `onPluginError(windowIndex, errorCode, error)`         | 播放器错误           |
| `onWindowOver(windowIndex)`                            | 鼠标移入播放窗口     |
| `onWindowOut(windowIndex)`                             | 鼠标移出播放窗口     |
| `onWindowUp(windowIndex)`                              | 鼠标在播放窗口内抬起 |
| `onFullScreenChange(isFull)`                           | 全屏状态变化         |
| `onFirstFrame(windowIndex, width, height)`             | 首帧显示             |
| `onPerformanceLack(windowIndex)`                       | SDK 检测到性能不足   |
| `onStreamEnd(windowIndex)`                             | 回放结束或码流结束   |
| `onStreamHeadChanged(windowIndex)`                     | 码流头变化           |
| `onInterruptStream(windowIndex, interruptTime)`        | 断流检测             |
| `onElementChanged(windowIndex, elementType)`           | 渲染元素类型变化     |
| `onThumbnailsEvent(windowIndex, eventType, eventCode)` | 缩略图事件           |
| `onTalkPluginError(errorCode, errorInfo)`              | 对讲错误             |

## TypeScript 类型

常用类型都可以从包入口导入：

```ts
import type {
    HikvisionDecodeMode,
    HikvisionKeepDecoder,
    HikvisionPlaybackMode,
    HikvisionPlayerInstance,
    HikvisionPlayOptions,
    HikvisionPluginOptions,
    HikvisionSplit,
    PlayerProps,
} from "hikvision-player"
```

## SSR 注意事项

海康 H5 SDK 依赖 `window` 和 `document`，只能在浏览器中运行。SSR 框架中请把使用该组件的部分放在客户端组件或禁用服务端渲染的动态组件中。

Next.js App Router 示例：

```tsx
"use client"

import HikvisionPlayer from "hikvision-player"

export default function CameraPage() {
    return <HikvisionPlayer basePath="/hikvision/" src="ws://example.com/live/stream" style={{ width: "100%", height: 480 }} />
}
```

## 本地开发

安装依赖：

```bash
pnpm install
```

构建产物：

```bash
pnpm run build
```

监听源码变化并重新构建：

```bash
pnpm run dev
```
