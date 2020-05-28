import React, { Component } from 'react'
import _ from 'lodash'
import { Stage, Layer } from 'react-konva'
import { inject, observer } from 'mobx-react'

import Node from './Node'
import Connection from './Connection'

@inject('GraphStore')
@observer
export default class Graph extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isSelected: false,
      isRendering: false,
      curveList: [],
      selectedCurve: [],
      selectedConnections: [],
    }
  }

  setSelected (flag) {
    this.setState({ isSelected: flag })
  }

  mouseLeave () {
    this.isMouseOver = false
    this.setSelected(false)
  }

  mouseOver () {
    this.isMouseOver = true
    this.setSelected(true)
  }

  addConnectorToList (srcNode, srcPort, dstNode, dstPort) {
    // Curve list from `connection` prop
    const curveList = this.state.curveList
    const tempList = curveList
    // Get the coordinates of the `outlet` from the source node
    const srcNodeKonvaGroup = srcNode.children
    const outlet = _.filter(srcNodeKonvaGroup, function (n) { return n.attrs.id === 'outlet_' + srcNode.attrs.id + '_' + srcPort })[0]
    // Get the coordinates of the `inlet` from the target node
    const dstNodeKonvaGroup = dstNode.children
    const inlet = _.filter(dstNodeKonvaGroup, function (n) { return n.attrs.id === 'inlet_' + dstNode.attrs.id + '_' + dstPort })[0]

    if (!outlet || !inlet) return

    const id = `con-${outlet.attrs.id}-${inlet.attrs.id}`
    const newCurve = {
      id: id,
      src: srcNode,
      srcPort: srcPort,
      srcX: outlet.attrs.x,
      srcY: outlet.attrs.y,
      dst: dstNode,
      dstPort: dstPort,
      destX: inlet.attrs.x,
      destY: inlet.attrs.y,
      srcNode: srcNode,
      dstNode: dstNode
    }

    // Because deleting can happen at random spots, we can
    // end up with some *undefined*s in the list.  Let's
    // refill those to keep the array from getting too sparse
    // before we try adding on.
    const gapIdx = _.findIndex(tempList, function (c) { if (c && c.id) return c.id === id })
    if (gapIdx < 0) {
      tempList.push(newCurve)
    } else {
      tempList[gapIdx] = newCurve
    }

    // Update the curve list to be re-render the graph
    this.setState({ curveList: tempList })
  }

  deleteConnectorFromList (srcNode, srcPort, dstNode, dstPort) {
    const tempList = this.state.curveList
    // Find a matching curve in the tempList and remove it
    for (let i = 0; i < tempList.length; i++) {
      if (tempList[i]) {
        if ((tempList[i].src === srcNode) &&
        (tempList[i].dst === dstNode) &&
        (tempList[i].srcPort === srcPort) &&
        (tempList[i].dstPort === dstPort)) {
          delete tempList[i]
        }
      }
    }
    // Update the curve list to be re-render the graph
    this.setState({ curveList: tempList })
  }

  updateConnectionList (target) {
    const ctx = this

    // Get the Graph Konva object reference
    const graphElem = this.graphElem
    if (!this.graphElem) return

    // Render the targeted node connections
    if (target) {
      const curveList = this.state.curveList
      const targetId = target.attrs.id

      // Detect the affected curves
      const changedCurves = _.filter(curveList, function (c) {
        if (c && c.id) {
          if (c.srcNode.attrs.id === targetId || c.dstNode.attrs.id === targetId) {
            return c
          }
        }
      })
      ctx.setState({ curveList: [] })
      for (let i = 0; i < changedCurves.length; i++) {
        ctx.addConnectorToList(changedCurves[i].srcNode, changedCurves[i].srcPort, changedCurves[i].dstNode, changedCurves[i].dstPort)
      }
    } else {
      // Render all connections
      const connections = this.props.graph.CONNECTIONS
      const nodes = graphElem.getChildren()[0].children
      // Iterate connections and add connections to the list
      _.forEach(connections, function (connector) {
        const srcNode = _.filter(nodes, function (n) { return parseInt(n.attrs.id) === parseInt(connector.srcNode) })[0]
        const srcPort = connector.srcPort
        const dstNode = _.filter(nodes, function (n) { return parseInt(n.attrs.id) === parseInt(connector.dstNode) })[0]
        const dstPort = connector.dstPort
        // Draw the wired up connections
        if (srcNode && dstNode) {
          ctx.deleteConnectorFromList(srcNode, srcPort, dstNode, dstPort)
          ctx.addConnectorToList(srcNode, srcPort, dstNode, dstPort)
        }
      })
    }
  }

  addCurve (attrs) {
    if (this.state.selectedCurve.length < 2) {
      if(this.state.selectedCurve[0] && attrs.id === this.state.selectedCurve[0].id){
        this.state.selectedCurve.pop()
        this.deselect(attrs)
      } else {
        this.state.selectedCurve.push(attrs)
        this.select(attrs)
      }
      this.setState({ selectedCurve: this.state.selectedCurve })
      if (this.state.selectedCurve.length === 2) {
        const srcProps = this.state.selectedCurve[0]
        const dstProps = this.state.selectedCurve[1]
        if (srcProps && dstProps) {
          const srcId = srcProps.id.split('_')
          const dstId = dstProps.id.split('_')
          if (srcId[0] === dstId[0] || srcId[1] === dstId[1]) return
          else {
            const srcNodeId = srcId[1]
            const srcPort = srcId[2]
            const dstNodeId = dstId[1]
            const dstPort = dstId[2]
            const connector = { dstPort: dstPort, srcPort: srcPort, dstNode: dstNodeId, srcNode: srcNodeId }
            this.props.GraphStore.graphs[this.props.GraphStore.activeGraphIndex].CONNECTIONS.push(connector)
            this.updateConnectionList()
            this.clearSelectedConnections()
          }
        }
      }
    } else {
      this.setState({ selectedCurve: [] })
    }
  }

  clearSelectedConnections(){
    var connectors = this.graphLayer.find('Arc')
    connectors.forEach(con => {
      this.deselect(con.attrs)
    })
    this.setState({ selectedCurve: [] })
  }

  clearSelectedNodes(){
    var nodes = this.graphLayer.find('Rect')
    nodes.forEach(n => {
      n.attrs.stroke = 'black'
    })
  }

  select(attrs){
    attrs.stroke = 'yellow'
  }

  deselect(attrs){
    attrs.stroke = 'red'
  }

  componentDidUpdate (prevProps, prevState) {
    // console.log(`Graph did update ${this.props}`)
    // Render conditions
    if ((this.props.graph.CONNECTIONS.length !== 0 && this.state.curveList.length === 0) || this.state.curveList !== prevState.curveList) {
      this.updateConnectionList()
    }
  }

  componentDidMount () {
    this.updateConnectionList()
  }

  render () {
    const {
      boundingRectWidth,
      boundingRectHeight,
      selectedNodes, selectedConnections, graph } = this.props

    const curveList = this.state.curveList
    const nodes = graph.NODES
  
    const scaleBy = 1.05

    return (
      <Stage
        id={'graphStage'}
        name={'graphStage'}
        ref={ref => (this.graphElem = ref)}
        width={boundingRectWidth}
        height={boundingRectHeight}
        draggable
        onMouseDown={e => {
          e.evt.preventDefault()
          // Clear the selected nodes & connectors when clicked to the stage
          if (e.target.getClassName() === 'Stage' ){
            this.clearSelectedNodes()
            this.clearSelectedConnections()
          }
        }}
        onWheel={e => {
          const stage = e.target.getStage()
          if (stage) {
            e.evt.preventDefault()
            const oldScale = stage.scaleX()
            const mousePointTo = {
              x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
              y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
            }
            const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy
            stage.scale({ x: newScale, y: newScale })
            const newPos = {
              x:
                  -(mousePointTo.x - stage.getPointerPosition().x / newScale) *
                  newScale,
              y:
                  -(mousePointTo.y - stage.getPointerPosition().y / newScale) *
                  newScale
            }
            stage.position(newPos)
            stage.batchDraw()
          }
        }}>
        <Layer
          id={'graphLayer'}
          ref={ref => (this.graphLayer = ref)}
          name={'graphLayer'}
          onMouseMove={e => {
            e.evt.preventDefault()
            const shapeClass = e.target.getClassName()
            if (shapeClass === 'Arc'){
              // e.target.attrs.stroke = 'green'
              // this.addCurve(e.target.attrs)
              // this.updateConnectionList()
            } else if (shapeClass === 'Line') {
              // e.target.attrs.stroke = 'red'

            } else if (shapeClass === 'Rect' && e.target.attrs.id) {
              // this.props.GraphStore.selectNode(e.target.attrs.id)
              this.updateConnectionList()
            }
          }}
          onMouseOver={e => {
            e.evt.preventDefault()
            // if (e.target.getClassName() === 'Arc'){
            //   this.select(e.target.attrs)
            // } else if (e.target.getClassName() === 'Line') {
            //   this.select(e.target.attrs)
            // } else if (e.target.getClassName() === 'Rect' && e.target.attrs.id) {
            //   this.select(e.target.attrs)
            // }
          }}
          onMouseOut={e => {
            e.evt.preventDefault()
            // if (e.target.getClassName() === 'Arc'){
            //   this.deselect(e.target.attrs)
            // } else if (e.target.getClassName() === 'Line') {
            //   this.deselect(e.target.attrs)

            // } else if (e.target.getClassName() === 'Rect') {
            //   this.deselect(e.target.attrs)
            // }
            
          }}
          onMouseDown={e => {
            e.evt.preventDefault()
            if (e.target.getClassName() === 'Arc'){
              this.addCurve(e.target.attrs)              
            } else if (e.target.getClassName() === 'Line') {
              //..
            } else if (e.target.parent.getClassName() === 'Group' && e.target.getClassName() === 'Rect' && e.target.attrs.id) {
              // need to interpolate between text and node containers
              this.updateConnectionList()
            }
            else if (e.target.getClassName() === 'Stage' ){
              this.clearSelectedNodes()
            }
          }}
          onMouseUp={e => {
          // ..
          }}
          onDragStart={e => {
            this.setState({
              isDragging: true
            })
          }}
          onDragEnd={e => {
            this.setState({
              isDragging: false
            })
            const nodeProps = { x: e.target.attrs.x, y: e.target.attrs.y }
            this.props.GraphStore.updateNode(e.target.attrs.id, nodeProps)
            this.updateConnectionList()
          }}
          onDragMove={e => {
            this.updateConnectionList(e.target)
          }}
        
          dragBoundFunc={pos => {
            return pos
          }}
        >
          {nodes &&
            nodes.map(node => {
              return <Node
                node={node}
                key={'node_' + node.id}
                selectedNodes={selectedNodes}
              />
            })
          }
          {
            curveList.map(con => {
              return <Connection
                connection={con}
                key={con.id}
                selectedConnections={selectedConnections}
              />
            })
          }
        </Layer>
      </Stage>
    )
  }
}
