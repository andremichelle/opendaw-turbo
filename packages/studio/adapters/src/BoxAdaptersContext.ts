import {Terminable} from "@opendaw/lib-std"
import {BoxGraph} from "@opendaw/lib-box"
import {LiveStreamBroadcaster, LiveStreamReceiver} from "@opendaw/lib-fusion"
import {AudioLoaderManager} from "./AudioLoader"
import {RootBoxAdapter} from "./RootBoxAdapter"
import {TimelineBoxAdapter} from "./timeline/TimelineBoxAdapter"
import {ClipSequencing} from "./ClipSequencing"
import {ParameterFieldAdapters} from "./ParameterFieldAdapters"
import {BoxAdapters} from "./BoxAdapters"

export interface BoxAdaptersContext extends Terminable {
    get boxGraph(): BoxGraph
    get boxAdapters(): BoxAdapters
    get audioManager(): AudioLoaderManager
    get rootBoxAdapter(): RootBoxAdapter
    get timelineBoxAdapter(): TimelineBoxAdapter
    get liveStreamReceiver(): LiveStreamReceiver
    get liveStreamBroadcaster(): LiveStreamBroadcaster
    get clipSequencing(): ClipSequencing
    get parameterFieldAdapters(): ParameterFieldAdapters
    get bpm(): number // TODO This is a shortcut for now
    get isMainThread(): boolean
    get isAudioContext(): boolean
}