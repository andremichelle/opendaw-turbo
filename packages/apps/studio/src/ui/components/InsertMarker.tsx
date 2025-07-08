import css from "./InsertMarker.sass?inline"
import {Html} from "@opendaw/lib-dom"
import {IconSymbol} from "@opendaw/studio-adapters"
import {Icon} from "@/ui/components/Icon"
import {createElement} from "@opendaw/lib-jsx"

const className = Html.adoptStyleSheet(css, "InsertMarker")

export const InsertMarker = () => {
    return (
        <div className={className}>
            <Icon symbol={IconSymbol.ArrayDown}/>
        </div>
    )
}