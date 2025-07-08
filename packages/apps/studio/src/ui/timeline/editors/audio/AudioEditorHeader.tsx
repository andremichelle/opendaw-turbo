import css from "./AudioEditorHeader.sass?inline"
import {Lifecycle} from "@opendaw/lib-std"
import {StudioService} from "@/service/StudioService.ts"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"

const className = Html.adoptStyleSheet(css, "AudioEditorHeader")

type Construct = {
    lifecycle: Lifecycle
    service: StudioService
}

export const AudioEditorHeader = ({}: Construct) => (
    <div className={className}>
        <p className="help-section">
            Navigatable but otherwise non-functional yet
        </p>
    </div>
)