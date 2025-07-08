import {asDefined, int} from "@opendaw/lib-std"
import {ExportStemsConfiguration} from "@opendaw/studio-adapters"
import {WorkletFactory} from "./WorkletFactory"
import {EngineWorklet} from "./EngineWorklet"
import {MeterWorklet} from "./MeterWorklet"
import {RecordingWorklet} from "./RecordingWorklet"
import {Project} from "./Project"

export type WorkletUrls = {
    meter: string
    engine: string
    recording: string
}

export class Worklets {
    static async install(context: AudioContext, {engine, meter, recording}: WorkletUrls): Promise<Worklets> {
        return Promise.all([
            EngineWorklet.bootFactory(context, engine),
            MeterWorklet.bootFactory(context, meter),
            RecordingWorklet.bootFactory(context, recording)
        ]).then(([engine, meter, recording]) => {
            const worklets = new Worklets(engine, meter, recording)
            this.#map.set(context, worklets)
            return worklets
        })
    }

    static get(context: AudioContext): Worklets {return asDefined(this.#map.get(context), "Worklets not installed")}

    static #map: WeakMap<AudioContext, Worklets> = new WeakMap<AudioContext, Worklets>()

    readonly #meter: WorkletFactory<MeterWorklet>
    readonly #engine: WorkletFactory<EngineWorklet>
    readonly #recording: WorkletFactory<RecordingWorklet>

    constructor(engine: WorkletFactory<EngineWorklet>,
                meter: WorkletFactory<MeterWorklet>,
                recording: WorkletFactory<RecordingWorklet>) {
        this.#meter = meter
        this.#engine = engine
        this.#recording = recording
    }

    createMeter(numberOfChannels: int): MeterWorklet {
        return MeterWorklet.create(this.#meter, numberOfChannels)
    }

    createEngine(project: Project, exportConfiguration?: ExportStemsConfiguration): EngineWorklet {
        return this.#engine.create(context => new EngineWorklet(context, project, exportConfiguration))
    }

    createRecording(numberOfChannels: int, numChunks: int): RecordingWorklet {
        return RecordingWorklet.create(this.#recording, numberOfChannels, numChunks)
    }
}