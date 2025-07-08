import {WorkletFactory} from "./WorkletFactory"
import {EngineWorklet} from "./EngineWorklet"
import {MeterWorklet} from "./MeterWorklet"
import {RecordingWorklet} from "./RecordingWorklet"

export interface AudioWorklets {
    engine: WorkletFactory<EngineWorklet>
    meter: WorkletFactory<MeterWorklet>
    recording: WorkletFactory<RecordingWorklet>
}

export namespace AudioWorklets {
    export type Urls = {
        engine: string
        meter: string
        recording: string
    }
    export const install = async (context: AudioContext, {
        engine,
        meter,
        recording
    }: Urls): Promise<AudioWorklets> => Promise.all([
        EngineWorklet.bootFactory(context, engine),
        MeterWorklet.bootFactory(context, meter),
        RecordingWorklet.bootFactory(context, recording)
    ]).then(([engine, meter, recording]) => ({engine, meter, recording}))
}