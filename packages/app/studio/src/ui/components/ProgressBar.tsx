import {Html} from "@opendaw/lib-dom"
import css from "./ProgressBar.sass?inline"
import {Lifecycle, ObservableValue, unitValue} from "@opendaw/lib-std"
import {createElement} from "@opendaw/lib-jsx"

const className = Html.adoptStyleSheet(css, "ProgressBar")

type Construct = {
    lifecycle: Lifecycle
    progress: ObservableValue<unitValue>
}

export const ProgressBar = ({lifecycle, progress}: Construct) => {
    const element: HTMLElement = (
        <div className={className}>
            <div/>
        </div>
    )
    const update = () => element.style.setProperty("--progress", progress.getValue().toFixed(3))
    lifecycle.own(progress.subscribe(update))
    update()
    return element
}