import {byte, float, Lifecycle, Terminable} from "@opendaw/lib-std"
import {createElement} from "@opendaw/lib-jsx"
import {DeviceEditor} from "@/ui/devices/DeviceEditor.tsx"
import {MenuItems} from "@/ui/devices/menu-items.ts"
import {DevicePeakMeter} from "@/ui/devices/panel/DevicePeakMeter.tsx"
import {Instruments} from "@/service/Instruments"
import {DeviceHost, IconSymbol, NoteSender, NoteSustainer, PlayfieldSampleBoxAdapter} from "@opendaw/studio-adapters"
import {SlotEditor} from "@/ui/devices/instruments/PlayfieldDeviceEditor/SlotEditor"
import {Colors} from "@/ui/Colors"
import {Events} from "@opendaw/lib-dom"
import {Icon} from "@/ui/components/Icon"
import {TextTooltip} from "@/ui/surface/TextTooltip"
import {StudioService} from "@/service/StudioService"

type Construct = {
    lifecycle: Lifecycle
    service: StudioService
    adapter: PlayfieldSampleBoxAdapter
    deviceHost: DeviceHost
}

export const PlayfieldSampleEditor = ({lifecycle, service, adapter, deviceHost}: Construct) => {
    const {engine, project} = service
    const audioUnitBoxAdapter = deviceHost.audioUnitBoxAdapter()
    const noteSender: NoteSender = {
        noteOn: (note: byte, velocity: float) => engine.noteOn(audioUnitBoxAdapter.uuid, note, velocity),
        noteOff: (note: byte) => engine.noteOff(audioUnitBoxAdapter.uuid, note)
    }
    const fileName = adapter.file().mapOr(file => file.box.fileName.getValue(), "N/A")
    const deviceName = adapter.device().labelField.getValue()
    const goDevice = () => project.userEditingManager.audioUnit.edit(deviceHost.audioUnitBoxAdapter().box.editing)
    return (
        <DeviceEditor lifecycle={lifecycle}
                      project={project}
                      adapter={adapter}
                      populateMenu={parent => MenuItems.forAudioUnitInput(parent, service, deviceHost)}
                      populateControls={() => (
                          <SlotEditor lifecycle={lifecycle}
                                      service={service}
                                      adapter={adapter}/>
                      )}
                      populateMeter={() => (
                          <DevicePeakMeter lifecycle={lifecycle}
                                           receiver={project.liveStreamReceiver}
                                           address={adapter.peakAddress}/>
                      )}
                      createLabel={() => {
                          const deviceLabel: HTMLElement = (
                              <span onclick={goDevice}
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor: Colors.green,
                                        height: "1.25em",
                                        lineHeight: "1.25em",
                                        borderRadius: "2px",
                                        padding: "0 0.125em",
                                        color: "rgba(0, 0, 0, 0.8)"
                                    }}>{deviceName}</span>
                          )
                          const playLabel: HTMLElement = (
                              <div
                                  style={{
                                      display: "inline-flex",
                                      columnGap: "0.5em",
                                      alignItems: "center",
                                      cursor: "pointer"
                                  }}>
                                  <Icon symbol={IconSymbol.Play}/> {fileName}
                              </div>)
                          let noteLifeTime = Terminable.Empty
                          lifecycle.ownAll(
                              Terminable.create(() => noteLifeTime.terminate()),
                              TextTooltip.default(deviceLabel, () => "Go back to device"),
                              TextTooltip.default(playLabel, () => "Play sample"),
                              Events.subscribe(playLabel, "pointerdown", ({pointerId}: PointerEvent) => {
                                  playLabel.setPointerCapture(pointerId)
                                  noteLifeTime = NoteSustainer.start(noteSender, adapter.indexField.getValue())
                              }),
                              Events.subscribe(playLabel, "pointerup", () => noteLifeTime.terminate())
                          )
                          return (
                              <h1 style={{display: "flex", columnGap: "0.5em", alignItems: "center"}}>
                                  {deviceLabel}
                                  {playLabel}
                              </h1>
                          )
                      }}
                      icon={Instruments.Playfield.icon}/>
    )
}