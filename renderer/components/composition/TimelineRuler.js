import React, { Component } from 'react'
import { Group, Rect, Line, Text } from 'react-konva'

export default class TimelineRuler extends Component {
  constructor (props) {
    super(props)

    this.layout = (layoutProps) => {
      const layout = layoutProps

      layout.borderStroke = 'red'
      layout.borderStrokeWidth = 0.5
      layout.borderFill = 'transparent'
      layout.borderShadowBlur = 1

      layout.barTickYInset = 10
      layout.barTickStroke = '#CCC'
      layout.barTickStrokeWidth = 1.0

      layout.barTickLabelXInset = 10
      layout.barTickLabelYInset = 8
      layout.barTickLabelFontSize = 12
      layout.barTickLabelFontFamily = 'Calibri'
      layout.barTickLabelFill = 'white'

      return layout
    }
  }

  createRulerBorder (l) {
    return <Rect
      x={l.x}
      y={l.y}
      width={l.width}
      height={l.height}
      stroke={l.borderStroke}
      strokeWidth={l.borderStrokeWidth}
      fill={l.borderFill}
      shadowBlur={l.borderShadowBlur}
    />
  }

  createRuler (l, timeDivision, numberOfTimePoints) {
    const rulerBars = []
    for (var i = 0; i < numberOfTimePoints; i++) {
      const rb = this.createBar(l, l.x + (timeDivision * i), i)
      rulerBars.push(rb)
    }
    return rulerBars
  }

  createBar (l, x, i) {
    return <Group ref={ref => (this.timelineRulerBarGroup = ref)}>
      {this.barTick(l, x)}
      {this.barTickLabel(l, x, i)}
      {/* this.beatTick(l, x) */}
      {/* this.noteTick(l, x) */}
    </Group>
  }

  barTick (l, x) {
    return <Line
      key={'barTick_' + x.toString()}
      x={x}
      y={l.y + l.barTickYInset}
      points={[x, 0, x, l.height - l.barTickYInset]}
      stroke={l.barTickStroke}
      strokeWidth={l.barTickStrokeWidth}
    />
  }

  barTickLabel (l, x, i) {
    return <Text
      key={'barTickLabel_' + x.toString()}
      x={((x * 2) - 3) + l.barTickLabelXInset /* TODO: ??? */}
      y={l.y + l.barTickLabelYInset}
      text={i.toString()}
      fontSize={l.barTickLabelFontSize}
      fontFamily={l.barTickLabelFontFamily}
      fill={l.barTickLabelFill}
    />
  }

  beatTick (l, x) {
    return undefined
  }

  noteTick (l, x) {
    return undefined
  }

  render () {
    const { timeDivision, numberOfTimePoints } = this.props.time
    const layout = this.layout(this.props.layout)

    return (
      <Group ref={ref => (this.timelineRulerGroup = ref)}>
        {this.createRulerBorder(layout)}
        {this.createRuler(layout, timeDivision, numberOfTimePoints)}
      </Group>
    )
  }
}
