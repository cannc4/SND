import React, { PureComponent } from 'react'
import { Rect, Group } from 'react-konva'
import { convertToMs } from '../../utils/timeUtils'

import TimelineRegion from './TimelineRegion.js'
import TrackStore from '../../stores/TrackStore'

export default class Timeline extends PureComponent {
  constructor (props) {
    super(props)

    this.layout = (layoutProps) => {
      const layout = {
        x: layoutProps.x,
        y: layoutProps.y,
        width: layoutProps.width,
        height: layoutProps.height,
        stroke: 'green',
        shadowBlur: 1
      }

      return layout
    }
  }

  trackBorder (l, track, timePoints) {
    return <Rect
      key={'timeline_' + track.tgid + '_' + track.id}
      x={l.x}
      y={l.y + l.height}
      width={l.width * timePoints} // TODO
      height={l.height}
      stroke={l.stroke}
      shadowBlur={l.shadowBlur}
    />
  }

  regionLayout (l, region, index) {
    console.log(region)
    return {
      x: l.x,
      y: l.y + l.height,
      width: convertToMs(region.end) - convertToMs(region.start),
      height: l.height
    }
  }

  trackRegions (layout, track) {
    return track.BLOCK.map((region, index) => {
      return <TimelineRegion
        key={`block_${track.tgid}_${track.id}_${index}`}
        region={region}
        layout={this.regionLayout(layout, region, index)}
      />
    })
  }

  render () {
    const { track, time } = this.props
    const layout = this.layout(this.props.layout)
    const { x, y, width, height } = layout

    return (
      <Group ref={ref => (this.trackTimelineGroup = ref)} draggable={false}>
        {this.trackBorder(layout, track, time.numberOfTimePoints)}
        <Group ref={ref => (this.trackRegionsGroup = ref)}
          draggable
          dragBoundFunc={pos => { return { x: pos.x > 0 ? pos.x : 0, y: 0 } }}
          onDragEnd={e => {
            TrackStore.updateRegionPosition(track.id, e.target.attrs)
            console.log('[BLOCK] onDragEnd', e.target.attrs) // todo convert X pos to time
          }}>
          {this.trackRegions(layout, track)}
        </Group>
      </Group>
    )
  }
}
