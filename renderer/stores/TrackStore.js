import {
  observable,
  action,
  computed
} from 'mobx'
import { deepObserve } from 'mobx-utils'
import _ from 'lodash'
import GraphStore from './GraphStore'

class Block {
  start
  end
  value
  MIDIEVENT

  constructor(props){
    this.start = props.start  
    this.end = props.end  
    this.value = props.value
    this.MIDIEVENT = props.MIDIEVENT
  }

  get(){
    return this.serialize()
  }

  serialize(){
    return `start=${this.start} end=${this.end} value=${this.value}`
  }
}

class TrackStore {

    commandStack = []

    @observable tracks =[]
    
    @observable trackGroups = []

    @observable soloEnabled = false

    /*
    ------------------------------------------------
    ||              Audio Props                  ||
    ------------------------------------------------
    */

    audioContextObject = null

    buffer = _.fill(Array(12), 0)

    constructor () {
      this.audioContextObject = this.getAudioContext()
      
      deepObserve(this.trackGroups, (t) => {
        console.log(t)
        this.commandStack.push(t)
      })
    }

    getAudioContext = () => {
      window.AudioContext =
          window.AudioContext ||
          window.webkitAudioContext ||
          window.mozAudioContext ||
          window.oAudioContext
      const context = new AudioContext()
      return context
    }

    /////////////////////////////////////////////////////

    @computed get
    getTracks () {
      return this.tracks
    }

    @computed get
    getTrackGroups () {
      return this.trackGroups
    }

    @computed get
    trackCount () {
      return this.getTracks.length
    }

    @action undo(){
      console.log(this.commandStack)
      // this.trackGroups = this.commandStack[this.commandStack.length - 2].object
    }

    @action('clears the store')
    clear() {
      this.tracks =[]
      this.trackGroups = []
      GraphStore.graphs = [{
        id: 0,
        NODES: [],
        CONNECTIONS: []
      }]
    }
    

    @action('updates the region start/end values')
    updateRegionPosition(tid, attrs){
      console.log(tid)
      console.log(attrs)
      const idx = this._getTrackIndexWithId(tid)
      const startPointInComposition = attrs.x
      // TODO: 
      // do the time conversion
      // assume its first block
      // get current transport values
      console.log(attrs.x)
      this.tracks[idx].BLOCK[0].start = startPointInComposition
      
    }

    @action
    updateTracks (tracks) {
      this.tracks = tracks
    }

    _getTrackWithId(id){
      const idx = this._getTrackIndexWithId(id)
      return this.tracks[idx];
    }
    
    _getTrackIndexWithId(id){
      const idx = this.tracks.map((x) => {return x.id; }).indexOf(id)
      return idx
    }
  

    @action
    updateTrackGroups (trackGroups) {
      this.trackGroups = trackGroups
    }

    @action
    addTrackGroup () {
      const trackGroups = this.getTrackGroups
      const id = this.getTrackGroups.length
      const trackGroup = {
        name: `TrackGroup - ${id + 1}`,
        id: id,
        GRAPH: {},
        TRACK: [],
        type: 'GROUP',
        color: 'EDEDED',
        level: '0.8',
        parent : true,
        solo: false,
        mute: false
      }
      if (trackGroups[id] === undefined || !trackGroups[id].TRACK) {
        this.trackGroups.push(trackGroup)
      } else {
        //
      }
    }

    @action
    deleteTrackGroup (id) {
      this.trackGroups = _.reject(this.getTrackGroups, {
        id: id
      })
      // Rearrange the active track index
      _.each(this.getActiveTrackGroups, (c, i) => {
        c.id = i
      })
    }

    @action
    changeTrackGroupName (id, newName) {
      const ch = _.find(this.getTrackGroups, {
        id: id
      })
      const chNew = _.find(this.trackGroups, {
        name: newName
      })
      if (ch !== undefined && chNew === undefined) {
        ch.name = newName
      }
    }

    // Toggle Header Fields
    @action
    toggleMute (id) {
      // check for track group mute here
      const ch = _.find(this.getTracks, {
        id: id
      })
      if (ch !== undefined) {
        ch.mute = !ch.mute
      }
    }

    @action
    toggleSolo (id) {
      const ch = _.find(this.getTracks, {
        id: id
      })
      if (ch !== undefined) {
        ch.solo = !ch.solo
        if (ch.solo) {
          this.soloEnabled = true
        } else this.soloEnabled = false
      }
    }

    @action
    addTrack (tgid, type) {
      const gt = this.getTracks
      const id = gt.length
      if (_.find(this.getTrackGroups, {
        id: tgid
      }) === undefined) {
        const blockProps = { 
          start: '00:00:31.324', 
          end: '00:01:17.721', 
          value: 'base64:__cdata=\"36.EgWXsAGakARZtMGcxUWak4Fcf.Ga0cVZtAxbzEFckABYgQWX\"' 
        }
        const tracksTemp = {
          id: this.tracks.length,
          groupOrder: id,
          tgid: tgid,
          name:`Track-${tgid}-${id+1}-${type}`,
          type: type,
          solo: false,
          mute: false,
          LAYOUT: {},
          BLOCK: [new Block(blockProps)]
        }
        const trackGroupTemp = { 
          name: `Group-${this.getTrackGroups.length + 1}`,
          id: tgid,
          GRAPH: {},
          TRACK: [],
          LAYOUT: {},
          type: 'GROUP',
          color: 'EDEDED',
          level: '0.8',
          parent : true,
          solo: false,
          mute: false
        }

        this.trackGroups.push(trackGroupTemp)
        this.trackGroups[tgid].TRACK.push(tracksTemp)
        this.tracks.push(tracksTemp)
      } else {
        const blockProps = { 
          start: '00:00:31.324', 
          end: '00:01:17.721', 
          value: 'base64:__cdata=\"36.EgWXsAGakARZtMGcxUWak4Fcf.Ga0cVZtAxbzEFckABYgQWX\"' 
        }
        const trackTemp = {
          name:`Track-${tgid}-${id+1}-${type}`,
          groupOrder: id,
          tgid: tgid,
          id: this.tracks.length,
          type: type,
          solo: false,
          mute: false,
          LAYOUT: {},
          BLOCK: [new Block(blockProps)]
        }
        this.trackGroups[tgid].TRACK.push(trackTemp)
        this.tracks.push(trackTemp)
        if (trackTemp.type === 'MIDI') GraphStore.addMIDINode(trackTemp)
        else if (trackTemp.type === 'AUDIO') GraphStore.addAudioNode(trackTemp)
      }
    }

    @action
    deleteTrack (id, tgid) {
      this.tracks = _.reject(this.getTracks, {
        id: id,
        tgid: tgid
      })
      // Rearrange the tracks
      _.each(this.getActiveTracks, (c, i) => {
        c.groupOrder = i
      })
    }

    @action
    changeTrackName (id, newName) {
      const ch = _.find(this.getTracks, {
        id: id
      })
      const chNew = _.find(this.getTracks, {
        name: newName
      })
      if (ch !== undefined && chNew === undefined) {
        ch.name = newName
      }
    }

    @action
    changeTrackType (id, type) {
      const ch = _.find(this.getTracks, {
        id: id
      })
      if (ch !== undefined) {
        ch.type = type
      }
    }

    // loader
    @action
    load (trackGroups) {
      const graphs = []
      for (let i =0 ; i < trackGroups.length; i++) {
        this.trackGroups.push(trackGroups[i])
        for (let j =0; j< trackGroups[i].TRACK.length; j++) {
          this.tracks.push(trackGroups[i].TRACK[j])
          this.tracks[j].tgid = trackGroups[i].id  // extra prop
        }
        graphs.push(trackGroups[i].GRAPH)
      }
      GraphStore.load(graphs)
    }

    syncGraph(graph, idx){
      this.trackGroups[idx].GRAPH = graph
    }
}
export default new TrackStore()