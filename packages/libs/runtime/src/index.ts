const key = Symbol.for("@openDAW/lib-runtime")

if ((globalThis as any)[key]) {
    throw new Error(`${key.description} was imported twice.`)
} else {
    (globalThis as any)[key] = true
    console.debug(`%c${key.description}%c is available.`, "color: hsl(200, 83%, 60%)", "color: inherit")
}

export * from "./communicator"
export * from "./fetch"
export * from "./runtime"
export * from "./messenger"
export * from "./network"
export * from "./promises"
export * from "./stopwatch"
export * from "./timespan"
export * from "./wait"