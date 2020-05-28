import React, { Component } from 'react'
import { Rect } from 'react-konva'

// TODO: a generic header component
class MixHeader extends React.PureComponent {
  render () {
    const { x, y, width, height } = this.props

    return (
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill='white'
        stroke='black'
        strokeWidth={1}
      />
    )
  }
}

export default MixHeader
