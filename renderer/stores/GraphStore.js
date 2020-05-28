import {
  observable,
  action,
  computed
} from 'mobx'
import {deepObserve } from 'mobx-utils'
import _ from 'lodash'
import TrackStore from './TrackStore'

class GraphStore {

    commandStack = []

    @observable width = 800

    @observable height = 800

    @observable selected = {}

    @observable activeGraphIndex = 0

    @observable selectedNodes = []

    @observable selectedConnections = []

    @observable graphs = [{
      id: 0,
      NODES: [],
      CONNECTIONS: []
    }]

    @observable scale = 1

    constructor () {
      deepObserve(this.graphs, (g) => {
        this.commandStack.push(g)
      })
    }
    
    @computed get
    graphScale () {
      return this.scale
    }

    @computed get
    nodes () {
      return this.graph.NODES
    }

    @computed get
    connections () {
      return this.graph.CONNECTIONS
    }

    @computed get
    curveList () {
      return this.graph.curveList
    }

    @computed
    get componentWidth () {
      return this.width
    }

    @computed
    get componentHeight () {
      return this.height
    }

    @computed get
    graph () {
      return this.graphs[this.activeGraphIndex]
    }

    @computed get
    getSelectedNodes () {
      return this.selectedNodes
    }

    @action undo(){
      console.log(this.commandStack)
    }

    @action
    resizeComponent (clientHeight, clientWidth) {
      this.width = clientWidth
      this.height = clientHeight
    }

    @action
    updateActiveGraphIndex (index) {
      this.activeGraphIndex = index
    }

    @action
    updateGraphScale (scale) {
      this.scale = scale
    }

    @action
    updateCurveList (curveList) {
      this.graph.curveList = curveList
    }

    @action
    updateConnectionList (cl) {
      this.graph.CONNECTIONS = cl
    }

    @action
    selectNode (id) {
      if (this.selectedNodes.includes(id)) { this.selectedNodes.pop(id) } else { this.selectedNodes.push(id) }
    }

    @action 
    addPluginNode () {
      const idx = this.graph.NODES.length
      const pluginNode = {
        id: idx,
        name: 'TestPlugin',
        x: 20,
        y: 0,
        type: 'PLUGIN',
        LAYOUT: {}, // TODO
        PLUGIN: {},
        STATE: { value: 'base64:__cdata=\"31.S8VakARY3EVavwVYfLWXsAGakIGHyQWXzUFHjEFcgA\"' }
      }
      this.graphs[this.activeGraphIndex].NODES.push(pluginNode)
    }

    @action 
    addAudioNode (track) {
      const idx = this.graph.NODES.length
      const audioNode = {
        id: idx,
        trackid: track.id,
        name: track.name,
        type: 'AUDIO',
        x: 20,
        y: 0,
        LAYOUT: {
          INPUT: [],
          OUTPUT: [
            {
              BUS: {
                name: 'AudioOut0/1',
                id: 0,
                layout: 'stereo'
              }
            }
          ]
        },
        STATE: { value: 'base64:__cdata=\"31.S8VakARY3EVavwVYfLWXsAGakIGHyQWXzUFHjEFcgA\"' }
      }
      this.graphs[this.activeGraphIndex].NODES.push(audioNode)
    }

    @action 
    addMIDINode (track) {
      const idx = this.graph.NODES.length
      const MIDINode = {
        id: idx,
        trackid: track.id,
        name: track.name,
        x: 20,
        y: 0,
        type: 'MIDI',
        LAYOUT: {
          INPUT: [],
          OUTPUT: [
            {
              MIDICHAN: {
                name: 'MIDIOut',
                id: 0,
                layout: 'stereo'
              }
            }
          ]
        },
        STATE: { value: 'base64:__cdata=\"31.S8VakARY3EVavwVYfLWXsAGakIGHyQWXzUFHjEFcgA\"' }

      }
      this.graphs[this.activeGraphIndex].NODES.push(MIDINode)
      TrackStore.syncGraph(this.graphs[this.activeGraphIndex], this.activeGraphIndex)
    }

    @action 
    addMixNode (mix) {
      const idx = this.graph.NODES.length
      const mixNode = {
        id: idx,
        mixbusid: mix.id,
        name: mix.name,
        x: 20,
        y: 20,
        type: 'MIX',
        LAYOUT: {
          INPUT: [
            {
              BUS: {
                id: 0,
                name: 'AudioIn',
                layout: 'stereo'
              }
            }
          ],
          OUTPUT: []
        },
        STATE: { value: 'base64:__cdata=\"31.S8VakARY3EVavwVYfLWXsAGakIGHyQWXzUFHjEFcgA\"' }

      }
      this.graphs[this.activeGraphIndex].NODES.push(mixNode)
      TrackStore.syncGraph(this.graphs[this.activeGraphIndex], this.activeGraphIndex)
    }

    updateNode (id, props) {
      const nodeIndex = this.graph.NODES.findIndex(n => n.id === id)
      const node = this.graph.NODES[nodeIndex]
      for (let i = 0; i < Object.keys(props).length; i++) {
        const key = Object.keys(props)[i]
        const value = Object.values(props)[i]
        node[key] = value
      }
      this.graphs[this.activeGraphIndex].NODES[nodeIndex] = node
      TrackStore.syncGraph(this.graphs[this.activeGraphIndex], this.activeGraphIndex)
    }

    findNode (id) {
      return this.NODES.filter(n => {
        if (n && n.id && n.id === id) { return n }
      })[0]
    }

    findOutlet (node, chan) {
      if (node && node.layout) {
        return node.layout.outputs.filter(out => {
          return Object.keys(out).filter(key => {
            if ((out[key]._id).toString() === chan.toString()) {
              return out[key]._id
            }
          })
        })
      }
    }

    findInlet (node, chan) {
      return node.layout.inputs.filter(input => {
        return Object.keys(input).filter(key => {
          if ((input[key]._id).toString() === chan.toString()) {
            return input[key]._id
          }
        })
      })
    }

    @action
    findConnection (id) {
      return this.CONNECTIONS[id]
    }

    @action
    deselectNodes () {
      this.selectedNodes = []
    }

    @action
    load (graphs) {
      this.graphs = graphs
      this.updateConnectionList(this.graphs[0].CONNECTIONS)
    }
    

}
export default  new GraphStore()
