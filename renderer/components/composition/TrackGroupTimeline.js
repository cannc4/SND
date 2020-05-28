import React, { Component } from 'react'
import _ from 'lodash'
import { inject, observer } from 'mobx-react'
import { Group } from 'react-konva'
import { COLORS } from '../../styles/Colors.js'

import TrackTimeline from './TrackTimeline'

export default class TrackGroupTimeline extends Component {
  constructor (props) {
    super(props)

    this.layout = (layoutProps) => {
      const layout = {
        x: layoutProps.x,
        y: layoutProps.y,
        width: layoutProps.width,
        height: layoutProps.height,
        trackHeight: layoutProps.trackHeight
      }

      return layout
    }
  }

  componentDidUpdate (prevProps, prevState) {
    console.log('[TrackGroupComponent] prevProps', prevProps, 'prevState', prevState)
  }

  trackLayout (l, index) {
    return {
      x: l.x,
      y: l.y + l.trackHeight * index,
      width: l.width,
      height: l.trackHeight
      // headerWidth: trackHeader.width,
      // height: trackHeader.height
    }
  }

  trackTimelines (layout, trackGroup, tracks, time) {
    return tracks.map((track, index) => {
      return <TrackTimeline
        tgid={trackGroup.id}
        key={`track_${track.id}`}
        track={track}
        time={time}
        layout={this.trackLayout(layout, index)}
      />
    })
  }

  render () {
    const { trackGroup, tracks, time } = this.props
    const layout = this.layout(this.props.layout)

    return (
      <Group ref={ref => (this.trackGroupTimelineGroup = ref)} draggable={false}>
        {/* TODO: TrackGroupHeaderTimeline */}
        {this.trackTimelines(layout, trackGroup, tracks, time)}
      </Group>
    )
  }
}
