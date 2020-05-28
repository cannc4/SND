import React, { PureComponent } from 'react'
import { Rect, Group } from 'react-konva'
import { toJS } from 'mobx'

// import { convertToMs } from '../../utils/timeUtils'

export default class Region extends PureComponent {
  constructor (props) {
    super(props)

    this.layout = (layoutProps) => {
      const layout = {
        x: layoutProps.x,
        y: layoutProps.y,
        width: layoutProps.width,
        height: layoutProps.height,
        stroke: 'blue',
        shadowBlur: 1
      }

      return layout
    }
  }

  render () {
    const { region } = this.props
    const layout = this.layout(this.props.layout)
    const { x, y, width, height, stroke, shadowBlur } = layout

    return (
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke={stroke}
        shadowBlur={shadowBlur}
      />
    )
  }
}
