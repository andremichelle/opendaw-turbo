import {
    assert,
    byte,
    isInstanceOf,
    Lazy,
    MutableObservableValue,
    Notifier,
    ObservableValue,
    Observer,
    Option,
    Subscription,
    Terminable,
    Terminator
} from "@opendaw/lib-std"
import {showInfoDialog} from "@/ui/components/dialogs"
import {MidiData} from "@/midi/MidiData"
import {RouteLocation} from "@opendaw/lib-jsx"
import {AnimationFrame, Browser, ConsoleCommands} from "@opendaw/lib-dom"
import {MIDIMessageSubscriber} from "@/midi/devices/MIDIMessageSubscriber"

export class MidiDeviceAccess {
    static get(): Option<MidiDeviceAccess> {return this.#instance}

    static canRequestMidiAccess(): boolean {return "requestMIDIAccess" in navigator}

    static panic(): void {
        this.get().ifSome(midi => {
            for (let note = 0; note < 128; note++) {
                for (let channel = 0; channel < 16; channel++) {
                    const data = MidiData.noteOff(channel, note)
                    const event = new MessageEvent("midimessage", {data: data})
                    for (let input of midi.#access.inputs.values()) {
                        input.dispatchEvent(event)
                    }
                    for (let output of midi.#access.outputs.values()) {
                        output.send(data)
                    }
                }
            }
        })
    }

    @Lazy
    static available(): MutableObservableValue<boolean> {
        const notifier = new Notifier<ObservableValue<boolean>>()
        return new class implements MutableObservableValue<boolean> {
            setValue(value: boolean): void {
                if (this.getValue()) {return}
                assert(value, "Internal Error")
                if (MidiDeviceAccess.canRequestMidiAccess()) {
                    MidiDeviceAccess.#isRequesting = (() => {
                        const promise = navigator.requestMIDIAccess({sysex: false})
                        promise
                            .then(access => MidiDeviceAccess.#instance = Option.wrap(new MidiDeviceAccess(access)))
                            .catch(reason => {
                                // do not use the dialog promise as a return > will delay the 'finally' statement below
                                showInfoDialog({
                                    headline: "Cannot Access MIDI Devices",
                                    message: isInstanceOf(reason, Error) ? reason.message : String(reason),
                                    buttons: Browser.isFirefox() ? [{
                                        text: "Manual",
                                        primary: true,
                                        onClick: (handler) => {
                                            handler.close()
                                            RouteLocation.get().navigateTo("manuals/firefox-midi")
                                        }
                                    }] : undefined
                                }).then()
                            })
                            .finally(() => {
                                MidiDeviceAccess.#isRequesting = Option.None
                                AnimationFrame.once(() => notifier.notify(this)) // This helps prevent Firefox from freezing
                            })
                        return Option.wrap(promise)
                    })()
                } else {
                    showInfoDialog({
                        headline: "Cannot Access MIDI Devices",
                        message: "This browser does not support the WebMidiApi (Hint: Chrome does)."
                    }).then()
                }
            }
            getValue(): boolean {return MidiDeviceAccess.#instance.nonEmpty() || MidiDeviceAccess.#isRequesting.nonEmpty()}
            subscribe(observer: Observer<ObservableValue<boolean>>): Subscription {return notifier.subscribe(observer)}
            catchupAndSubscribe(observer: Observer<ObservableValue<boolean>>): Subscription {
                observer(this)
                return this.subscribe(observer)
            }
        }
    }

    static subscribeMessageEvents(observer: Observer<MIDIMessageEvent>, channel?: byte): Subscription {
        return this.#instance.match({
            none: () => {
                const terminator = new Terminator()
                terminator.own(this.available().subscribe(() => terminator.own(this.subscribeMessageEvents(observer, channel))))
                return terminator
            },
            some: midi => midi.subscribeMessageEvents(observer, channel)
        })
    }

    static #instance: Option<MidiDeviceAccess> = Option.None
    static #isRequesting: Option<Promise<MIDIAccess>> = Option.None

    readonly #access: MIDIAccess

    constructor(access: MIDIAccess) {
        this.#access = access

        let subscription: Subscription = Terminable.Empty
        ConsoleCommands.exportMethod("midi.listen.all",
            (bool: string) => {
                subscription.terminate()
                const listen = bool === undefined ? true : Boolean(bool)
                if (listen) {
                    subscription = this.subscribeMessageEvents(event => console.debug(MidiData.debug(event.data)))
                }
                return listen
            })
    }

    subscribeMessageEvents(observer: Observer<MIDIMessageEvent>, channel?: byte): Subscription {
        return MIDIMessageSubscriber.subscribeMessageEvents(this.#access, observer, channel)
    }
}