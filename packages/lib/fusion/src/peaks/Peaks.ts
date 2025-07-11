import {Arrays, assert, ByteArrayInput, ByteArrayOutput, float, Float16, int, Unhandled} from "@opendaw/lib-std"

export class Peaks {
    static from(input: ByteArrayInput): Peaks {
        assert(input.readString() === "PEAKS", "Wrong header")
        const numStages = input.readInt()
        const stages: Array<Peaks.Stage> = []
        for (let i = 0; i < numStages; i++) {
            const dataOffset = input.readInt()
            const numPeaks = input.readInt()
            const shift = input.readInt()
            const mask = input.readInt()
            stages[i] = new Peaks.Stage(mask, shift, numPeaks, dataOffset)
        }
        const numData = input.readInt()
        const data: Array<Int32Array> = []
        for (let i = 0; i < numData; i++) {
            const array = new Int8Array(input.readInt())
            input.readBytes(array)
            data[i] = new Int32Array(array.buffer)
        }
        const numFrames = input.readInt()
        const numChannels = input.readInt()
        return new Peaks(stages, data, numFrames, numChannels)
    }

    static readonly None = new Peaks([], [], 0, 0)

    constructor(readonly stages: ReadonlyArray<Peaks.Stage>,
                readonly data: ReadonlyArray<Int32Array>,
                readonly numFrames: int,
                readonly numChannels: int) {}

    nearest(unitsPerPixel: number): Peaks.Stage | null {
        if (this.stages.length === 0) {return null}
        const shift = Math.floor(Math.log(Math.abs(unitsPerPixel)) / Math.LN2)
        let i = this.stages.length
        while (--i > -1) {
            if (shift >= this.stages[i].shift) {
                return this.stages[i]
            }
        }
        return this.stages[0]
    }

    toArrayBuffer(): ArrayBufferLike {
        const output = ByteArrayOutput.create()
        output.writeString("PEAKS")
        output.writeInt(this.stages.length)
        for (let i = 0; i < this.stages.length; i++) {
            const {dataOffset, numPeaks, shift, mask} = this.stages[i]
            output.writeInt(dataOffset)
            output.writeInt(numPeaks)
            output.writeInt(shift)
            output.writeInt(mask)
        }
        output.writeInt(this.data.length)
        for (let i = 0; i < this.data.length; i++) {
            const array = new Int8Array(this.data[i].buffer)
            output.writeInt(array.length)
            output.writeBytes(array)
        }
        output.writeInt(this.numFrames)
        output.writeInt(this.numChannels)
        return output.toArrayBuffer()
    }

    toString(): string {return `{Peaks num-stages: ${this.stages.length}}`}
}

export namespace Peaks {
    export const findBestFit = (numFrames: int, width: int = 1200): Uint8Array => {
        const ratio = numFrames / width
        if (ratio <= 1.0) {
            return new Uint8Array(0)
        }
        const ShiftPadding = 3
        const maxShift = Math.floor(Math.log(ratio) / Math.LN2)
        const numStages = Math.max(1, Math.floor(maxShift / ShiftPadding))
        return new Uint8Array(Arrays.create(index => ShiftPadding * (index + 1), numStages))
    }

    export class Stage {
        constructor(readonly mask: int, readonly shift: int, readonly numPeaks: int, readonly dataOffset: int) {}
        unitsEachPeak(): int {return 1 << this.shift}
    }

    export const unpack = (bits: int, index: 0 | 1): float => {
        switch (index) {
            case 0:
                return Float16.intBitsToFloat(bits)
            case 1:
                return Float16.intBitsToFloat(bits >> 16)
            default:
                return Unhandled(index)
        }
    }
}