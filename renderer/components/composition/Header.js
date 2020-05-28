import React, { Component } from 'react'
import _ from 'lodash'
import { Rect, Group } from 'react-konva'
import { toJS } from 'mobx'
import { Stage, Layer } from 'react-konva'
import { COLORS } from '../../styles/Colors.js'

import TrackGroupHeader from './TrackGroupHeader'

export default class Header extends Component {
  constructor (props) {
    super(props)

    this.layout = (layoutProps) => {
      const layout = {
        x: layoutProps.x,
        y: layoutProps.y,
        width: layoutProps.width,
        height: layoutProps.height,
        trackHeight: layoutProps.trackHeight,
        background: COLORS.common.background
      }

      return layout
  	}
  }

  componentDidUpdate (prevProps, prevState) {
    // console.log('[HeaderComponent] prevProps', prevProps, 'prevState', prevState)
  }

  trackGroupHeaderLayout (l, accY, totalTracksInTrackGroup) {
    return {
      x: l.x,
      y: l.y + accY,
      width: l.width,
      height: l.trackHeight * (totalTracksInTrackGroup + 1),
      trackHeight: l.trackHeight
    }
  }

  trackGroupHeaders (layout, trackGroups, tracks) {
    let accY = 0
    return trackGroups.map(trackGroup => {
      const tracksInTrackGroup = tracks.filter(t => t.tgid === trackGroup.id)
      let trackGroupHeaderLayout = this.trackGroupHeaderLayout(layout, accY, tracksInTrackGroup.length)
      accY += trackGroupHeaderLayout.height
      return <TrackGroupHeader
        key={`trackGroup_${trackGroup.id}`}
        trackGroup={trackGroup}
        tracks={tracksInTrackGroup}
        layout={trackGroupHeaderLayout}
      />
    })
  }

  render () {
    const { trackGroups, tracks } = this.props
    const layout = this.layout(this.props.layout)
    const { x, y, width, height } = layout

    return (
      <Group ref={ref => (this.headerGroup = ref)} draggable={false}>
        <Rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill='transparent'
          stroke='red'
          strokeWidth={5}
        />
        {this.trackGroupHeaders(layout, trackGroups, tracks)}
      </Group>
    )
  }
}
