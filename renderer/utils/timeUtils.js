// mixtes:
export const convertToMs = (hms) => {
  const val = hms.toString().split(':')
  return (+val[0]) * 60 * 60 + (+val[1]) * 60 + (+val[2])
}

// minutes are worth 60 seconds. Hours are worth 60 minutes.
export const beatToMin = (beat, bpm) => {
  return ~~(beat / bpm)
}

export const beatToSec = (beat, bpm) => {
  return this._padZero(beat * 60 / bpm % 60)
}

// beats:
export const beatToBeat = (beat) => {
  return '' + ~~(beat + 1)
}
export const beatToStep = (beat, stepsPerBeat) => {
  return this._padZero(beat % 1 * stepsPerBeat + 1)
}
export const beatToMStep = (beat, stepsPerBeat) => {
  return this._getMil(beat % 1 * stepsPerBeat)
}

// seconds:
export const secToMin = (sec) => {
  return '' + ~~(sec / 60)
}
export const secToSec = (sec) => {
  return this._padZero(sec % 60)
}
export const secToMs = (sec) => {
  return this._getMil(sec)
}

// helpers
export const _getMil = (val) => {
  val = ~~(val * 1000 % 1000)
  return (val < 10 ? '00' : val < 100 ? '0' : '') + val
}
export const _padZero = (val) => {
  return (val < 10 ? '0' : '') + ~~val
}
