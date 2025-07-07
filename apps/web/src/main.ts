import {Header} from "@opendaw/ui/header"
import "./style.css"
import typescriptLogo from "/typescript.svg"
import {Counter} from "@opendaw/ui/counter"
import {setupCounter} from "@opendaw/ui/setup-counter"
import {tryProvide} from "@opendaw/lib-std"
import {PPQN} from "@opendaw/lib-dsp"

console.debug(tryProvide(() => 5), PPQN.toString(PPQN.Bar))

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    ${Header({title: "Web"})}
    <div class="card">
      ${Counter()}
    </div>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!)
