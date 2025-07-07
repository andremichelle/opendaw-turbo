const key = Symbol.for("@openDAW/lib-box")

if ((globalThis as any)[key]) {
    throw new Error(`${key.description} was imported twice.`)
} else {
    (globalThis as any)[key] = true
    console.debug(`%c${key.description}%c is available.`, "color: hsl(200, 83%, 60%)", "color: inherit")
}

export * from "./address"
export * from "./array"
export * from "./box"
export * from "./dispatchers"
export * from "./editing"
export * from "./field"
export * from "./graph"
export * from "./graph-edges"
export * from "./object"
export * from "./pointer"
export * from "./pointer-hub"
export * from "./primitive"
export * from "./sync"
export * from "./sync-source"
export * from "./sync-target"
export * from "./updates"
export * from "./vertex"