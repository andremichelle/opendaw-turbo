import "./style.css"
import {assert} from "@opendaw/lib-std"
import {PPQN} from "@opendaw/lib-dsp"
import {AnimationFrame, Browser} from "@opendaw/lib-dom"
import {Promises} from "@opendaw/lib-runtime"
import {Project, SyncLogReader, Worklets} from "@opendaw/studio-core"
import MeterProcessorUrl from "@opendaw/studio-core/meter-processor.js?url"
import EngineProcessorUrl from "@opendaw/studio-core/engine-processor.js?url"
import RecordingProcessorUrl from "@opendaw/studio-core/recording-processor.js?url"
import {testFeatures} from "./features"
import {MainThreadAudioLoaderManager} from "./MainThreadAudioLoaderManager"

(async () => {
    SyncLogReader
    console.debug("openDAW -> headless")
    console.debug("Agent", Browser.userAgent)
    console.debug("isLocalHost", Browser.isLocalHost())
    assert(crossOriginIsolated, "window must be crossOriginIsolated")
    console.debug("booting...")
    document.body.textContent = "booting..."
    {
        const {status, error} = await Promises.tryCatch(testFeatures())
        if (status === "rejected") {
            document.querySelector("#preloader")?.remove()
            alert(`Could not test features (${error})`)
            return
        }
    }
    const context = new AudioContext({latencyHint: 0})
    console.debug(`AudioContext state: ${context.state}, sampleRate: ${context.sampleRate}`)
    {
        const {status, error} = await Promises.tryCatch(Worklets.install(context, {
            meter: MeterProcessorUrl,
            engine: EngineProcessorUrl,
            recording: RecordingProcessorUrl
        }))
        if (status === "rejected") {
            alert(`Could not install Worklets (${error})`)
            return
        }
    }
    {
        const audioManager = new MainThreadAudioLoaderManager(context)
        const project = Project.load({audioManager}, await fetch("subset.od").then(x => x.arrayBuffer()))
        const worklet = Worklets.get(context).createEngine(project)
        await worklet.isReady()
        while (!await worklet.queryLoadingComplete()) {}
        worklet.connect(context.destination)
        worklet.isPlaying().setValue(true)
        AnimationFrame.add(() => {
            const ppqn = worklet.position().getValue()
            const {bars, beats} = PPQN.toParts(ppqn)
            document.body.textContent = `${bars + 1}:${beats + 1}`
        })
    }
    if (context.state === "suspended") {
        window.addEventListener("click",
            async () => await context.resume().then(() =>
                console.debug(`AudioContext resumed (${context.state})`)), {capture: true, once: true})
    }
    AnimationFrame.start()
    document.querySelector("#preloader")?.remove()
})()