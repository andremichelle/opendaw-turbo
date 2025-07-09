import {AudioClipBox} from "@opendaw/studio-boxes"
import {ColorCodes} from "@/ui/mixer/ColorCodes.ts"
import {ElementCapturing} from "@/ui/canvas/capturing.ts"
import {PPQN} from "@opendaw/lib-dsp"
import {UUID} from "@opendaw/lib-std"
import {CreateParameters, TimelineDragAndDrop} from "@/ui/timeline/tracks/audio-unit/TimelineDragAndDrop"
import {ClipCaptureTarget} from "./ClipCapturing"
import {ClipWidth} from "@/ui/timeline/tracks/audio-unit/clips/constants"
import {StudioService} from "@/service/StudioService"

export class ClipSampleDragAndDrop extends TimelineDragAndDrop<ClipCaptureTarget> {
    constructor(service: StudioService, capturing: ElementCapturing<ClipCaptureTarget>) {
        super(service, capturing)
    }

    handleSample({
                     event, trackBoxAdapter, audioFileBox, sample: {name, duration: durationInSeconds, bpm}
                 }: CreateParameters): void {
        const x = event.clientX - this.capturing.element.getBoundingClientRect().left
        const index = Math.floor(x / ClipWidth)
        const duration = Math.round(PPQN.secondsToPulses(durationInSeconds, bpm))
        AudioClipBox.create(this.project.boxGraph, UUID.generate(), box => {
            box.index.setValue(index)
            box.duration.setValue(duration)
            box.clips.refer(trackBoxAdapter.box.clips)
            box.hue.setValue(ColorCodes.forTrackType(trackBoxAdapter.type))
            box.label.setValue(name)
            box.file.refer(audioFileBox)
        })
    }
}