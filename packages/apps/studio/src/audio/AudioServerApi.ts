import {AudioData} from "@opendaw/studio-adapters"
import {ProgressHandler, UUID} from "@opendaw/lib-std"
import {AudioMetaData} from "@/audio/AudioMetaData"

export interface AudioServerApi {
    fetch(uuid: UUID.Format, progress: ProgressHandler): Promise<[AudioData, AudioMetaData]>
}