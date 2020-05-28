import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Group, Rect, Line, Text } from 'react-konva'
import { COLORS } from '../../styles/Colors.js'

import TransportStore from '../../stores/TransportStore'

export default class TimelinePlayhead extends Component {
  constructor (props) {
    super(props)

    this.layout = (layoutProps) => {
      const layout = layoutProps

      layout.handleYInset = 2
      layout.handleWidth = 7.5
      layout.handleHeight = 7.5
      layout.handleFill = 'rgba(255,255,255,0.5)'
      layout.handleOpacity = 1
      layout.handleStroke = '#000'
      layout.handleStrokeWidth = 1

      layout.markerStroke = '#FFF'
      layout.markerStrokeWidth = 1

      return layout
    }
  }

  getCurrentTime () {
    // return 250
    // TransportStore.getCurrentTime
    return (this.props.currentTime * 4) + 250
  }

  componentDidUpdate (prevProps, prevState) {
    // console.log('[TimelinePlayheadComponent] prevProps', prevProps, 'prevState', prevState)
  }

  createPlayheadHandle (l, currentTime) {
    const points = [
      currentTime - l.handleWidth, -(l.handleHeight * 2),
      currentTime + l.handleWidth, -(l.handleHeight * 2),
      currentTime + l.handleWidth, -l.handleHeight,
      currentTime, 0,
      currentTime - l.handleWidth, -l.handleHeight
    ]
    console.log('[TimelinePlayhead] createPlayheadHandle(): points', points)
    return <Line
      x={currentTime}
      y={l.y + l.timelineRulerHeight - l.handleYInset}
      points={points}
      stroke={l.handleStroke}
      strokeWidth={l.handleStrokeWidth}
      fill={l.handleFill}
      opacity={l.handleOpacity}
      closed
    />
  }

  createPlayheadMarker (l, currentTime) {
    return <Line
      x={currentTime}
      y={l.y + l.timelineRulerHeight - l.handleYInset}
      points={[currentTime, 0, currentTime, l.height]}
      stroke={l.markerStroke}
      strokeWidth={l.markerStrokeWidth}
    />
  }

  render () {
    const { currentTime } = this.props // <- from TransportStore
    const layout = this.layout(this.props.layout)
    console.log('[TimelinePlayhead] layout', layout)

    return (
      <Group ref={ref => (this.timelinePlayheadGroup = ref)}>
        {this.createPlayheadHandle(layout, this.getCurrentTime())}
        {this.createPlayheadMarker(layout, this.getCurrentTime())}
      </Group>
    )
  }
}
