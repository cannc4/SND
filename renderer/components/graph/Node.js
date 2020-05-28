import React, { PureComponent } from 'react'
import { Group } from 'react-konva'

import * as uiDebug from '../../utils/uiDebug.js'

export default class Node extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      isDragging: false,
      isSelected: false
    }
  }

  createTitleText (nodeText) {
    var titleText = new Konva.Text({
      x: 0,
      y: 0,
      text: nodeText,
      fontSize: 14,
      fontFamily: 'Calibri',
      fill: 'black',
      padding: 10,
      align: 'center'
    })
    return titleText
  }

  createOutputText (posX, posY, portName) {
    var portText = new Konva.Text({
      x: posX - posX / 2.5,
      y: posY,
      text: portName,
      fontSize: 10,
      fontFamily: 'Calibri',
      fill: 'black',
      padding: 3,
      align: 'right'
    })
    return portText
  }

  createInputText (posX, posY, portName) {
    var portText = new Konva.Text({
      x: posX,
      y: posY,
      text: portName,
      fontSize: 10,
      fontFamily: 'Calibri',
      fill: 'black',
      padding: 3,
      align: 'left'
    })
    return portText
  }

  createNode (node, totalWidth, totalHeight) {
    const createdNode = new Konva.Rect({
      x: 0,
      y: 0,
      id: node.id,
      stroke: '#333',
      fill: '#ddd',
      width: totalWidth,
      height: totalHeight,
      cornerRadius: this.props.selectedNodes.includes(node.id) ? 12 : 10,
      strokeWidth: this.props.selectedNodes.includes(node.id) ? 5 : 2,
      shadowColor: '#ddd',
      shadowBlur: 10,
      shadowOffset: { x: 5, y: 2 },
      shadowOpacity: 0.3,
      idName: 'NodeBox'
    })
    return createdNode
  }

  createTitleBar (totalWidth, titleText) {
    const titleBar = new Konva.Rect({
      x: 0,
      y: 0,
      stroke: '#333',
      strokeWidth: 3,
      fill: '#fff',
      width: totalWidth,
      height: titleText.height(),
      cornerRadius: 10
    })
    return titleBar
  }

  createConnector (x, y, textBlock, rotation, id, type) {
    var connector = new Konva.Arc({
      id: type + id,
      x: x,
      y: y,
      stroke: 'red',
      strokeWidth: 4,
      fill: 'red',
      innerRadius: textBlock.height() / 3,
      outerRadius: textBlock.height() / 2,
      angle: 180,
      rotation: rotation
    })
    return connector
  }

  componentDidMount () {
    const ctx = this
    const node = this.props.node
    let inlets = node.LAYOUT.INPUT
    let outlets = node.LAYOUT.OUTPUT

    if (inlets && inlets.length > 0 && Object.keys(inlets[0]).length > 0) {
      if (inlets[0].BUS) {
        inlets = inlets[0].BUS
        inlets = Array.isArray(inlets) ? inlets : [inlets]
      } else if (inlets[0].MIDICHAN) {
        inlets = inlets[0].MIDICHAN
        inlets = Array.isArray(inlets) ? inlets : [inlets]
      }
    } else {
      inlets = []
    }

    if (outlets && outlets.length > 0 && Object.keys(outlets[0]).length > 0) {
      if (outlets[0].BUS) {
        outlets = outlets[0].BUS
        outlets = Array.isArray(outlets) ? outlets : [outlets]
      } else if (outlets[0].MIDICHAN) {
        outlets = outlets[0].MIDICHAN
        outlets = Array.isArray(outlets) ? outlets : [outlets]
      }
    } else {
      outlets = []
    }

    let numInputs = 0
    let numOutputs = 0
    let maxWidth = 0
    let curX = node.x
    let curY = node.y
    let totalNumberOfInlets = 0
    let totalNumberOfOutlets = 0

    // create the title for plugin
    const title = (node.PLUGIN && node.PLUGIN.name) ? node.PLUGIN.name : node.name
    const titleText = ctx.createTitleText(title)
    var totalWidth = titleText.width() + 35

    // Inlet count and size update
    inlets.forEach((i, j) => {
      if (i && i !== undefined) {
        totalNumberOfInlets += j
        if (i) {
          const inputText = i.name
          var textBlock = ctx.createInputText(0, curY, inputText)
          curY += textBlock.height()
          maxWidth = Math.max(maxWidth, textBlock.width())
        }
      }
    })
    numInputs = totalNumberOfInlets
    curX = node.x
    curY = node.y

    // Outlet count and size update
    outlets.forEach((i, j) => {
      if (i && i !== undefined) {
        totalNumberOfOutlets += j
        const outletText = i.name
        var textBlock = ctx.createOutputText(totalWidth, curY, outletText)
        curY += textBlock.height()
        maxWidth = Math.max(maxWidth, textBlock.width())
      }
    })
    numOutputs = totalNumberOfOutlets

    var totalHeight = Math.min((titleText.height() * (2 + Math.max(numInputs, numOutputs))), 150)

    // Doing all that, we are able to calculate the proper width for the node
    if (numInputs > 0 && numOutputs > 0) {
      totalWidth = Math.max(totalWidth, maxWidth * 2 + 35)
    } else {
      totalWidth = Math.max(totalWidth, maxWidth + 35)
    }

    // Reposition the text so that it's properly centered.
    titleText.attrs.x += (totalWidth - titleText.width()) * 0.5

    // Main node box
    const nodeBox = ctx.createNode(node, totalWidth, totalHeight)
    const titleBar = ctx.createTitleBar(totalWidth, titleText)

    this.group.add(nodeBox)
    this.group.add(titleBar)
    this.group.add(titleText)

    curY = titleText.height()
    inlets.forEach((i, j) => {
      let inputText
      if (i) {
        inputText = i.name
        var textBlock = ctx.createInputText(0, curY, inputText)
        var connector = ctx.createConnector((-textBlock.height() / 20), curY + textBlock.height() / 2, textBlock, 90, i.id, 'inlet_' + nodeBox.attrs.id + '_')
        curY += textBlock.height()
        this.group.add(textBlock)
        this.group.add(connector)
      }
    })
    curX = node.x
    curY = titleText.height()

    outlets.forEach((i, j) => {
      if (i) {
        const outletText = i.name
        var textBlock = ctx.createOutputText(totalWidth, curY, outletText)
        const outletX = totalWidth + textBlock.height() / 20
        const outletY = curY + textBlock.height() / 2
        var connector = ctx.createConnector(outletX, outletY, textBlock, -90, i.id, 'outlet_' + nodeBox.attrs.id + '_')
        curY += textBlock.height()
        this.group.add(textBlock)
        this.group.add(connector)
      }
    })

    this.group.attrs.id = node.id
    this.group.attrs.x = node.x
    this.group.attrs.y = node.y
    this.group.attrs.width = nodeBox.width() + 1
    this.group.attrs.height = nodeBox.height() + 1

    // // DEBUG
    // const debugColor = "#222"
    // const nodeTip = uiDebug.tip(node.id, [node.x, node.y], debugColor)
    // this.nodeLayer.add(nodeTip)

    // const originRect = new Konva.Rect({
    //   x: 0,
    //   y: 0,
    //   width: 100,
    //   height: 100,
    //   // fill: 'red',
    //   stroke: "#F5F",
    //   strokeWidth: 1
    // });
    // originRect.dash([10, 5]);
    // this.nodeLayer.add(originRect)
  }

  render () {
    return (
      <Group ref={ref => (this.group = ref)}
        draggable
      />
    )
  }
}
