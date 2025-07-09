import {Selection} from "@opendaw/lib-std"
import {TimelineSelectableLocator} from "@/ui/timeline/TimelineSelectableLocator.ts"
import {Editing} from "@opendaw/lib-box"
import {Event} from "@opendaw/lib-dsp"
import {Events, Keyboard} from "@opendaw/lib-dom"
import {BoxAdapter} from "@opendaw/studio-adapters"

export const attachShortcuts = <E extends Event & BoxAdapter>(element: Element,
                                                              editing: Editing,
                                                              selection: Selection<E>,
                                                              locator: TimelineSelectableLocator<E>) =>
    Events.subscribe(element, "keydown", (event: KeyboardEvent) => {
        if (Keyboard.GlobalShortcut.isSelectAll(event)) {
            selection.select(...locator.selectable())
        } else if (Keyboard.GlobalShortcut.isDelete(event)) {
            editing.modify(() => selection.selected()
                .forEach(event => event.box.delete()))
        }
    })