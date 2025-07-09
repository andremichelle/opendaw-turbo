import css from "./PitchDeviceEditor.sass?inline"
import {DeviceHost, PitchDeviceBoxAdapter} from "@opendaw/studio-adapters"
import {Lifecycle} from "@opendaw/lib-std"
import {DeviceEditor} from "@/ui/devices/DeviceEditor.tsx"
import {MenuItems} from "@/ui/devices/menu-items.ts"
import {createElement} from "@opendaw/lib-jsx"
import {ControlBuilder} from "@/ui/devices/ControlBuilder.tsx"
import {DeviceMidiMeter} from "@/ui/devices/panel/DeviceMidiMeter.tsx"
import {Html} from "@opendaw/lib-dom"
import {Effects} from "@/service/Effects"
import {StudioService} from "@/service/StudioService"

const className = Html.adoptStyleSheet(css, "PitchDeviceEditor")

type Construct = {
    lifecycle: Lifecycle
    service: StudioService
    adapter: PitchDeviceBoxAdapter
    deviceHost: DeviceHost
}

export const PitchDeviceEditor = ({lifecycle, service, adapter, deviceHost}: Construct) => {
    const {octaves, semiTones, cent} = adapter.namedParameter
    const {project, midiLearning} = service
    const {editing} = project
    return (
        <DeviceEditor lifecycle={lifecycle}
                      project={project}
                      adapter={adapter}
                      populateMenu={parent => MenuItems.forEffectDevice(parent, service, deviceHost, adapter)}
                      populateControls={() => (
                          <div className={className}>
                              {ControlBuilder.createKnob({
                                  lifecycle,
                                  editing,
                                  midiLearning: midiLearning,
                                  adapter,
                                  parameter: octaves
                              })}
                              {ControlBuilder.createKnob({
                                  lifecycle,
                                  editing,
                                  midiLearning: midiLearning,
                                  adapter,
                                  parameter: semiTones
                              })}
                              {ControlBuilder.createKnob({
                                  lifecycle,
                                  editing,
                                  midiLearning: midiLearning,
                                  adapter,
                                  parameter: cent
                              })}
                          </div>
                      )}
                      populateMeter={() => (
                          <DeviceMidiMeter lifecycle={lifecycle}
                                           receiver={project.liveStreamReceiver}
                                           address={adapter.address}/>
                      )}
                      icon={Effects.MidiNamed.pitch.icon}/>
    )
}