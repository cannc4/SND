import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Rect, RegularPolygon, Line, Group } from 'react-konva'

export default class Slider extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      value: 0
    }

    this.isMouseOver = false
    this.setValue = this.setValue.bind(this)
    this.lockMouse = this.lockMouse.bind(this)
    this.mouseOver = this.mouseOver.bind(this)
    this.mouseLeave = this.mouseLeave.bind(this)
    this.releaseMouse = this.releaseMouse.bind(this)
  }

  setValue (pos) {
    if (this.isMouseOver) {
      this.setState({ value: pos.offsetY - 101 })
    }
  }

  lockMouse (event) {
    this.setState({ value: event.evt.offsetY })
    document.addEventListener('mousemove', this.setValue)
    document.addEventListener('mouseup', this.releaseMouse)
  }

  releaseMouse () {
    document.removeEventListener('mousemove', this.setValue)
    document.removeEventListener('mouseup', this.releaseMouse)

    return this.props.setValue && this.props.setValue(this.state.value)
  }

  mouseLeave () {
    this.isMouseOver = false
  }

  mouseOver () {
    this.isMouseOver = true
  }

  render () {
    const { boundingRectWidth,
      boundingRectHeight,
      strokeColor,
      strokeWidth,
      indicatorWidth,
      backgroundColor,
      x, y,
      fontSize,
      gapSize,
      indicatorSize } = this.props

    return (
      <Group ref={ref => (this.SliderGroup = ref)}
        draggable={false}
        x={x}
        y={y}
        onMouseDown={this.lockMouse}
        onMouseLeave={this.mouseLeave}
        onMouseOver={this.mouseOver}
      >
        <Rect
          width={boundingRectWidth / 4}
          height={boundingRectHeight}
          fill={backgroundColor} />
        <Rect
          x={boundingRectWidth / 4 + gapSize}
          width={boundingRectWidth / 4}
          height={boundingRectHeight}
          fill={backgroundColor} />
        <Line
          points={[0, boundingRectHeight / 10, boundingRectWidth / 2 + gapSize, boundingRectHeight / 10]}
          stroke='grey'
          strokeWidth={gapSize} />
        <RegularPolygon
          rotation={30}
          x={boundingRectWidth / 2 + gapSize + indicatorSize / 2}
          y={this.state.value}
          sides={3}
          radius={indicatorSize}
          fill='grey' />

      </Group>
    )
  }
}

Slider.propTypes = {
  boundingRectWidth: PropTypes.number,
  boundingRectHeight: PropTypes.number,
  strokeColor: PropTypes.string,
  strokeWidth: PropTypes.number,
  backgroundColor: PropTypes.string,
  pixelStepSize: PropTypes.number,
  fontSize: PropTypes.number,
  setValue: PropTypes.func,
  gapSize: PropTypes.number,
  indicatorSize: PropTypes.number
}

Slider.defaultProps = {
  boundingRectHeight: 200,
  boundingRectWidth: 40,
  strokeColor: 'black',
  strokeWidth: 1,
  backgroundColor: 'black',
  labelFontSize: 15,
  pixelStepSize: 1,
  gapSize: 1,
  indicatorSize: 6
}
