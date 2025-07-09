import css from "./ReverbDeviceEditor.sass?inline"
import {DeviceHost, ReverbDeviceBoxAdapter} from "@opendaw/studio-adapters"
import {Lifecycle} from "@opendaw/lib-std"
import {createElement} from "@opendaw/lib-jsx"
import {DeviceEditor} from "@/ui/devices/DeviceEditor.tsx"
import {MenuItems} from "@/ui/devices/menu-items.ts"
import {ControlBuilder} from "@/ui/devices/ControlBuilder.tsx"
import {SnapCommonDecibel} from "@/ui/configs.ts"
import {DevicePeakMeter} from "@/ui/devices/panel/DevicePeakMeter.tsx"
import {Effects} from "@/service/Effects"
import {Html} from "@opendaw/lib-dom"
import {StudioService} from "@/service/StudioService"

const className = Html.adoptStyleSheet(css, "ReverbDeviceEditor")

type Construct = {
    lifecycle: Lifecycle
    service: StudioService
    adapter: ReverbDeviceBoxAdapter
    deviceHost: DeviceHost
}

export const ReverbDeviceEditor = ({lifecycle, service, adapter, deviceHost}: Construct) => {
    const {project, midiLearning} = service
    const {editing} = project
    const {decay, preDelay, damp, dry, wet} = adapter.namedParameter
    return (
        <DeviceEditor lifecycle={lifecycle}
                      project={project}
                      adapter={adapter}
                      populateMenu={parent => MenuItems.forEffectDevice(parent, service, deviceHost, adapter)}
                      populateControls={() => (
                          <div className={className}>
                              {ControlBuilder.createKnob({
                                  lifecycle, editing, midiLearning: midiLearning, adapter, parameter: decay
                              })}
                              <div/>
                              {ControlBuilder.createKnob({
                                  lifecycle, editing, midiLearning: midiLearning, adapter, parameter: preDelay
                              })}
                              {ControlBuilder.createKnob({
                                  lifecycle, editing, midiLearning: midiLearning, adapter, parameter: damp
                              })}
                              {ControlBuilder.createKnob({
                                  lifecycle,
                                  editing,
                                  midiLearning: midiLearning,
                                  adapter,
                                  parameter: dry,
                                  options: SnapCommonDecibel
                              })}
                              {ControlBuilder.createKnob({
                                  lifecycle,
                                  editing,
                                  midiLearning: midiLearning,
                                  adapter,
                                  parameter: wet,
                                  options: SnapCommonDecibel
                              })}
                          </div>
                      )}
                      populateMeter={() => (
                          <DevicePeakMeter lifecycle={lifecycle}
                                           receiver={project.liveStreamReceiver}
                                           address={adapter.address}/>
                      )}
                      icon={Effects.AudioNamed.Reverb.icon}/>
    )
}