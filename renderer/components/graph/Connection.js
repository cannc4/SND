import React, { Component } from 'react'
import { Group, Line } from 'react-konva'

import * as uiDebug from '../../utils/uiDebug.js'

export default class Connection extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      isSelected: false
    }
  }

  render () {
    const connection = this.props.connection
    // const isSelected = this.props.connection.isSelected
    const srcNode = connection.srcNode
    const dstNode = connection.dst

    const x0 = srcNode.attrs.x + connection.srcX
    const y0 = srcNode.attrs.y + connection.srcY
    const x1 = dstNode.attrs.x + connection.destX
    const y1 = dstNode.attrs.y + connection.destY
    const Xofs = Math.abs(x1 - x0) * 0.75

    const points = [x0, y0, x0 + Xofs, y0, x1 - Xofs, y1, x1, y1]

    return (
      <Line
        x={0}
        y={0}
        points={points}
        stroke={'blue'}
        strokeWidth={4}
        tension={0}
        bezier
      />
    )
  }
}
