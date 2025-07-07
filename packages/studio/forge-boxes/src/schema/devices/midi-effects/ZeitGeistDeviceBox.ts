import {BoxSchema} from "@opendaw/lib-box-forge"
import {Pointers} from "@opendaw/studio-enums"
import {createMidiEffectDevice} from "../builder"

export const ZeitgeistDeviceBox: BoxSchema<Pointers> = createMidiEffectDevice("ZeitgeistDeviceBox", {
    10: {type: "pointer", name: "groove", pointerType: Pointers.Groove, mandatory: true}
})