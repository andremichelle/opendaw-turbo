import css from "./PrimaryTracks.sass?inline"
import {Lifecycle, ObservableValue, Terminator} from "@opendaw/lib-std"
import {createElement} from "@opendaw/lib-jsx"
import {StudioService} from "@/service/StudioService.ts"
import {MarkerTrack} from "./marker/MarkerTrack"
import {Html} from "@opendaw/lib-dom"

const className = Html.adoptStyleSheet(css, "primary-tracks")

type Construct = {
    lifecycle: Lifecycle
    service: StudioService
}

export const PrimaryTracks = ({lifecycle, service}: Construct) => {
    const {timeline: {primaryVisible}} = service
    const element: Element = (<div className={className}/>)
    const terminator = lifecycle.own(new Terminator())
    const visibleObserver = (owner: ObservableValue<boolean>) => {
        terminator.terminate()
        if (owner.getValue()) {
            element.appendChild(<MarkerTrack lifecycle={terminator} service={service}/>)
        } else {
            Html.empty(element)
        }
    }
    lifecycle.own(primaryVisible.subscribe(visibleObserver))
    visibleObserver(primaryVisible)
    return element
}