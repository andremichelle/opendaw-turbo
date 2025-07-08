import {PeakMeterProcessorOptions} from "@opendaw/studio-adapters"
import {int, Notifier, Observer, Schema, Subscription, SyncStream, Terminable, Terminator} from "@opendaw/lib-std"
import {AnimationFrame} from "@opendaw/lib-dom"
import {WorkletFactory} from "./WorkletFactory"

export type PeakSchema = { peak: Float32Array, rms: Float32Array }

export class MeterWorklet extends AudioWorkletNode implements Terminable {
    static async bootFactory(context: BaseAudioContext, url: string): Promise<WorkletFactory<MeterWorklet>> {
        return WorkletFactory.boot(context, url)
    }

    static create(factory: WorkletFactory<MeterWorklet>, numChannels: int): MeterWorklet {
        return factory.create(context => new MeterWorklet(context, numChannels))
    }

    readonly #terminator: Terminator = new Terminator()
    readonly #notifier: Notifier<PeakSchema> = new Notifier<PeakSchema>()

    private constructor(context: BaseAudioContext, numberOfChannels: int) {
        const receiver = SyncStream.reader(Schema.createBuilder({
            peak: Schema.floats(numberOfChannels),
            rms: Schema.floats(numberOfChannels)
        })(), (data: PeakSchema) => this.#notifier.notify(data))
        super(context, "peak-meter-processor", {
            numberOfInputs: 1,
            channelCount: numberOfChannels,
            channelCountMode: "explicit",
            processorOptions: {
                sab: receiver.buffer,
                numberOfChannels,
                rmsWindowInSeconds: 0.100,
                valueDecay: 0.200
            } satisfies PeakMeterProcessorOptions
        })
        this.#terminator.own(AnimationFrame.add(() => receiver.tryRead()))
    }

    subscribe(observer: Observer<PeakSchema>): Subscription {return this.#notifier.subscribe(observer)}

    terminate(): void {this.#terminator.terminate()}
}