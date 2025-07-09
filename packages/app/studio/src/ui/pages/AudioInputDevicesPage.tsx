import css from "./AudioInputDevicesPage.sass?inline"
import {Await, createElement, Frag, PageContext, PageFactory} from "@opendaw/lib-jsx"
import {StudioService} from "@/service/StudioService.ts"
import {Html} from "@opendaw/lib-dom"
import {AudioDevices} from "@/audio/AudioDevices"
import {StreamPeakMeter} from "@/ui/pages/StreamPeakMeter"
import {gainToDb} from "@opendaw/lib-dsp"
import {RadioGroup} from "../components/RadioGroup"
import {Icon} from "@/ui/components/Icon"
import {IconSymbol} from "@opendaw/studio-adapters"
import {DefaultObservableValue, Terminable, Terminator} from "@opendaw/lib-std"
import {Promises} from "@opendaw/lib-runtime"

const className = Html.adoptStyleSheet(css, "AudioInputDevicesPage")

export const AudioInputDevicesPage: PageFactory<StudioService> =
    ({lifecycle, service}: PageContext<StudioService>) => {
        return (
            <div className={className}>
                <h1>Audio Input Devices</h1>
                <div className="layout">
                    <h3>Legend</h3>
                    <div className="legend">
                        <Icon symbol={IconSymbol.Disconnected}/><span>Not connected</span>
                        <Icon symbol={IconSymbol.Connected}/><span>Connected (showing input levels)</span>
                        <Icon symbol={IconSymbol.SpeakerHeadphone}/><span>Monitoring (loopback audio)</span>
                    </div>
                    <h3>Devices</h3>
                    <Await factory={() => AudioDevices.queryListInputDevices()}
                           loading={() => (
                               <div>loading...</div>
                           )}
                           failure={({retry, reason}) => (
                               <div onclick={retry}>[{reason}] Click to Retry</div>
                           )}
                           success={(devices) => (
                               <div className="devices">
                                   {devices.map(device => {
                                       enum State {Idle, Capturing, Monitoring}

                                       const channelDecibels = new Float32Array(2).fill(Number.NEGATIVE_INFINITY)
                                       const model = new DefaultObservableValue(State.Idle)
                                       const runtime = lifecycle.own(new Terminator())
                                       lifecycle.own(model.catchupAndSubscribe(owner => {
                                           runtime.terminate()
                                           const state = owner.getValue()
                                           if (state !== State.Idle) {
                                               Promises.makeAbortable(runtime, AudioDevices.queryAudioInputDeviceStream(
                                                   service.context.sampleRate, device.deviceId, 2))
                                                   .then(stream => {
                                                       const worklet = service.worklets.createMeter(2)
                                                       const source = service.context.createMediaStreamSource(stream)
                                                       source.connect(worklet)
                                                       if (state === State.Monitoring) {
                                                           source.connect(source.context.destination)
                                                       }
                                                       runtime.ownAll(
                                                           worklet,
                                                           worklet.subscribe(({peak}) => {
                                                               channelDecibels[0] = gainToDb(peak[0])
                                                               channelDecibels[1] = gainToDb(peak[1])
                                                           }),
                                                           Terminable.create((() => {
                                                               channelDecibels.fill(Number.NEGATIVE_INFINITY)
                                                               source.disconnect()
                                                           }))
                                                       )
                                                   }, () => model.setValue(State.Idle))
                                           }
                                       }))
                                       return (
                                           <Frag>
                                               <div className="label">{device.label}</div>
                                               <RadioGroup lifecycle={lifecycle}
                                                           elements={[
                                                               {
                                                                   value: State.Idle,
                                                                   element: (<Icon symbol={IconSymbol.Disconnected}/>),
                                                                   tooltip: "Not Connected"
                                                               },
                                                               {
                                                                   value: State.Capturing,
                                                                   element: (<Icon symbol={IconSymbol.Connected}/>),
                                                                   tooltip: "Connected"
                                                               },
                                                               {
                                                                   value: State.Monitoring,
                                                                   element: (
                                                                       <Icon symbol={IconSymbol.SpeakerHeadphone}/>),
                                                                   tooltip: "Monitoring (Loopback)"
                                                               }
                                                           ]}
                                                           model={model}/>
                                               <StreamPeakMeter lifecycle={lifecycle} peaks={channelDecibels}/>
                                           </Frag>
                                       )
                                   })}
                               </div>
                           )}/>
                </div>
            </div>
        )
    }