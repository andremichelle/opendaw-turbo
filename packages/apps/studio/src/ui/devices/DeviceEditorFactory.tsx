import {createElement, JsxValue} from "@opendaw/lib-jsx"
import {
    ArpeggioDeviceBox,
    AudioBusBox,
    BoxVisitor,
    DelayDeviceBox,
    ModularDeviceBox,
    NanoDeviceBox,
    PitchDeviceBox,
    PlayfieldDeviceBox,
    PlayfieldSampleBox,
    RevampDeviceBox,
    ReverbDeviceBox,
    StereoToolDeviceBox,
    TapeDeviceBox,
    VaporisateurDeviceBox,
    ZeitgeistDeviceBox
} from "@opendaw/studio-boxes"
import {ArpeggioDeviceEditor} from "@/ui/devices/midi-effects/ArpeggioDeviceEditor.tsx"
import {
    ArpeggioDeviceBoxAdapter,
    AudioBusBoxAdapter,
    DelayDeviceBoxAdapter,
    DeviceHost,
    ModularDeviceBoxAdapter,
    NanoDeviceBoxAdapter,
    PitchDeviceBoxAdapter,
    PlayfieldDeviceBoxAdapter,
    PlayfieldSampleBoxAdapter,
    RevampDeviceBoxAdapter,
    ReverbDeviceBoxAdapter,
    StereoToolDeviceBoxAdapter,
    TapeDeviceBoxAdapter,
    VaporisateurDeviceBoxAdapter,
    ZeitgeistDeviceBoxAdapter
} from "@opendaw/studio-adapters"
import {DelayDeviceEditor} from "@/ui/devices/audio-effects/DelayDeviceEditor.tsx"
import {ReverbDeviceEditor} from "@/ui/devices/audio-effects/ReverbDeviceEditor.tsx"
import {RevampDeviceEditor} from "@/ui/devices/audio-effects/RevampDeviceEditor.tsx"
import {ModularDeviceEditor} from "@/ui/devices/audio-effects/ModularDeviceEditor.tsx"
import {asDefined, Lifecycle} from "@opendaw/lib-std"
import {Box} from "@opendaw/lib-box"
import {PitchDeviceEditor} from "./midi-effects/PitchDeviceEditor"
import {TapeDeviceEditor} from "@/ui/devices/instruments/TapeDeviceEditor.tsx"
import {VaporisateurDeviceEditor} from "@/ui/devices/instruments/VaporisateurDeviceEditor.tsx"
import {AudioBusEditor} from "@/ui/devices/AudioBusEditor.tsx"
import {NanoDeviceEditor} from "./instruments/NanoDeviceEditor"
import {PlayfieldDeviceEditor} from "./instruments/PlayfieldDeviceEditor"
import {StereoToolDeviceEditor} from "./audio-effects/StereoToolDeviceEditor"
import {PlayfieldSampleEditor} from "./instruments/PlayfieldSampleEditor"
import {ZeitgeistDeviceEditor} from "@/ui/devices/midi-effects/ZeitgeistDeviceEditor"
import {StudioService} from "@/service/StudioService"

export namespace DeviceEditorFactory {
    export const toMidiEffectDeviceEditor = (service: StudioService, lifecycle: Lifecycle, box: Box, deviceHost: DeviceHost) =>
        asDefined(box.accept<BoxVisitor<JsxValue>>({
            visitArpeggioDeviceBox: (box: ArpeggioDeviceBox) => (
                <ArpeggioDeviceEditor lifecycle={lifecycle}
                                      service={service}
                                      adapter={service.project.boxAdapters.adapterFor(box, ArpeggioDeviceBoxAdapter)}
                                      deviceHost={deviceHost}/>
            ),
            visitPitchDeviceBox: (box: PitchDeviceBox) => (
                <PitchDeviceEditor lifecycle={lifecycle}
                                   service={service}
                                   adapter={service.project.boxAdapters.adapterFor(box, PitchDeviceBoxAdapter)}
                                   deviceHost={deviceHost}/>
            ),
            visitZeitgeistDeviceBox: (box: ZeitgeistDeviceBox) => (
                <ZeitgeistDeviceEditor lifecycle={lifecycle}
                                       service={service}
                                       adapter={service.project.boxAdapters.adapterFor(box, ZeitgeistDeviceBoxAdapter)}
                                       deviceHost={deviceHost}/>
            )
        }), `No MidiEffectDeviceEditor found for ${box}`)

    export const toInstrumentDeviceEditor = (service: StudioService,
                                             lifecycle: Lifecycle,
                                             box: Box,
                                             deviceHost: DeviceHost) =>
        asDefined(box.accept<BoxVisitor<JsxValue>>({
            visitTapeDeviceBox: (box: TapeDeviceBox): JsxValue => (
                <TapeDeviceEditor lifecycle={lifecycle}
                                  service={service}
                                  adapter={service.project.boxAdapters.adapterFor(box, TapeDeviceBoxAdapter)}
                                  deviceHost={deviceHost}/>
            ),
            visitVaporisateurDeviceBox: (box: VaporisateurDeviceBox): JsxValue => (
                <VaporisateurDeviceEditor lifecycle={lifecycle}
                                          service={service}
                                          adapter={service.project.boxAdapters.adapterFor(box, VaporisateurDeviceBoxAdapter)}
                                          deviceHost={deviceHost}/>
            ),
            visitNanoDeviceBox: (box: NanoDeviceBox): JsxValue => (
                <NanoDeviceEditor lifecycle={lifecycle}
                                  service={service}
                                  adapter={service.project.boxAdapters.adapterFor(box, NanoDeviceBoxAdapter)}
                                  deviceHost={deviceHost}/>
            ),
            visitPlayfieldDeviceBox: (box: PlayfieldDeviceBox): JsxValue => (
                <PlayfieldDeviceEditor lifecycle={lifecycle}
                                       service={service}
                                       adapter={service.project.boxAdapters.adapterFor(box, PlayfieldDeviceBoxAdapter)}
                                       deviceHost={deviceHost}/>
            ),
            visitPlayfieldSampleBox: (box: PlayfieldSampleBox): JsxValue => (
                <PlayfieldSampleEditor lifecycle={lifecycle}
                                       service={service}
                                       adapter={service.project.boxAdapters.adapterFor(box, PlayfieldSampleBoxAdapter)}
                                       deviceHost={deviceHost}/>
            ),
            visitAudioBusBox: (box: AudioBusBox): JsxValue => (
                <AudioBusEditor lifecycle={lifecycle}
                                service={service}
                                adapter={service.project.boxAdapters.adapterFor(box, AudioBusBoxAdapter)}/>
            )
        }), `No MidiEffectDeviceEditor found for ${box}`)

    export const toAudioEffectDeviceEditor = (service: StudioService, lifecycle: Lifecycle, box: Box, deviceHost: DeviceHost) =>
        asDefined(box.accept<BoxVisitor<JsxValue>>({
            visitStereoToolDeviceBox: (box: StereoToolDeviceBox) => (
                <StereoToolDeviceEditor lifecycle={lifecycle}
                                        service={service}
                                        adapter={service.project.boxAdapters.adapterFor(box, StereoToolDeviceBoxAdapter)}
                                        deviceHost={deviceHost}/>
            ),
            visitDelayDeviceBox: (box: DelayDeviceBox) => (
                <DelayDeviceEditor lifecycle={lifecycle}
                                   service={service}
                                   adapter={service.project.boxAdapters.adapterFor(box, DelayDeviceBoxAdapter)}
                                   deviceHost={deviceHost}/>
            ),
            visitReverbDeviceBox: (box: ReverbDeviceBox) => (
                <ReverbDeviceEditor lifecycle={lifecycle}
                                    service={service}
                                    adapter={service.project.boxAdapters.adapterFor(box, ReverbDeviceBoxAdapter)}
                                    deviceHost={deviceHost}/>
            ),
            visitRevampDeviceBox: (box: RevampDeviceBox) => (
                <RevampDeviceEditor lifecycle={lifecycle}
                                    service={service}
                                    adapter={service.project.boxAdapters.adapterFor(box, RevampDeviceBoxAdapter)}
                                    deviceHost={deviceHost}/>
            ),
            visitModularDeviceBox: (box: ModularDeviceBox) => (
                <ModularDeviceEditor lifecycle={lifecycle}
                                     service={service}
                                     adapter={service.project.boxAdapters.adapterFor(box, ModularDeviceBoxAdapter)}
                                     deviceHost={deviceHost}/>
            )
        }), `No AudioEffectDeviceEditor found for ${box}`)
}