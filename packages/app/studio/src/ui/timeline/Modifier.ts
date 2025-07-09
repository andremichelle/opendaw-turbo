import {Dragging} from "@opendaw/lib-dom"
import {Editing} from "@opendaw/lib-box"

export interface Modifier {
    update(event: Dragging.Event): void
    approve(editing: Editing): void
    cancel(): void
}