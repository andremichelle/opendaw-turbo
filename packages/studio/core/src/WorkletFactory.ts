import {Func} from "@opendaw/lib-std"
import {Promises} from "@opendaw/lib-runtime"

export class WorkletFactory<W extends AudioWorkletNode> {
    static boot<W extends AudioWorkletNode>(context: BaseAudioContext,
                                            moduleURL: string): Promise<WorkletFactory<W>> {
        return Promises.retry(() => context.audioWorklet.addModule(moduleURL).then(() => new WorkletFactory<W>(context)))
    }

    readonly #context: BaseAudioContext

    constructor(context: BaseAudioContext) {this.#context = context}

    create(factory: Func<BaseAudioContext, W>): W {return factory(this.#context)}
}