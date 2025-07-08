import {Peaks} from "@opendaw/lib-fusion"
import {PeakAgent} from "@/service/agents"
import {AudioData} from "@opendaw/studio-adapters"
import {ProgressHandler} from "@opendaw/lib-std"

export namespace AudioPeaks {
    export const generate = async (audio: AudioData, progress: ProgressHandler): Promise<ArrayBuffer> => {
        const shifts = Peaks.findBestFit(audio.numberOfFrames)
        return await PeakAgent.generateAsync(
            progress,
            shifts,
            audio.frames,
            audio.numberOfFrames,
            audio.numberOfChannels) as ArrayBuffer
    }
}