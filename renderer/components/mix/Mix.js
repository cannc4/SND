import React, { Component } from 'react'
import { Stage, Layer, Rect } from 'react-konva'
import Slider from '../common/Slider'
import Knob from '../common/Knob'
import MixHeader from './MixHeader'
import '../../styles/css/Mix.css'

class MixTrackContainer extends React.PureComponent {
  render () {
    const { x, y, width, height } = this.props

    return (
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill='red'
        stroke='black'
        strokeWidth={1}
        opacity={0.2}
      />
    )
  }
}

export default class Mix extends Component {
  constructor (props) {
    super(props)
    // TODO: Generalise the state and Konva drawing props in a new class
    this.state = {
      geometry: {
        headerWidth: 150,
        headerHeight: 100,
        width: 150,
        height: 400,
        boundingRectWidth: this.props.boundingRectWidth,
        boundingRectHeight: this.props.boundingRectHeight
      },
      styles: {},
      isSelected: false
    }
  }

  render () {
    const { mixTracks } = this.props
    const { headerWidth,
      headerHeight,
      width,
      height,
      boundingRectWidth,
      boundingRectHeight } = this.state.geometry
    if (!mixTracks) return null
    return (
      <div className='Mix'>
        <Stage
          id={'mixStage'}
          name={'mixStage'}
          ref={ref => (this.mixStage = ref)}
          width={boundingRectWidth}
          height={boundingRectHeight}>
          {
            mixTracks.map((mixTrack, i) => {
              return <Layer key={`mixTrackLayer_${i}`}>
                <MixTrackContainer
                  key={`mixTrack_${mixTrack.id}_container`}
                  x={i * width} // TODO
                  y={0}
                  width={width}
                  height={height} />
                <MixHeader
                  key={`mixTrack_${mixTrack.id}_header`}
                  x={i * width} // TODO
                  y={0} // TODO
                  height={headerHeight}
                  width={headerWidth} />
                <Knob
                  key={`mixTrack_${mixTrack.id}_Knob`}
                  x={i * width} // TODO
                  y={0} // TODO
                  indicatorWidth={4}
                  label={mixTrack.name}
                />
                <Slider key={`mixTrackSlider_${i}`}
                  key={`mixTrack_${mixTrack.id}_Slider`}
                  x={(i * width) + (width / 3)} // TODO
                  y={headerHeight} // TODO
                  // eslint-disable-next-line no-return-assign
                  setValue={value => mixTrack.volume = value}
                />
              </Layer>
            })
          }
        </Stage>
      </div>
    )
  }
}
