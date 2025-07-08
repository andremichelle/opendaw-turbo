import css from "./ClipPlaybackButton.sass?inline"
import {DefaultObservableValue, Lifecycle} from "@opendaw/lib-std"
import {AnyClipBoxAdapter, IconSymbol} from "@opendaw/studio-adapters"
import {Colors} from "@/ui/Colors"
import {IconCartridge} from "@/ui/components/Icon"
import {createElement} from "@opendaw/lib-jsx"
import {ClipState} from "./Clip"
import {Html} from "@opendaw/lib-dom"
import {StudioService} from "@/service/StudioService"

const className = Html.adoptStyleSheet(css, "ClipPlaybackButton")

type Construct = {
    lifecycle: Lifecycle
    service: StudioService
    adapter: AnyClipBoxAdapter
    state: DefaultObservableValue<ClipState>
}

export const ClipPlaybackButton = ({lifecycle, service, adapter, state}: Construct) => {
    const iconModel = new DefaultObservableValue(IconSymbol.Play)
    const element: HTMLElement = (
        <div className={className}
             ondblclick={event => event.stopPropagation()}
             onclick={() => {
                 if (state.getValue() !== ClipState.Idle) {
                     service.engine.scheduleClipStop(adapter.trackBoxAdapter.unwrap().uuid)
                 } else if (!adapter.box.mute.getValue()) {
                     service.engine.scheduleClipPlay(adapter.uuid)
                 }
             }}>
            <IconCartridge lifecycle={lifecycle}
                           symbol={iconModel}
                           style={{color: Colors.gray}}/>
        </div>
    )
    lifecycle.own(state.catchupAndSubscribe(owner => {
        switch (owner.getValue()) {
            case ClipState.Idle:
                iconModel.setValue(IconSymbol.Play)
                break
            case ClipState.Waiting:
                break
            case ClipState.Playing:
                iconModel.setValue(IconSymbol.Stop)
                break
        }
    }))
    return element
}