import {ProgressHandler, SortedSet, UUID} from "@opendaw/lib-std"
import {UIAudioLoader} from "@/project/UIAudioLoader"
import {AudioLoaderManager} from "@opendaw/studio-adapters"
import {AudioServerApi} from "@/audio/AudioServerApi"
import {AudioData} from "@opendaw/studio-adapters"
import {AudioMetaData} from "@/audio/AudioMetaData"

export class UIAudioManager implements AudioLoaderManager, AudioServerApi {
    readonly #api: AudioServerApi
    readonly #context: AudioContext
    readonly #loaders: SortedSet<UUID.Format, UIAudioLoader>

    constructor(api: AudioServerApi, context: AudioContext) {
        this.#api = api
        this.#context = context
        this.#loaders = UUID.newSet(loader => loader.uuid)
    }

    get context(): AudioContext {return this.#context}

    fetch(uuid: UUID.Format, progress: ProgressHandler): Promise<[AudioData, AudioMetaData]> {
        return this.#api.fetch(uuid, progress)
    }

    invalidate(uuid: UUID.Format) {this.#loaders.opt(uuid).ifSome(loader => loader.invalidate())}

    getOrCreate(uuid: UUID.Format): UIAudioLoader {
        return this.#loaders.getOrCreate(uuid, uuid => new UIAudioLoader(this, uuid))
    }
}