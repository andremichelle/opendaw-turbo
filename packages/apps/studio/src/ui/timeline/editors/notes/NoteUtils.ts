import {
    NoteEventCollectionBoxAdapter
} from "@opendaw/studio-adapters"
import {MidiFile} from "@/midi/format/MidiFile"
import {MidiTrack} from "@/midi/format/MidiTrack"
import {Promises} from "@opendaw/lib-runtime"
import {Files} from "@opendaw/lib-dom"

export const exportNotesToMidiFile = async (collection: NoteEventCollectionBoxAdapter, suggestedName: string) => {
    const encoder = MidiFile.encoder()
    encoder.addTrack(MidiTrack.fromCollection(collection.events))
    return Promises.tryCatch(Files.save(encoder.encode().toArrayBuffer() as ArrayBuffer, {
        types: [{
            description: "Midi File",
            accept: {"application/octet-stream": [".mid", ".midi"]}
        }], suggestedName
    }))
}