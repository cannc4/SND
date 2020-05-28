import {
  observable,
  action,
  computed
} from 'mobx'
import { deepObserve } from 'mobx-utils'
import _ from 'lodash'
import GraphStore from './GraphStore'

class MixStore {
    commandStack = []

    @observable width = 800

    @observable height = 800

    @observable mixTracks = []

    constructor(){
      deepObserve(this.mixTracks, (m) => {
        console.log(m)
        this.commandStack.push(m)
      })
    }
    @computed
    get componentWidth () {
      return this.width
    }

    @computed
    get componentHeight () {
      return this.height
    }

    @action
    undo(){
      console.log(this.commandStack)
    }

    @action
    resizeComponent (clientHeight, clientWidth) {
      this.width = clientWidth
      this.height = clientHeight
    }

    // Getters
    @computed get
    getMixTracks () {
      return this.mixTracks
    }

    @action
    isSelected (index) {
      if (this.mixTracks[index]) { return this.mixTracks[index].selected }
    }

    @action
    updateVolume (i, val) {
      if (this.getMixTracks[i]) { this.getMixTracks[i].volume = val }
    }

    // Add Delete Tracks
    @action addMixTrack (name) {
      let id
      if ((this.mixTracks.length > 0) && (this.mixTracks[this.mixTracks.length]) && (this.mixTracks[this.mixTracks.length].tracks)) {
        id = this.mixTracks[this.mixTracks.length].tracks.length
      } else {
        id = 0
      }
      const trackTemp = {
        name: name,
        id: id,
        send: {},
        rms: 0,
        volume: 85,
        pan: 0.5,
        color: '#111',
        solo: false,
        mute: false,
        selected: false
      }
      this.mixTracks.push(trackTemp)
      GraphStore.addMixNode(trackTemp)
    }

    @action deleteMixTrack (id) {
      this.mixTracks = _.reject(this.mixTracks, {
        id: id
      })
      // Rearrange the active chproject index
      _.each(this.getActiveMixTracks, (c, i) => {
        c.id = i
      })
    }

    @action changeMixTrackName (name, new_name) {
      const ch = _.find(this.mixTracks, {
        name: name
      })
      const ch_new = _.find(this.mixTracks, {
        name: new_name
      })
      if (ch !== undefined && ch_new === undefined) {
        ch.name = new_name
      }
    }

    // Toggle Header Fields
    @action toggleMute (id) {
      const ch = _.find(this.mixTracks, {
        id: id
      })
      if (ch !== undefined) {
        ch.mute = !ch.mute

        if (ch.mute === true) {
          // CSS for mute

        }
      }
    }

    @action toggleSolo (id) {
      const ch = _.find(this.mixTracks, {
        id: id
      })
      if (ch !== undefined) {
        ch.solo = !ch.solo
        if (ch.solo) {
          this.soloEnabled = true
          _.forEach(this.getActiveMixTracks, (other) => {
            if (other.name !== ch.name) {
              other.solo = false
              // CSS for solo
            }
          })
        } else this.soloEnabled = false
      }
    }

    @action load (mix) {
      this.mixTracks = mix
    }
}
// const mixStore =

export default new MixStore()
