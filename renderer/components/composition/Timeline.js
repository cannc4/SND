import React, { Component } from 'react'
import _ from 'lodash'
import { inject, observer } from 'mobx-react'
import { Group } from 'react-konva'
import { COLORS } from '../../styles/Colors.js'

import TimelineRuler from './TimelineRuler.js'
import TimelineGrid from './TimelineGrid'
import TrackGroupTimeline from './TrackGroupTimeline'
import TimelinePlayhead from './TimelinePlayhead'

export default class Timeline extends Component {
  constructor (props) {
    super(props)

    this.layout = (layoutProps) => {
      const layout = layoutProps
      return layout
    }
  }

  componentDidUpdate (prevProps, prevState) {
    // console.log('[TimelineComponent] prevProps', prevProps, 'prevState', prevState)
  }

  timelineRulerLayout (l, timePoints) {
    return {
      x: l.x,
      y: l.y,
      width: l.width * timePoints,
      height: l.timelineRulerHeight
    }
  }

  timelineGridLayout (l) {
    return {
      x: l.x,
      y: l.y,
      width: l.width,
      height: l.height,
      trackHeight: l.trackHeight,
      timelineRulerHeight: l.timelineRulerHeight
    }
  }

  trackGroupTimelineLayout (l, index) {
    return {
      x: l.x,
      y: l.y + l.timelineRulerHeight,
      width: l.width,
      height: l.height,
      trackHeight: l.trackHeight
    }
  }

  trackGroupTimelines (layout, trackGroups, tracks, time) {
    return trackGroups.map((trackGroup, index) => {
      return <TrackGroupTimeline
        trackGroup={trackGroup}
        tracks={tracks.filter(t => t.tgid === trackGroup.id)}
        time={time}
        layout={this.trackGroupTimelineLayout(layout, index)}
      />
    })
  }

  timelinePlayheadLayout (l) {
    return {
      x: l.x,
      y: l.y,
      width: l.width,
      height: l.height,
      timelineRulerHeight: l.timelineRulerHeight
    }
  }

  render () {
    const { trackGroups, tracks, time, transport } = this.props
    const { timeDivision, numberOfTimePoints } = time
    const layout = this.layout(this.props.layout)

    return (
      <Group ref={ref => (this.timelineGroup = ref)} draggable={false} >
        <Group ref={ref => (this.timelineGridGroup = ref)} draggable={false} >
          <TimelineRuler time={time} layout={this.timelineRulerLayout(layout, numberOfTimePoints)} />
          <TimelineGrid time={time} layout={this.timelineGridLayout(layout)} />
          { this.trackGroupTimelines(layout, trackGroups, tracks, time) }
        </Group>
        <Group ref={ref => (this.timelinePlayheadGroup = ref)} draggable
          dragBoundFunc={pos => { return { x: pos.x > 0 ? pos.x : 0, y: 0 } }}
          onDragEnd={e => {
            console.log('[Playhead] onDragEnd', e.target.attrs) // todo convert X pos to time
          }}
        >
          <TimelinePlayhead currentTime={transport} layout={this.timelinePlayheadLayout(layout)} />
        </Group>
      </Group>
    )
  }
}
