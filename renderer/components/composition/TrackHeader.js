import React, { PureComponent } from 'react'
import { Rect, Group } from 'react-konva'
import Button from '../common/Button'
import NameText from '../common/NameText'

class TrackHeader extends PureComponent {
  constructor (props) {
    super(props)

    this.layout = (layoutProps) => {
      const layout = {
        x: layoutProps.x,
        y: layoutProps.y,
        width: layoutProps.width,
        height: layoutProps.height,
        fill: 'transparent',
        stroke: 'green',
        strokeWidth: 0.5
      }

      return layout
    }
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
    const track = this.props.track
    const layout = this.layout(this.props.layout)
    const { x, y, width, height } = layout

    return (
      <Group ref={ref => (this.trackHeaderGroup = ref)}>
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
          text={'trackButton'}
          layout={this.buttonLayout(layout)}
        />
        <NameText text={track.name} x={x + 100 /* todo */} y={y} />
      </Group>
    )
  }
}

export default TrackHeader
