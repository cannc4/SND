import React, { Component } from 'react'
import { Group, Line, Text } from 'react-konva'

export default class Grid extends Component {
  constructor (props) {
    super(props)

    this.layout = (layoutProps) => {
      const layout = {
        x: layoutProps.x,
        y: layoutProps.y,
        width: layoutProps.width,
        height: layoutProps.height,
        timebarHeight: layoutProps.timebarHeight,
        tick: {
          y: 5,
          stroke: 'white',
          strokeWidth: 1,
          tension: 0,
          bezier: false
        },
        text: {
          y: 60,
          fontSize: 12,
          fontFamily: 'Calibri',
          fill: 'white'
        },
        line: {
          stroke: '#777',
          strokeWidth: 1,
          tension: 0,
          bezier: false
        }
      }

      return layout
    }
  }

  createLine (xPos, line, height) {
    const gridLine = <Line
      x={xPos}
      y={60}
      points={[xPos, 0, xPos, height]}
      stroke={line.stroke}
      strokeWidth={line.strokeWidth}
      tension={line.tension}
      bezier={line.bezier}
    />

    return gridLine
  }

  gridBarLine (l, x) {
    return <Line />
  }

  render () {
    const { timeDivision, numberOfTimePoints } = this.props.time
    const layout = this.layout(this.props.layout)
    const { x, y, width, height, tick, text, line } = layout
    const gridLines = []
    for (let i = 0; i < numberOfTimePoints; i++) {
      const l = this.createLine(x + (timeDivision * i), line, height)
      gridLines.push(l)
    }

    return (
      <Group ref={ref => (this.gridGroup = ref)}>
        { gridLines }
      </Group>
    )
  }
}
