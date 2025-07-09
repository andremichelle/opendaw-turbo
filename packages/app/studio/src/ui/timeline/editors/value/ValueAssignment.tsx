import {DeviceBoxAdapter} from "@opendaw/studio-adapters"
import {AutomatableParameterFieldAdapter} from "@opendaw/studio-adapters"

export type ValueAssignment = {
    device?: DeviceBoxAdapter
    adapter: AutomatableParameterFieldAdapter
}