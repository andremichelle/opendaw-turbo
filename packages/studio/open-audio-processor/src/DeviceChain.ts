import {Terminable} from "@opendaw/lib-std"

export interface DeviceChain extends Terminable {
    invalidateWiring(): void
}