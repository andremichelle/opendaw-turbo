import {ProgressHandler, UUID} from "@opendaw/lib-std"
import {AudioSample} from "@/audio/AudioSample"

export type SampleImporter = {
    importSample(sample: {
        uuid: UUID.Format,
        name: string,
        arrayBuffer: ArrayBuffer,
        progressHandler?: ProgressHandler
    }): Promise<AudioSample>
}