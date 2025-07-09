import {AudioSample} from "@/audio/AudioSample"
import {AudioFileBox} from "@opendaw/studio-boxes"
import {isDefined, Option, Terminable, UUID} from "@opendaw/lib-std"
import {showProcessMonolog} from "@/ui/components/dialogs"
import {Events, Files} from "@opendaw/lib-dom"
import {Promises} from "@opendaw/lib-runtime"
import {StudioService} from "@/service/StudioService"
import {AnyDragData} from "@/ui/AnyDragData"
import {FilePickerAcceptTypes} from "@/ui/FilePickerAcceptTypes.ts"
import {ContextMenu} from "@/ui/ContextMenu"
import {MenuItem} from "@/ui/model/menu-item"
import {PointerField} from "@opendaw/lib-box"
import {Pointers} from "@opendaw/studio-enums"
import {DragAndDrop} from "@/ui/DragAndDrop"

export interface SampleSelectStrategy {
    hasSample(): boolean
    replace(replacement: Option<AudioFileBox>): void
}

export namespace SampleSelectStrategy {
    export const changePointer = (filePointer: PointerField<Pointers.AudioFile>,
                                  replacement: Option<AudioFileBox>): void => {
        replacement.match({
            none: () => filePointer.box.delete(), // no sample > delete box
            some: newFile => filePointer.targetVertex.match({
                none: () => filePointer.refer(newFile), // just refer
                some: ({box: existingFile}) => {
                    if (UUID.equals(newFile.address.uuid, existingFile.address.uuid)) {
                        console.debug("Same Sample. Ignore.")
                    } else {
                        const mustDelete = existingFile.pointerHub.size() === 1 // filePointer was the only pointer > delete
                        filePointer.refer(newFile)
                        if (mustDelete) {
                            existingFile.delete()
                        }
                    }
                }
            })
        })
    }

    export const forPointerField = (filePointer: PointerField<Pointers.AudioFile>): SampleSelectStrategy => ({
        hasSample: (): boolean => filePointer.nonEmpty(),
        replace: (replacement: Option<AudioFileBox>): void => changePointer(filePointer, replacement)
    })
}

export class SampleSelector {
    readonly #service: StudioService
    readonly #strategy: SampleSelectStrategy

    constructor(service: StudioService, strategy: SampleSelectStrategy) {
        this.#service = service
        this.#strategy = strategy
    }

    newSample(sample: AudioSample) {
        if (!this.#service.hasProjectSession) {return}
        const {project: {boxGraph, editing}} = this.#service
        const {uuid: uuidAsString, name} = sample
        const uuid = UUID.parse(uuidAsString)
        editing.modify(() => this.#strategy.replace(Option.wrap(boxGraph.findBox<AudioFileBox>(uuid)
            .unwrapOrElse(() => AudioFileBox.create(boxGraph, uuid, box => box.fileName.setValue(name))))))
    }

    replaceSample(replacement: Option<AudioFileBox>) {
        if (!this.#service.hasProjectSession) {return}
        const {project: {editing}} = this.#service
        editing.modify(() => this.#strategy.replace(replacement))
    }

    hasSample(): boolean {return this.#strategy.hasSample()}

    createRemoveMenuData(): MenuItem {
        return MenuItem.default({
            label: "Remove Sample",
            selectable: this.hasSample()
        }).setTriggerProcedure(() => this.replaceSample(Option.None))
    }

    createBrowseMenuData(): MenuItem {
        return MenuItem.default({
            label: "Browse Sample..."
        }).setTriggerProcedure(() => this.browse())
    }

    async browse() {
        const {status, value: sample} = await Promises.tryCatch(
            Files.open(FilePickerAcceptTypes.WavFiles)
                .then(([file]) => file.arrayBuffer()
                    .then(arrayBuffer => this.#service.importSample({name: file.name, arrayBuffer}))))
        if (status === "resolved") {
            this.newSample(sample)
        }
    }

    configureBrowseClick(button: Element): Terminable {
        return Events.subscribe(button, "click", async () => this.browse())
    }

    configureContextMenu(button: Element): Terminable {
        return ContextMenu.subscribe(button, collector => collector.addItems(this.createRemoveMenuData()))
    }

    configureDrop(dropZone: HTMLElement): Terminable {
        return DragAndDrop.installTarget(dropZone, {
            drag: (_event: DragEvent, data: AnyDragData): boolean => data.type === "sample" || data.type === "file",
            drop: async (_event: DragEvent, data: AnyDragData): Promise<void> => {
                if (!(data.type === "sample" || data.type === "file")) {return}
                const dialog = showProcessMonolog("Import Sample")
                let sample: AudioSample
                if (data.type === "sample") {
                    sample = data.sample
                } else if (data.type === "file") {
                    if (!isDefined(data.file)) {return}
                    const {status, value, error} = await Promises.tryCatch(this.#service.importSample({
                        name: data.file.name,
                        arrayBuffer: await data.file.arrayBuffer()
                    }))
                    if (status === "rejected") {
                        console.warn(error)
                        dialog.close()
                        return
                    }
                    sample = value
                } else {
                    dialog.close()
                    return
                }
                this.newSample(sample)
                dialog.close()
            },
            enter: (allowDrop: boolean) => dropZone.classList.toggle("accept", allowDrop),
            leave: () => dropZone.classList.remove("accept")
        })
    }
}