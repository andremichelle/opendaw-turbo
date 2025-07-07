import "./style.css"
import {tryProvide, UUID} from "@opendaw/lib-std"
import {PPQN} from "@opendaw/lib-dsp"
import {Wait} from "@opendaw/lib-runtime"
import {Address} from "@opendaw/lib-box"
import {Browser} from "@opendaw/lib-dom"
import {Peaks} from "@opendaw/lib-fusion"
import {replaceChildren} from "@opendaw/lib-jsx"
import {Test} from "./Test"

(async () => {
    console.debug(tryProvide(() => 5), PPQN.toString(PPQN.Bar), Address.compose(UUID.generate(), 3, 42).toString(), Browser.userAgent, Peaks)
    await Wait.frames(60)
    console.debug("done")
    replaceChildren(document.body, Test({}))
})()