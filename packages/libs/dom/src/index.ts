const key = Symbol.for("@openDAW/lib-dom")

if ((globalThis as any)[key]) {
    throw new Error(`${key.description} was imported twice.`)
} else {
    (globalThis as any)[key] = true
    console.debug(`%c${key.description}%c is available.`, "color: hsl(200, 83%, 60%)", "color: inherit")
}

export * from "./browser"
export * from "./compression"
export * from "./console-commands"
export * from "./context-2d"
export * from "./css-utils"
export * from "./dragging"
export * from "./events"
export * from "./errors"
export * from "./files"
export * from "./fonts"
export * from "./frames"
export * from "./html"
export * from "./keyboard"
export * from "./modfier-keys"
export * from "./stream"
export * from "./svg"
export * from "./terminable"