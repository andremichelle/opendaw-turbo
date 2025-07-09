const key = Symbol.for("@openDAW/lib-dsp")

if ((globalThis as any)[key]) {
    console.debug(`%c${key.description}%c is already available in ${globalThis.constructor.name}.`, "color: hsl(10, 83%, 60%)", "color: inherit")
} else {
    (globalThis as any)[key] = true
    console.debug(`%c${key.description}%c is now available in ${globalThis.constructor.name}.`, "color: hsl(200, 83%, 60%)", "color: inherit")
}

export * from "./biquad-coeff"
export * from "./biquad-processor"
export * from "./bpm-tools"
export * from "./chords"
export * from "./delay"
export * from "./events"
export * from "./fft"
export * from "./fractions"
export * from "./fragmentor"
export * from "./graph"
export * from "./grooves"
export * from "./midi-keys"
export * from "./notes"
export * from "./osc"
export * from "./ppqn"
export * from "./ramp"
export * from "./rms"
export * from "./stereo"
export * from "./utils"
export * from "./value"
export * from "./window"