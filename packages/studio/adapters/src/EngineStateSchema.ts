import {Schema} from "@opendaw/lib-std"

export const EngineStateSchema = Schema.createBuilder({
    position: Schema.float,
    clipIndex: Schema.int16
})

export type EngineState = ReturnType<typeof EngineStateSchema>["object"]