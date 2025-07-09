import {AudioFileBox} from "@opendaw/studio-boxes"
import {panic, UUID} from "@opendaw/lib-std"
import {AudioSample} from "@/audio/AudioSample"
import {SampleApi} from "@/service/SampleApi"
import {AudioStorage} from "@/audio/AudioStorage"
import {Promises} from "@opendaw/lib-runtime"
import {SampleDialogs} from "@/ui/browse/SampleDialogs"
import {Errors} from "@opendaw/lib-dom"
import {showInfoDialog} from "@/ui/components/dialogs"
import {BoxGraph} from "@opendaw/lib-box"
import {SampleImporter} from "@/project/SampleImporter"
import {AudioLoaderManager} from "@opendaw/studio-adapters"

export namespace SampleUtils {
    export const verify = async (boxGraph: BoxGraph, importer: SampleImporter, audioManager: AudioLoaderManager) => {
        const boxes = boxGraph.boxes().filter((box) => box instanceof AudioFileBox)
        if (boxes.length > 0) {
            // check for missing samples
            const online = UUID.newSet<{ uuid: UUID.Format, sample: AudioSample }>(x => x.uuid)
            online.addMany((await SampleApi.all()).map(sample => ({uuid: UUID.parse(sample.uuid), sample})))
            const offline = UUID.newSet<{ uuid: UUID.Format, sample: AudioSample }>(x => x.uuid)
            offline.addMany((await AudioStorage.list()).map(sample => ({uuid: UUID.parse(sample.uuid), sample})))
            for (const box of boxes) {
                const uuid = box.address.uuid
                if (online.hasKey(uuid)) {continue}
                const optSample = offline.opt(uuid)
                if (optSample.isEmpty()) {
                    const {
                        status,
                        error,
                        value: sample
                    } = await Promises.tryCatch(SampleDialogs.missingSampleDialog(importer, uuid, box.fileName.getValue()))
                    if (status === "rejected") {
                        if (Errors.isAbort(error)) {continue} else {return panic(String(error))}
                    }
                    await showInfoDialog({
                        headline: "Replaced Sample",
                        message: `${sample.name} has been replaced`
                    })
                    audioManager.invalidate(UUID.parse(sample.uuid))
                }
            }
        }
    }
}