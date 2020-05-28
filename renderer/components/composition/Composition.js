import React, { Component } from 'react'
import _ from 'lodash'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import { Stage, Layer } from 'react-konva'
import { COLORS } from '../../styles/Colors.js'

import Header from './Header'
import Timeline from './Timeline'

@inject('TrackStore', 'CompositionStore', 'TransportStore')
@observer
export default class Composition extends Component {
  constructor (props) {
    super(props)

    this.layout = (layoutProps) => {
      const layout = layoutProps
      layout.background = COLORS.common.background
      return layout
    }

  }

  componentDidUpdate (prevProps, prevState) {
    // console.log('[CompositionComponent] prevProps', prevProps, 'prevState', prevState)
  }

  updateTimeDivision (t) {
    CompositionStore.updateTimeDivision(t)
  }

  headerLayout (l, totalTrackGroupsInProject, totalTracksInProject) {
    return {
      x:           l.x,
      y:           l.y + l.timelineRulerHeight,
      width:       l.headerWidth,
      height:      l.trackHeight * (totalTrackGroupsInProject + totalTracksInProject),
      trackHeight: l.trackHeight
    }
  }

  timelineLayout (l) {
    return {
      x:             l.x + l.headerWidth,
      y:             l.y,
      width:         l.width - l.headerWidth,
      height:        l.height - l.timelineRulerHeight,
      trackHeight:   l.trackHeight,
      timelineRulerHeight: l.timelineRulerHeight
    }
  }

  render () {
    const { trackGroups, tracks, time, transport } = this.props
    const layout = this.layout(this.props.layout)
    const { width, height } = layout

    return (
      <Stage
        id={'compositionStage'}
        ref={ref => (this.compositionStage = ref)}
        width={width}
        height={height}
      >
        <Layer id={'headerLayer'} ref={ref => (this.headerLayer = ref)}>
          <Header 
            trackGroups={trackGroups}
            tracks={tracks}
            layout={this.headerLayout(layout, trackGroups.length, tracks.length)}
          />
        </Layer>

        <Layer id={'timelineLayer'} ref={ref => (this.timelineLayer = ref)}>
          <Timeline 
            trackGroups={trackGroups} 
            tracks={tracks} 
            time={time} 
            transport={transport}
            layout={this.timelineLayout(layout)}
          />
        </Layer>

      </Stage>
    )

  }
}
