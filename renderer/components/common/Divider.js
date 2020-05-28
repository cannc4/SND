import React, { PureComponent } from 'react'
import { Rect } from 'react-konva'

class Divider extends PureComponent {
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

export default Divider
