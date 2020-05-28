import React, { Component } from 'react'
import { Rect, Group } from 'react-konva'
import Button from '../common/Button'
import NameText from '../common/NameText'
import TrackHeader from './TrackHeader.js'

class TrackGroupHeader extends Component {
  constructor (props) {
    super(props)

    this.layout = (layoutProps) => {
      const layout = {
        x: layoutProps.x,
        y: layoutProps.y,
        width: layoutProps.width,
        height: layoutProps.height,
        trackHeight: layoutProps.trackHeight,
        fill: 'transparent',
        stroke: 'blue',
        strokeWidth: 1
      }
      return layout
    }
  }

  trackHeaderLayout (l, accY, trackIndex) {
    return {
      x: l.x,
      y: l.trackHeight + accY,
      width: l.width,
      height: l.trackHeight
    }
  }

  trackHeaders (layout, tracks) {
    let accY = layout.y
    let trackHeaders = tracks.map((track, trackIndex) => {
      let tempLayout = this.trackHeaderLayout(layout, accY, trackIndex)
      accY = tempLayout.y
      return <TrackHeader
        key={`trackId_${track.id}`}
        track={track}
        layout={tempLayout}
      />
    })
    return trackHeaders
  }

  buttonLayout (l) {
    // TODO map over multiple buttons and create layouts
    return {
      x: l.x, // number of buttons
      y: l.y, // in the middle
      width: l.width / 5,
      height: 30
    }
  }

  render () {
    const { trackGroup, tracks } = this.props
    const layout = this.layout(this.props.layout)
    const { x, y, width, height, trackHeight } = layout

    return (
      <Group ref={ref => (this.trackGroupHeaderGroup = ref)}>
        <Rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={layout.fill}
          stroke={layout.stroke}
          strokeWidth={layout.strokeWidth}
        />
        <Button
          text={'groupButton'}
          layout={this.buttonLayout(layout)}
        />
        <NameText text={trackGroup.name} x={x + 100 /* todo */} y={y} />
        {this.trackHeaders(layout, tracks)}
      </Group>
    )
  }
}

export default TrackGroupHeader
