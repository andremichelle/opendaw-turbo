import {Lifecycle, unitValue} from "@opendaw/lib-std"
import {Knob} from "@/ui/components/Knob.tsx"
import {ParameterLabel} from "@/ui/components/ParameterLabel.tsx"
import {createElement} from "@opendaw/lib-jsx"
import {AutomatableParameterFieldAdapter} from "@opendaw/studio-adapters"
import {DeviceBoxAdapter} from "@opendaw/studio-adapters"
import {Editing} from "@opendaw/lib-box"
import {MIDILearning} from "@/midi/devices/MIDILearning"

type Construct = {
    lifecycle: Lifecycle
    editing: Editing
    midiDevices: MIDILearning,
    adapter: DeviceBoxAdapter
    parameter: AutomatableParameterFieldAdapter
    anchor: unitValue
}

export const LabelKnob = ({lifecycle, editing, midiDevices, adapter, parameter, anchor}: Construct) => {
    return (
        <div style={{display: "contents"}}>
            <Knob lifecycle={lifecycle} value={parameter} anchor={anchor}/>
            <ParameterLabel lifecycle={lifecycle}
                            editing={editing}
                            midiLearning={midiDevices}
                            adapter={adapter}
                            parameter={parameter}/>
        </div>
    )
}