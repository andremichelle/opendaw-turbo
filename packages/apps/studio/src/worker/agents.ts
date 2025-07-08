import {Messenger} from "@opendaw/lib-runtime"
import {OpfsWorker, PeakWorker} from "@opendaw/lib-fusion"

const messenger: Messenger = Messenger.for(self)

OpfsWorker.init(messenger)
PeakWorker.install(messenger)