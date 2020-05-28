import React, { PureComponent } from 'react'
import { Group, Rect, Line, Text } from 'react-konva'

export default class Button extends PureComponent {
  constructor (props) {
    super(props)
    this.layout = (layoutProps) => {
      const layout = {
        x: layoutProps.x,
        y: layoutProps.y,
        width: layoutProps.width,
        height: layoutProps.height,
        name: layoutProps.name,
        fill: layoutProps.fill ? layoutProps.fill : 'transparent',
        stroke: layoutProps.stroke ? layoutProps.stroke : 'green',
        strokeWidth: layoutProps.strokeWidth ? layoutProps.strokeWidth : 1
      }

      return layout
    }
  }

  render () {
    const { text } = this.props

    const layout = this.layout(this.props.layout)

    const { x, y, width, height, fill, stroke, strokeWidth } = layout

    return (
      <Group ref={ref => (this.buttonGroup = ref)}>
        <Group ref={ref => (this.textGroup = ref)}
          x={x}
          y={y}
        >

          <Text
            text={text}
            fontSize={12}
            fontFamily={'Inconsolata'}
            fill={'green'}
            padding={5}
          />
        </Group>
        <Rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      </Group>
    )
  }
}
