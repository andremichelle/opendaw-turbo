const key = Symbol.for("@openDAW/lib-fusion")

if ((globalThis as any)[key]) {
    throw new Error(`${key.description} was imported twice.`)
} else {
    (globalThis as any)[key] = true
    console.debug(`%c${key.description}%c is available.`, "color: hsl(200, 83%, 60%)", "color: inherit")
}

import './types'

export * from "./live-stream/LiveStreamReceiver"
export * from "./live-stream/LiveStreamBroadcaster"
export * from "./peaks/Peaks"
export * from "./peaks/PeakWorker"
export * from "./peaks/PeakProtocol"
export * from "./peaks/PeaksPainter"
export * from "./opfs/OpfsWorker"
export * from "./opfs/OpfsProtocol"