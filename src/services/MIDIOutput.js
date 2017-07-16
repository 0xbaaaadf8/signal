export default class MIDIOutput {
  constructor() {
    navigator.requestMIDIAccess({sysex : true}).then(midiAccess => {
      const outputs = Array.from(midiAccess.outputs.values())
      this.midiOutput = outputs[0]
    }, error => {
      console.error(error)
    })
  }

  send(msg, timestamp) {
    if (this.midiOutput) {
      this.midiOutput.send(msg, timestamp)
    }
  }
}
