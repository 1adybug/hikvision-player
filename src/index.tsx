import { type ComponentPropsWithRef, type Ref, useCallback, useEffect, useEffectEvent, useId, useRef, useState } from "react"

/**
 * Hikvision 播放解码模式。
 *
 * 0 为普通模式，1 为高级模式。
 */
export type HikvisionDecodeMode = 0 | 1

/**
 * Hikvision 回放方向模式。
 *
 * 1 为绝对时间正放，3 为绝对时间倒放。
 */
export type HikvisionPlaybackMode = 1 | 3

/**
 * 播放窗口分屏数量。
 *
 * 1 表示 1x1，2 表示 2x2，3 表示 3x3，4 表示 4x4。
 */
export type HikvisionSplit = 1 | 2 | 3 | 4

/**
 * 切换播放时是否保留解码资源。
 *
 * 0 表示回收解码资源，1 表示保留解码资源。
 */
export type HikvisionKeepDecoder = 0 | 1

/**
 * Hikvision 画面缩放比例。
 *
 * 内置值包含 fill、16:9、4:3、9:16、3:4，同时保留字符串扩展以兼容 SDK 新增值。
 */
export type HikvisionScaleRatio = "fill" | "16:9" | "4:3" | "9:16" | "3:4" | string

/**
 * Hikvision 画面旋转角度。
 *
 * 常用值为 0、90、180、270，同时保留 number 扩展以兼容 SDK 新增值。
 */
export type HikvisionRotateDegree = 0 | 90 | 180 | 270 | number

/**
 * Hikvision SDK 方法返回的 Promise 类型。
 */
export type HikvisionPromise<T = void> = Promise<T>

/**
 * Hikvision 插件窗口样式配置。
 */
export interface HikvisionPluginStyle {
    /**
     * 当前选中窗口的边框颜色。
     */
    borderSelect?: string

    /**
     * 透传给 Hikvision SDK 的其他样式字段。
     */
    [key: string]: unknown
}

/**
 * 创建 Hikvision JSPlugin 实例时使用的初始化配置。
 */
export interface HikvisionPluginOptions {
    /**
     * 播放器挂载容器的 DOM id。
     *
     * 由组件内部生成并传入，用户通常不需要手动设置。
     */
    szId: string

    /**
     * h5player.min.js、wasm、worker 等资源所在目录。
     */
    szBasePath: string

    /**
     * 播放器初始化宽度。
     *
     * 不传时 SDK 会自适应容器宽度。
     */
    iWidth?: number

    /**
     * 播放器初始化高度。
     *
     * 不传时 SDK 会自适应容器高度。
     */
    iHeight?: number

    /**
     * 最大分屏数量。
     *
     * 组件默认按单播放器使用，未配置时为 1。
     */
    iMaxSplit?: number

    /**
     * 初始分屏数量。
     *
     * 组件默认按单播放器使用，未配置时为 1。
     */
    iCurrentSplit?: number

    /**
     * 是否开启 Hikvision SDK 调试日志。
     */
    openDebug?: boolean

    /**
     * 是否启用 MSE worker 多线程解码。
     *
     * 高分辨率码流可考虑开启。
     */
    mseWorkerEnable?: boolean

    /**
     * 是否允许双击窗口全屏。
     */
    bSupporDoubleClickFull?: boolean

    /**
     * Hikvision SDK 窗口样式配置。
     */
    oStyle?: HikvisionPluginStyle

    /**
     * 透传给 Hikvision SDK 的其他初始化字段。
     */
    [key: string]: unknown
}

/**
 * Hikvision JS_Play 的播放配置。
 */
export interface HikvisionPlayOptions {
    /**
     * 流媒体播放地址。
     *
     * 组件会默认使用 PlayerProps.src 覆盖该字段。
     */
    playURL?: string

    /**
     * 播放解码模式。
     */
    mode?: HikvisionDecodeMode

    /**
     * 回放方向模式。
     */
    PlayBackMode?: HikvisionPlaybackMode

    /**
     * 切换播放时是否保留解码资源。
     */
    keepDecoder?: HikvisionKeepDecoder

    /**
     * 后端开启安全认证时使用的 token。
     */
    token?: string

    /**
     * 透传给 Hikvision SDK 的其他播放字段。
     */
    [key: string]: unknown
}

/**
 * Hikvision SDK 返回的音视频信息。
 */
export interface HikvisionVideoInfo {
    /**
     * SDK 返回的原始音视频信息字段。
     */
    [key: string]: unknown
}

/**
 * 抓图水印配置。
 */
export interface HikvisionWatermarkConfig {
    /**
     * 水印文字内容。
     */
    text?: string

    /**
     * 水印文字颜色。
     */
    color?: string

    /**
     * 水印字体。
     */
    font?: string

    /**
     * 水印旋转角度。
     */
    rotateDegree?: number

    /**
     * 水印重复间距，单位为像素。
     */
    space?: number

    /**
     * 透传给 Hikvision SDK 的其他水印字段。
     */
    [key: string]: unknown
}

/**
 * 即时回放配置。
 */
export interface HikvisionInstantOptions {
    /**
     * 是否开启即时回放能力。
     */
    bOpenflag?: boolean

    /**
     * 即时回放缓存时长，单位由 Hikvision SDK 定义。
     */
    bInstantTime?: number

    /**
     * 透传给 Hikvision SDK 的其他即时回放字段。
     */
    [key: string]: unknown
}

/**
 * 录像保存配置。
 */
export interface HikvisionSaveOptions {
    /**
     * 录像类型。
     *
     * 具体取值以 Hikvision SDK 文档为准。
     */
    irecordType?: number

    /**
     * 录像码流数据回调。
     */
    cbStreamCB?: (data: unknown) => void

    /**
     * 透传给 Hikvision SDK 的其他录像字段。
     */
    [key: string]: unknown
}

/**
 * Hikvision SDK 窗口事件回调集合。
 */
export interface HikvisionWindowEvents {
    /**
     * 窗口选中变化回调。
     */
    windowEventSelect?: (windowIndex: number) => void

    /**
     * 播放器错误回调。
     */
    pluginErrorHandler?: (windowIndex: number, errorCode: number, error: unknown) => void

    /**
     * 鼠标移入窗口回调。
     */
    windowEventOver?: (windowIndex: number) => void

    /**
     * 鼠标移出窗口回调。
     */
    windowEventOut?: (windowIndex: number) => void

    /**
     * 鼠标在窗口内抬起回调。
     */
    windowEventUp?: (windowIndex: number) => void

    /**
     * 全屏状态变化回调。
     */
    windowFullCcreenChange?: (isFull: boolean) => void

    /**
     * 首帧显示回调。
     */
    firstFrameDisplay?: (windowIndex: number, width: number, height: number) => void

    /**
     * 性能不足回调。
     */
    performanceLack?: (windowIndex: number) => void

    /**
     * 回放结束或码流结束回调。
     */
    StreamEnd?: (windowIndex: number) => void

    /**
     * 码流头变化回调。
     */
    StreamHeadChanged?: (windowIndex: number) => void

    /**
     * 断流检测回调。
     */
    InterruptStream?: (windowIndex: number, interruptTime: number) => void

    /**
     * 渲染元素类型变化回调。
     *
     * elementType 通常表示 video 或 canvas。
     */
    ElementChanged?: (windowIndex: number, elementType: string) => void

    /**
     * 缩略图事件回调。
     */
    ThumbnailsEvent?: (windowIndex: number, eventType: number, eventCode: number) => void

    /**
     * 对讲错误回调。
     */
    talkPluginErrorHandler?: (errorCode: number, errorInfo: unknown) => void

    /**
     * 兼容 Hikvision SDK 可能新增的事件回调。
     */
    [key: string]: unknown
}

/**
 * Hikvision JSPlugin 播放器实例。
 *
 * 组件通过 PlayerProps.player 暴露该实例，未封装的 SDK 能力可直接从实例调用。
 */
export interface HikvisionPlayerInstance {
    /**
     * 当前选中的窗口下标。
     */
    currentWindowIndex: number

    /**
     * 注册播放器窗口事件回调集合。
     */
    JS_SetWindowControlCallback?: (events: HikvisionWindowEvents) => HikvisionPromise | void

    /**
     * 开始预览或回放。
     *
     * 预览时不传 startTime 和 endTime；回放时同时传入 startTime 和 endTime。
     */
    JS_Play: (url: string, config: HikvisionPlayOptions, windowIndex: number, startTime?: string, endTime?: string) => HikvisionPromise

    /**
     * 停止指定窗口播放。
     *
     * 不传 windowIndex 时使用 SDK 默认窗口。
     */
    JS_Stop: (windowIndex?: number) => HikvisionPromise

    /**
     * 停止全部窗口播放。
     */
    JS_StopRealPlayAll: () => HikvisionPromise

    /**
     * 开始语音对讲。
     */
    JS_StartTalk: (talkUrl: string, params?: Record<string, unknown>) => HikvisionPromise

    /**
     * 停止语音对讲。
     */
    JS_StopTalk: () => HikvisionPromise

    /**
     * 设置语音对讲音量。
     */
    JS_TalkSetVolume?: (volume: number) => HikvisionPromise

    /**
     * 获取语音对讲音量。
     */
    JS_TalkGetVolume?: () => HikvisionPromise<number>

    /**
     * 开始录制对讲音频。
     */
    JS_StartSaveTalk?: (fileName: string, type?: number) => HikvisionPromise

    /**
     * 停止录制对讲音频。
     */
    JS_StopSaveTalk?: () => HikvisionPromise

    /**
     * 开启指定窗口声音。
     */
    JS_OpenSound: (windowIndex?: number) => HikvisionPromise

    /**
     * 关闭指定窗口声音。
     */
    JS_CloseSound: (windowIndex?: number) => HikvisionPromise

    /**
     * 设置指定窗口音量。
     */
    JS_SetVolume: (windowIndex: number, volume: number) => HikvisionPromise

    /**
     * 获取指定窗口音量。
     */
    JS_GetVolume?: (windowIndex: number) => HikvisionPromise<number>

    /**
     * 开始录像并保存文件。
     */
    JS_StartSaveEx?: (windowIndex: number, fileName: string, dstType: number, options?: HikvisionSaveOptions) => HikvisionPromise

    /**
     * 停止录像并保存文件。
     */
    JS_StopSave?: (windowIndex: number) => HikvisionPromise

    /**
     * 抓取当前窗口画面。
     */
    JS_CapturePicture?: (windowIndex: number, fileName: string, fileType: "JPEG" | "BMP" | string, callback?: (imageData: unknown) => void) => HikvisionPromise

    /**
     * 暂停回放。
     */
    JS_Pause?: (windowIndex: number) => HikvisionPromise

    /**
     * 恢复回放。
     *
     * forward 为 true 表示正向恢复，false 表示倒向恢复。
     */
    JS_Resume?: (windowIndex: number, forward?: boolean) => HikvisionPromise

    /**
     * 回放快放。
     *
     * Promise resolve 值为 SDK 返回的当前播放倍速。
     */
    JS_Fast?: (windowIndex?: number) => HikvisionPromise<number>

    /**
     * 回放慢放。
     *
     * Promise resolve 值为 SDK 返回的当前播放倍速。
     */
    JS_Slow?: (windowIndex?: number) => HikvisionPromise<number>

    /**
     * 回放定位。
     */
    JS_Seek?: (windowIndex: number, startTime: string, endTime: string) => HikvisionPromise

    /**
     * 回放单帧进。
     */
    JS_FrameForward?: (windowIndex: number) => HikvisionPromise

    /**
     * 回放单帧退。
     */
    JS_FrameBack?: (windowIndex: number) => HikvisionPromise

    /**
     * 开启电子放大。
     */
    JS_EnableZoom?: (windowIndex: number) => HikvisionPromise

    /**
     * 关闭电子放大。
     */
    JS_DisableZoom?: (windowIndex: number) => HikvisionPromise

    /**
     * 开启或关闭智能信息展示。
     */
    JS_RenderALLPrivateData?: (windowIndex: number, openFlag: boolean) => HikvisionPromise

    /**
     * 设置分屏数量。
     */
    JS_ArrangeWindow: (splitNum: HikvisionSplit | number) => HikvisionPromise

    /**
     * 切换当前选中窗口。
     */
    JS_SelectWnd?: (windowIndex: number) => HikvisionPromise

    /**
     * 设置整体全屏状态。
     */
    JS_FullScreenDisplay?: (isFull: boolean) => HikvisionPromise

    /**
     * 设置单窗口全屏。
     */
    JS_FullScreenSingle?: (windowIndex: number) => HikvisionPromise

    /**
     * 刷新播放器窗口尺寸。
     */
    JS_Resize?: (width?: number, height?: number) => HikvisionPromise

    /**
     * 获取指定窗口 OSD 时间。
     */
    JS_GetOSDTime?: (windowIndex: number) => HikvisionPromise<number | string>

    /**
     * 获取指定窗口音视频信息。
     */
    JS_GetVideoInfo?: (windowIndex: number) => HikvisionPromise<HikvisionVideoInfo>

    /**
     * 设置取流连接超时时间。
     *
     * 通常需要在 JS_Play 前调用。
     */
    JS_SetConnectTimeOut?: (windowIndex: number, time: number) => HikvisionPromise

    /**
     * 设置私有数据回调。
     */
    JS_SetAdditionDataCB?: (windowIndex: number, type: number | string, callback: (...args: unknown[]) => void) => HikvisionPromise

    /**
     * 开启或关闭 traceId 拼接。
     */
    JS_SetTraceId?: (windowIndex: number, openFlag: boolean) => HikvisionPromise

    /**
     * 获取指定窗口 traceId。
     */
    JS_GetTraceId?: (windowIndex: number) => HikvisionPromise<string>

    /**
     * 设置断流检测回调间隔。
     */
    JS_SetInterruptTime?: (windowIndex: number, interruptTime: number) => HikvisionPromise

    /**
     * 判断指定 URL 是否支持回放优化能力。
     */
    JS_OptimizeCapability?: (windowIndex: number, url: string) => HikvisionPromise<unknown>

    /**
     * 正放和倒放模式切换。
     */
    JS_ChangeMode?: (windowIndex: number) => HikvisionPromise

    /**
     * 开始缩略图任务。
     */
    JS_StartVideoThumbnails?: (windowIndex: number, url: string, startTime: string, stopTime: string, options?: Record<string, unknown>) => HikvisionPromise

    /**
     * 获取指定时间点缩略图。
     */
    JS_GetVideoThumbnails?: (windowIndex: number, videoTime: string, callback: (timestamp: string, dataUrl: string) => void) => HikvisionPromise

    /**
     * 停止缩略图任务。
     */
    JS_StopVideoThumbnails?: (windowIndex: number) => HikvisionPromise

    /**
     * 设置指定窗口播放倍速。
     *
     * Promise resolve 值为 SDK 返回的当前播放倍速。
     */
    JS_Speed?: (windowIndex: number, rate: number) => HikvisionPromise<number>

    /**
     * 设置即时回放参数。
     */
    JS_InstantSetParam?: (windowIndex: number, options: HikvisionInstantOptions) => HikvisionPromise

    /**
     * 开始即时回放。
     */
    JS_StartInstant?: (windowIndex: number) => HikvisionPromise

    /**
     * 停止即时回放。
     */
    JS_StopInstant?: (windowIndex: number) => HikvisionPromise

    /**
     * 获取即时回放总时长。
     */
    JS_InstantTotalDuration?: (windowIndex: number) => HikvisionPromise<number>

    /**
     * 获取即时回放当前播放时长。
     */
    JS_InstantCurrDuration?: (windowIndex: number) => HikvisionPromise<number>

    /**
     * 旋转指定窗口画面。
     */
    JS_Rotate?: (windowIndex: number, degree: HikvisionRotateDegree) => HikvisionPromise

    /**
     * 缩放指定窗口画面。
     */
    JS_Scale?: (windowIndex: number, ratio: HikvisionScaleRatio) => HikvisionPromise

    /**
     * 取消指定窗口缩放和旋转。
     */
    JS_ScaleCancel?: (windowIndex: number) => HikvisionPromise

    /**
     * 设置抓图水印配置。
     */
    JS_SetWatermarkConfig?: (config: HikvisionWatermarkConfig) => HikvisionPromise

    /**
     * 取消抓图水印配置。
     */
    JS_CancelWatermarkConfig?: () => HikvisionPromise

    /**
     * 获取 Hikvision SDK 版本号。
     */
    JS_GetSdkVersion?: () => string

    /**
     * 销毁 Hikvision 播放器实例并释放资源。
     */
    JS_Destroy?: () => HikvisionPromise | void

    /**
     * 兼容 Hikvision SDK 未在类型中列出的其他实例字段和方法。
     */
    [key: string]: unknown
}

/**
 * Hikvision JSPlugin 构造函数类型。
 */
export interface HikvisionPluginConstructor {
    /**
     * 创建 Hikvision 播放器实例。
     */
    new (options: HikvisionPluginOptions): HikvisionPlayerInstance
}

/**
 * Player 组件内部元素 className 映射。
 */
export interface PlayerClassNames {
    /**
     * 根元素 className。
     */
    root?: string

    /**
     * Hikvision 播放器挂载容器 className。
     */
    viewport?: string
}

/**
 * Player 组件属性。
 *
 * 组件根元素为 div，因此继承 div 的全部标准属性和 React 19 ref prop。
 */
export interface PlayerProps extends Omit<ComponentPropsWithRef<"div">, "children"> {
    /**
     * Hikvision 播放器实例 ref。
     *
     * 组件 ready 后写入原始 JSPlugin 实例，卸载时写入 null。
     */
    player?: Ref<HikvisionPlayerInstance | null>

    /**
     * 内部元素 className 映射。
     */
    classNames?: PlayerClassNames

    /**
     * Hikvision 静态资源目录。
     *
     * 默认使用包内 dist/assets/hikvision 资源。
     */
    basePath?: string

    /**
     * h5player.min.js 的完整脚本地址。
     *
     * 不传时根据 basePath 自动拼接。
     */
    scriptUrl?: string

    /**
     * JSPlugin 初始化配置。
     *
     * szId 和 szBasePath 由组件内部管理，不能通过该属性覆盖。默认会按单窗口播放器初始化 iMaxSplit 和 iCurrentSplit。
     */
    pluginOptions?: Omit<HikvisionPluginOptions, "szId" | "szBasePath">

    /**
     * JS_Play 播放配置。
     *
     * playURL、mode、keepDecoder、token、PlayBackMode 会被组件的同名高级属性覆盖。
     */
    playOptions?: HikvisionPlayOptions

    /**
     * 预览或回放的流媒体地址。
     */
    src?: string

    /**
     * 是否播放。
     *
     * false 时停止当前窗口播放；其他值在 src 存在时自动播放。
     */
    playing?: boolean

    /**
     * 播放解码模式。
     */
    mode?: HikvisionDecodeMode

    /**
     * 目标播放窗口下标。
     *
     * 不传时使用 SDK 当前选中窗口。
     */
    windowIndex?: number

    /**
     * 后端开启安全认证时使用的 token。
     */
    token?: string

    /**
     * 切换播放时是否保留解码资源。
     */
    keepDecoder?: HikvisionKeepDecoder

    /**
     * 回放开始时间。
     *
     * startTime 和 endTime 同时存在时组件按回放调用 JS_Play。
     */
    startTime?: string

    /**
     * 回放结束时间。
     *
     * startTime 和 endTime 同时存在时组件按回放调用 JS_Play。
     */
    endTime?: string

    /**
     * 回放方向模式。
     */
    playbackMode?: HikvisionPlaybackMode

    /**
     * 分屏数量。
     *
     * 不传时保持单窗口播放器形态；传入后会调用 Hikvision SDK 的分屏窗口能力。
     */
    split?: HikvisionSplit

    /**
     * 要切换选中的窗口下标。
     */
    selectedWindow?: number

    /**
     * 是否静音。
     */
    muted?: boolean

    /**
     * 当前窗口音量。
     */
    volume?: number

    /**
     * 是否整体全屏。
     */
    fullScreen?: boolean

    /**
     * 取流连接超时时间。
     *
     * 传入后会在播放前同步给 SDK。
     */
    connectTimeout?: number

    /**
     * 断流检测回调间隔。
     */
    interruptTime?: number

    /**
     * 是否在窗口或容器尺寸变化时自动调用 JS_Resize。
     */
    autoResize?: boolean

    /**
     * 播放器实例创建且窗口事件注册完成后的回调。
     */
    onReady?: (player: HikvisionPlayerInstance) => void

    /**
     * Hikvision 脚本加载或播放器初始化失败回调。
     */
    onLoadError?: (error: unknown) => void

    /**
     * 声明式播放成功回调。
     */
    onPlaySuccess?: (player: HikvisionPlayerInstance) => void

    /**
     * 声明式播放失败回调。
     */
    onPlayError?: (error: unknown) => void

    /**
     * 播放窗口选中变化回调。
     */
    onWindowSelect?: (windowIndex: number) => void

    /**
     * Hikvision 插件错误回调。
     */
    onPluginError?: (windowIndex: number, errorCode: number, error: unknown) => void

    /**
     * 鼠标移入播放窗口回调。
     */
    onWindowOver?: (windowIndex: number) => void

    /**
     * 鼠标移出播放窗口回调。
     */
    onWindowOut?: (windowIndex: number) => void

    /**
     * 鼠标在播放窗口内抬起回调。
     */
    onWindowUp?: (windowIndex: number) => void

    /**
     * 全屏状态变化回调。
     */
    onFullScreenChange?: (isFull: boolean) => void

    /**
     * 首帧显示回调。
     */
    onFirstFrame?: (windowIndex: number, width: number, height: number) => void

    /**
     * 性能不足回调。
     */
    onPerformanceLack?: (windowIndex: number) => void

    /**
     * 回放结束或码流结束回调。
     */
    onStreamEnd?: (windowIndex: number) => void

    /**
     * 码流头变化回调。
     */
    onStreamHeadChanged?: (windowIndex: number) => void

    /**
     * 断流检测回调。
     */
    onInterruptStream?: (windowIndex: number, interruptTime: number) => void

    /**
     * 渲染元素类型变化回调。
     */
    onElementChanged?: (windowIndex: number, elementType: string) => void

    /**
     * 缩略图事件回调。
     */
    onThumbnailsEvent?: (windowIndex: number, eventType: number, eventCode: number) => void

    /**
     * 对讲错误回调。
     */
    onTalkPluginError?: (errorCode: number, errorInfo: unknown) => void
}

declare global {
    interface Window {
        /**
         * Hikvision h5player.min.js 注入到全局作用域的 JSPlugin 构造函数。
         */
        JSPlugin?: HikvisionPluginConstructor
    }
}

const DEFAULT_ASSET_BASE_PATH = new URL("./assets/hikvision/", import.meta.url).toString()
const scriptLoaders = new Map<string, Promise<HikvisionPluginConstructor>>()

function normalizeBasePath(basePath: string): string {
    return basePath.endsWith("/") ? basePath : `${basePath}/`
}

function joinUrl(basePath: string, fileName: string): string {
    return `${normalizeBasePath(basePath)}${fileName}`
}

function sanitizeId(id: string): string {
    const normalized = id.replace(/[^A-Za-z0-9_-]/g, "")
    return normalized || Math.random().toString(36).slice(2)
}

function getWindowIndex(player: HikvisionPlayerInstance, windowIndex?: number): number {
    return windowIndex ?? player.currentWindowIndex ?? 0
}

function assignRef<T>(ref: Ref<T> | undefined, value: T): void {
    if (!ref) return

    if (typeof ref === "function") {
        ref(value)
        return
    }

    ref.current = value
}

function joinClassNames(...values: Array<string | undefined>): string | undefined {
    const className = values.filter(Boolean).join(" ")
    return className || undefined
}

function ignorePromise(value: unknown): void {
    if (value && typeof (value as Promise<unknown>).catch === "function") void (value as Promise<unknown>).catch(() => undefined)
}

function loadHikvisionScript(scriptUrl: string): Promise<HikvisionPluginConstructor> {
    if (typeof window === "undefined" || typeof document === "undefined") return Promise.reject(new Error("Hikvision Player can only be loaded in a browser."))

    if (window.JSPlugin) return Promise.resolve(window.JSPlugin)

    const cached = scriptLoaders.get(scriptUrl)
    if (cached) return cached

    const promise = new Promise<HikvisionPluginConstructor>((resolve, reject) => {
        const absoluteUrl = new URL(scriptUrl, window.location.href).href
        const existingScript = Array.from(document.scripts).find(script => script.src === absoluteUrl || script.getAttribute("src") === scriptUrl)
        const script = existingScript ?? document.createElement("script")
        let timeoutId: number | undefined

        const cleanup = () => {
            window.clearTimeout(timeoutId)
            script.removeEventListener("load", handleLoad)
            script.removeEventListener("error", handleError)
        }

        const handleLoad = () => {
            cleanup()

            if (window.JSPlugin) {
                resolve(window.JSPlugin)
                return
            }

            reject(new Error("Hikvision h5player script loaded, but window.JSPlugin was not found."))
        }

        const handleError = () => {
            cleanup()
            reject(new Error(`Failed to load Hikvision h5player script: ${scriptUrl}`))
        }

        script.addEventListener("load", handleLoad)
        script.addEventListener("error", handleError)
        timeoutId = window.setTimeout(() => {
            if (!window.JSPlugin) {
                cleanup()
                reject(new Error(`Timed out loading Hikvision h5player script: ${scriptUrl}`))
            }
        }, 15000)

        if (!existingScript) {
            script.async = true
            script.src = scriptUrl
            document.head.appendChild(script)
            return
        }

        if (window.JSPlugin) handleLoad()
    })

    scriptLoaders.set(scriptUrl, promise)
    void promise.catch(() => {
        scriptLoaders.delete(scriptUrl)
    })

    return promise
}

function createWindowEvents(
    callbacks: Required<
        Pick<
            PlayerProps,
            | "onWindowSelect"
            | "onPluginError"
            | "onWindowOver"
            | "onWindowOut"
            | "onWindowUp"
            | "onFullScreenChange"
            | "onFirstFrame"
            | "onPerformanceLack"
            | "onStreamEnd"
            | "onStreamHeadChanged"
            | "onInterruptStream"
            | "onElementChanged"
            | "onThumbnailsEvent"
            | "onTalkPluginError"
        >
    >,
): HikvisionWindowEvents {
    return {
        windowEventSelect: windowIndex => callbacks.onWindowSelect(windowIndex),
        pluginErrorHandler: (windowIndex, errorCode, error) => {
            callbacks.onPluginError(windowIndex, errorCode, error)
        },
        windowEventOver: windowIndex => callbacks.onWindowOver(windowIndex),
        windowEventOut: windowIndex => callbacks.onWindowOut(windowIndex),
        windowEventUp: windowIndex => callbacks.onWindowUp(windowIndex),
        windowFullCcreenChange: isFull => callbacks.onFullScreenChange(isFull),
        firstFrameDisplay: (windowIndex, width, height) => {
            callbacks.onFirstFrame(windowIndex, width, height)
        },
        performanceLack: windowIndex => callbacks.onPerformanceLack(windowIndex),
        StreamEnd: windowIndex => callbacks.onStreamEnd(windowIndex),
        StreamHeadChanged: windowIndex => callbacks.onStreamHeadChanged(windowIndex),
        InterruptStream: (windowIndex, interruptTime) => {
            callbacks.onInterruptStream(windowIndex, interruptTime)
        },
        ElementChanged: (windowIndex, elementType) => {
            callbacks.onElementChanged(windowIndex, elementType)
        },
        ThumbnailsEvent: (windowIndex, eventType, eventCode) => {
            callbacks.onThumbnailsEvent(windowIndex, eventType, eventCode)
        },
        talkPluginErrorHandler: (errorCode, errorInfo) => {
            callbacks.onTalkPluginError(errorCode, errorInfo)
        },
    }
}

function buildPlayConfig(
    src: string,
    options: HikvisionPlayOptions | undefined,
    mode: HikvisionDecodeMode | undefined,
    keepDecoder: HikvisionKeepDecoder | undefined,
    token: string | undefined,
    playbackMode: HikvisionPlaybackMode | undefined,
): HikvisionPlayOptions {
    const config: HikvisionPlayOptions = {
        ...options,
        playURL: src,
    }

    if (mode !== undefined) config.mode = mode

    if (keepDecoder !== undefined) config.keepDecoder = keepDecoder

    if (token !== undefined) config.token = token

    if (playbackMode !== undefined) config.PlayBackMode = playbackMode

    return config
}

function optionalCallback<T extends (...args: any[]) => unknown>(callback?: T): (...args: Parameters<T>) => ReturnType<T> | undefined {
    return (...args: Parameters<T>) => callback?.(...args) as ReturnType<T> | undefined
}

/**
 * 无样式 Hikvision React 播放器组件。
 *
 * 根元素为 div，播放器挂载容器由组件内部创建；样式完全由调用方通过 className、style 或 classNames 控制。
 */
export function Player(props: PlayerProps) {
    const {
        ref: rootRef,
        player,
        classNames,
        className,
        basePath: basePathProp = DEFAULT_ASSET_BASE_PATH,
        scriptUrl,
        pluginOptions,
        playOptions,
        src,
        playing,
        mode = 0,
        windowIndex,
        token,
        keepDecoder = 0,
        startTime,
        endTime,
        playbackMode,
        split,
        selectedWindow,
        muted,
        volume,
        fullScreen,
        connectTimeout,
        interruptTime,
        autoResize = true,
        onReady,
        onLoadError,
        onPlaySuccess,
        onPlayError,
        onWindowSelect,
        onPluginError,
        onWindowOver,
        onWindowOut,
        onWindowUp,
        onFullScreenChange,
        onFirstFrame,
        onPerformanceLack,
        onStreamEnd,
        onStreamHeadChanged,
        onInterruptStream,
        onElementChanged,
        onThumbnailsEvent,
        onTalkPluginError,
        ...rootProps
    } = props

    const reactId = useId()
    const viewportId = `hikvision_player_${sanitizeId(reactId)}`
    const viewportRef = useRef<HTMLDivElement | null>(null)
    const playerRef = useRef<HikvisionPlayerInstance | null>(null)
    const [instance, setInstance] = useState<HikvisionPlayerInstance | null>(null)

    const basePath = normalizeBasePath(basePathProp)
    const resolvedScriptUrl = scriptUrl ?? joinUrl(basePath, "h5player.min.js")
    const getPluginOptions = useEffectEvent((): typeof pluginOptions => pluginOptions)
    const getInitialSplit = useEffectEvent((): HikvisionSplit | undefined => split)
    const notifyReady = useEffectEvent(optionalCallback(onReady))
    const notifyLoadError = useEffectEvent(optionalCallback(onLoadError))
    const notifyPlaySuccess = useEffectEvent(optionalCallback(onPlaySuccess))
    const notifyPlayError = useEffectEvent(optionalCallback(onPlayError))
    const handleWindowSelect = useEffectEvent(optionalCallback(onWindowSelect))
    const handlePluginError = useEffectEvent(optionalCallback(onPluginError))
    const handleWindowOver = useEffectEvent(optionalCallback(onWindowOver))
    const handleWindowOut = useEffectEvent(optionalCallback(onWindowOut))
    const handleWindowUp = useEffectEvent(optionalCallback(onWindowUp))
    const handleFullScreenChange = useEffectEvent(optionalCallback(onFullScreenChange))
    const handleFirstFrame = useEffectEvent(optionalCallback(onFirstFrame))
    const handlePerformanceLack = useEffectEvent(optionalCallback(onPerformanceLack))
    const handleStreamEnd = useEffectEvent(optionalCallback(onStreamEnd))
    const handleStreamHeadChanged = useEffectEvent(optionalCallback(onStreamHeadChanged))
    const handleInterruptStream = useEffectEvent(optionalCallback(onInterruptStream))
    const handleElementChanged = useEffectEvent(optionalCallback(onElementChanged))
    const handleThumbnailsEvent = useEffectEvent(optionalCallback(onThumbnailsEvent))
    const handleTalkPluginError = useEffectEvent(optionalCallback(onTalkPluginError))

    const setRootRef = useCallback(
        (node: HTMLDivElement | null) => {
            assignRef(rootRef, node)
        },
        [rootRef],
    )

    useEffect(() => {
        assignRef(player, playerRef.current)
        return () => assignRef(player, null)
    }, [player])

    useEffect(() => {
        if (typeof window === "undefined" || typeof document === "undefined") return undefined

        let disposed = false

        void loadHikvisionScript(resolvedScriptUrl)
            .then(JSPlugin => {
                if (disposed || !viewportRef.current) return

                const nextPluginOptions = getPluginOptions() as typeof pluginOptions
                const nextSplit = getInitialSplit() as HikvisionSplit | undefined
                const configuredCurrentSplit = typeof nextPluginOptions?.iCurrentSplit === "number" ? nextPluginOptions.iCurrentSplit : undefined
                const configuredMaxSplit = typeof nextPluginOptions?.iMaxSplit === "number" ? nextPluginOptions.iMaxSplit : undefined
                const initialSplit = configuredCurrentSplit ?? nextSplit ?? 1
                const maxSplit = configuredMaxSplit ?? Math.max(initialSplit, nextSplit ?? 1)

                const nextPlayer = new JSPlugin({
                    ...nextPluginOptions,
                    iMaxSplit: maxSplit,
                    iCurrentSplit: initialSplit,
                    szId: viewportId,
                    szBasePath: basePath,
                })

                const events = createWindowEvents({
                    onWindowSelect: handleWindowSelect,
                    onPluginError: handlePluginError,
                    onWindowOver: handleWindowOver,
                    onWindowOut: handleWindowOut,
                    onWindowUp: handleWindowUp,
                    onFullScreenChange: handleFullScreenChange,
                    onFirstFrame: handleFirstFrame,
                    onPerformanceLack: handlePerformanceLack,
                    onStreamEnd: handleStreamEnd,
                    onStreamHeadChanged: handleStreamHeadChanged,
                    onInterruptStream: handleInterruptStream,
                    onElementChanged: handleElementChanged,
                    onThumbnailsEvent: handleThumbnailsEvent,
                    onTalkPluginError: handleTalkPluginError,
                })

                playerRef.current = nextPlayer
                setInstance(nextPlayer)
                assignRef(player, nextPlayer)

                Promise.resolve(nextPlayer.JS_SetWindowControlCallback?.(events))
                    .then(() => notifyReady(nextPlayer))
                    .catch((error: unknown) => notifyLoadError(error))
            })
            .catch((error: unknown) => notifyLoadError(error))

        return () => {
            disposed = true
            const currentPlayer = playerRef.current

            playerRef.current = null
            setInstance(null)
            assignRef(player, null)

            if (!currentPlayer) return

            ignorePromise(currentPlayer.JS_StopRealPlayAll?.())
            ignorePromise(currentPlayer.JS_StopTalk?.())
            ignorePromise(currentPlayer.JS_Destroy?.())
        }
    }, [basePath, player, resolvedScriptUrl, viewportId])

    useEffect(() => {
        if (!instance || !autoResize) return undefined

        const resize = () => {
            ignorePromise(instance.JS_Resize?.())
        }

        const viewport = viewportRef.current
        const resizeObserver = typeof ResizeObserver !== "undefined" && viewport ? new ResizeObserver(resize) : undefined

        resize()
        window.addEventListener("resize", resize)
        if (viewport) resizeObserver?.observe(viewport)

        return () => {
            window.removeEventListener("resize", resize)
            resizeObserver?.disconnect()
        }
    }, [autoResize, instance])

    useEffect(() => {
        if (!instance || connectTimeout === undefined) return

        ignorePromise(instance.JS_SetConnectTimeOut?.(getWindowIndex(instance, windowIndex), connectTimeout))
    }, [connectTimeout, instance, windowIndex])

    useEffect(() => {
        if (!instance || interruptTime === undefined) return

        ignorePromise(instance.JS_SetInterruptTime?.(getWindowIndex(instance, windowIndex), interruptTime))
    }, [instance, interruptTime, windowIndex])

    useEffect(() => {
        if (!instance || split === undefined) return

        ignorePromise(instance.JS_ArrangeWindow(split))
    }, [instance, split])

    useEffect(() => {
        if (!instance || selectedWindow === undefined) return

        ignorePromise(instance.JS_SelectWnd?.(selectedWindow))
    }, [instance, selectedWindow])

    useEffect(() => {
        if (!instance || fullScreen === undefined) return

        ignorePromise(instance.JS_FullScreenDisplay?.(fullScreen))
    }, [fullScreen, instance])

    useEffect(() => {
        if (!instance || muted === undefined) return

        const currentWindowIndex = getWindowIndex(instance, windowIndex)
        ignorePromise(muted ? instance.JS_CloseSound(currentWindowIndex) : instance.JS_OpenSound(currentWindowIndex))
    }, [instance, muted, windowIndex])

    useEffect(() => {
        if (!instance || volume === undefined) return

        ignorePromise(instance.JS_SetVolume(getWindowIndex(instance, windowIndex), volume))
    }, [instance, volume, windowIndex])

    useEffect(() => {
        if (!instance) return

        const currentWindowIndex = getWindowIndex(instance, windowIndex)

        if (playing === false) {
            ignorePromise(instance.JS_Stop(currentWindowIndex))
            return
        }

        if (!src) return

        const effectivePlaybackMode = playbackMode ?? (startTime !== undefined && endTime !== undefined ? 1 : undefined)
        const config = buildPlayConfig(src, playOptions, mode, keepDecoder, token, effectivePlaybackMode)
        const maybeSetConnectTimeout =
            connectTimeout === undefined ? Promise.resolve() : Promise.resolve(instance.JS_SetConnectTimeOut?.(currentWindowIndex, connectTimeout))

        void maybeSetConnectTimeout
            .catch(() => undefined)
            .then(() => {
                if (startTime !== undefined && endTime !== undefined) return instance.JS_Play(src, config, currentWindowIndex, startTime, endTime)

                return instance.JS_Play(src, config, currentWindowIndex)
            })
            .then(() => notifyPlaySuccess(instance))
            .catch((error: unknown) => notifyPlayError(error))
    }, [connectTimeout, endTime, instance, keepDecoder, mode, playOptions, playbackMode, playing, src, startTime, token, windowIndex])

    return (
        <div {...rootProps} className={joinClassNames(classNames?.root, className)} ref={setRootRef}>
            <div className={classNames?.viewport} id={viewportId} ref={viewportRef} />
        </div>
    )
}

export default Player
