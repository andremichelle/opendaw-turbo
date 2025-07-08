import {Observer, Subscription} from "@opendaw/lib-std"
import {Modifier} from "@/ui/timeline/Modifier.ts"

export interface ObservableModifier extends Modifier {
    subscribeUpdate(observer: Observer<void>): Subscription
}