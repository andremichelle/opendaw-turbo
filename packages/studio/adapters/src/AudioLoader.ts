import {AudioData} from "./AudioData"
import {Peaks} from "@opendaw/lib-fusion"
import {Observer, Option, Subscription, unitValue, UUID} from "@opendaw/lib-std"

export interface AudioLoaderManager {
    getOrCreate(uuid: UUID.Format): AudioLoader
    invalidate(uuid: UUID.Format): void
}

export interface AudioLoader {
    readonly data: Option<AudioData>
    readonly peaks: Option<Peaks>
    readonly uuid: UUID.Format
    readonly state: AudioLoaderState
    subscribe(observer: Observer<AudioLoaderState>): Subscription
}

export type AudioLoaderState =
    | { type: "idle" }
    | { type: "progress", progress: unitValue }
    | { type: "error", reason: string }
    | { type: "loaded" }