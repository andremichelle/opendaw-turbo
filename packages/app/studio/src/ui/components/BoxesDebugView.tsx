import css from "./BoxesDebugView.sass?inline"
import {NumberComparator, UUID} from "@opendaw/lib-std"
import {createElement} from "@opendaw/lib-jsx"
import {BoxGraph} from "@opendaw/lib-box"
import {showDebugBoxDialog} from "@/ui/components/dialogs.tsx"
import {Html} from "@opendaw/lib-dom"

const className = Html.adoptStyleSheet(css, "BoxesDebugView")

type Construct = {
    boxGraph: BoxGraph
}

export const BoxesDebugView = ({boxGraph}: Construct) => {
    return (
        <div className={className}>
            <h2>Boxes</h2>
            <div className="boxes">
                <div className="title">
                    <span className="name">Name</span>
                    <span className="dependencies">In</span>
                    <span className="dependencies">Out</span>
                    <span className="name">ID</span>
                </div>
                <div className="scrollable">
                    {boxGraph.boxes().toSorted((a, b) => NumberComparator(a.creationIndex, b.creationIndex)).map(box => (
                        <div className="box" onclick={() => showDebugBoxDialog(box)}>
                            <span className="name">{box.name}</span>
                            <span className="dependencies">{box.incomingEdges().length}</span>
                            <span className="dependencies">{box.outgoingEdges().length}</span>
                            <span className="uuid">{UUID.toString(box.address.uuid)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}