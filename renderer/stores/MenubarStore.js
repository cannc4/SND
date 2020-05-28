import {
  observable,
  action,
  computed
} from 'mobx'
import _ from 'lodash'

class MenubarStore {
    // 0 = inactive
    // 1 = ready
    // 2 = running
    @observable serverInfo = 0;
    @observable recording = false
    @observable playing = false

    @computed get getActive () {
      return this.serverInfo
    }

    @computed get isRecording () {
      return this.recording
    }

    @computed get isPlaying () {
      return this.playing
    }

    @action togglePlay () {
      this.playing = !this.playing
      this.play(this.playing)
    }

    createRMSShape_Left () {
      const c = document.getElementById('RMSVis_Left')
      const ctx = c.getContext('2d')

      const length = _.toInteger(this.rmsArray.length * 0.5)
      const w = c.width

      const h = c.height
      const m = 5

      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < length; i++) {
        const _w = w / length
        const _h = _.toNumber(this.rmsArray[i].rms.toFixed(10)) * 10.0

        ctx.fillStyle = 'rgba(180, 180, 180, ' + (_h + 0.2) / (0.75 * h) + ')'

        ctx.fillRect(i * _w + m, h * 0.5, _w - m, _h)
        ctx.fillRect(i * _w + m, h * 0.5, _w - m, -_h)
      }
    }

    createRMSShape_Right () {
      const c = document.getElementById('RMSVis_Right')
      const ctx = c.getContext('2d')

      const l_left = _.toInteger(this.rmsArray.length * 0.5)
      const l_right = this.rmsArray.length - l_left
      const w = c.width

      const h = c.height
      const m = 5

      ctx.clearRect(0, 0, w, h)
      for (let i = l_left; i < this.rmsArray.length; i++) {
        const _w = w / l_right
        const _h = _.toNumber(this.rmsArray[i].rms.toFixed(10)) * 10.0

        ctx.fillStyle = 'rgba(180, 180, 180, ' + (_h + 0.2) / (0.75 * h) + ')'

        ctx.fillRect((i - l_left) * _w + m, h * 0.5, _w - m, _h)
        ctx.fillRect((i - l_left) * _w + m, h * 0.5, _w - m, -_h)
      }
    }

    @action stopServer () {
      // AudioEngine stop
    }

    @action bootServer (config) {
      // AudioEngine init
    }

    @action record () {
      // AudioEngine record
    }

    @action play () {
      // transport play
    }
}

export default new MenubarStore()
