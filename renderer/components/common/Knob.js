import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Rect, Arc, Text, Group } from 'react-konva'

export default class Knob extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      value: 0
    }

    this.mouseMoved = false
    this.setValue = this.setValue.bind(this)
    this.lockMouse = this.lockMouse.bind(this)
    this.releaseMouse = this.releaseMouse.bind(this)
    this.getRotationValue = this.getRotationValue.bind(this)
  }

  setValue (pos) {
    const pixelStepSize = this.props.pixelStepSize
    const degreeStepSize = this.props.degreeStepSize
    const maxValue = 100 - this.props.arcGapAngle / degreeStepSize

    if (!this.mouseMoved) {
      this.initialMouseDownPosY = this.state.value * pixelStepSize + pos.y
      this.mouseMoved = true
    }

    const newValue = Math.floor((this.initialMouseDownPosY - pos.y) / pixelStepSize)

    this.setState({
      value: newValue > maxValue
        ? maxValue
        : newValue <= 0
          ? 0
          : newValue
    })
  }

  getRotationValue () {
    return this.state.value * this.props.degreeStepSize
  }

  lockMouse (pos) {
    this.mouseMoved = false
    document.addEventListener('mousemove', this.setValue)
    document.addEventListener('mouseup', this.releaseMouse)
  }

  releaseMouse () {
    this.mouseMoved = false
    document.removeEventListener('mousemove', this.setValue)
    document.removeEventListener('mouseup', this.releaseMouse)

    return this.props.setValue && this.props.setValue(this.state.value)
  }

  render () {
    // two circles on top of each other
    // one for the filling
    // the other just for the borders
    // rect for showing the value of the knob
    // text for indicating name
    const { boundingRectSize,
      strokeColor,
      strokeWidth,
      arcWidth,
      x, y,
      indicatorWidth,
      backgroundColor,
      foregroundColor,
      label,
      labelFontSize,
      indicatorCornerRadius,
      arcGapAngle } = this.props

    return (
      <Group ref={ref => (this.knobGroup = ref)}
        draggable={false}
        x={x}
        y={y}
        // onMouseDown={this.lockMouse}
      >
        <Arc
          x={boundingRectSize / 2}
          y={boundingRectSize / 2}
          innerRadius={boundingRectSize / 2 - arcWidth}
          outerRadius={boundingRectSize / 2 - strokeWidth}
          stroke={strokeColor}
          fill={backgroundColor}
          strokeWidth={strokeWidth}
          angle={360 - arcGapAngle}
          rotation={arcGapAngle * 2}
        />
        <Arc
          x={boundingRectSize / 2}
          y={boundingRectSize / 2}
          innerRadius={boundingRectSize / 2 - arcWidth}
          outerRadius={boundingRectSize / 2 - strokeWidth}
          fill={foregroundColor}
          strokeWidth={strokeWidth}
          angle={this.getRotationValue()}
          rotation={arcGapAngle * 2}
        />
        <Rect
          offsetX={indicatorWidth / 2}
          rotation={this.getRotationValue() + arcGapAngle / 2}
          x={boundingRectSize / 2}
          y={boundingRectSize / 2}
          width={indicatorWidth}
          height={boundingRectSize / 2 - strokeWidth}
          fill={foregroundColor}
          cornerRadius={indicatorCornerRadius} />
        <Text
          x={boundingRectSize / 2 - labelFontSize / 2}
          y={boundingRectSize - labelFontSize}
          text={label}
          fontSize={labelFontSize} />
        <Rect
          width={boundingRectSize}
          height={boundingRectSize}
          onMouseDown={this.lockMouse} />
      </Group>
    )
  }
}

Knob.propTypes = {
  boundingRectSize: PropTypes.number,
  arcWidth: PropTypes.number,
  arcGapAngle: PropTypes.number,
  indicatorWidth: PropTypes.number,
  label: PropTypes.string,
  labelFontSize: PropTypes.number,
  strokeColor: PropTypes.string,
  strokeWidth: PropTypes.number,
  backgroundColor: PropTypes.string,
  foregroundColor: PropTypes.string,
  indicatorCornerRadius: PropTypes.number,
  pixelStepSize: PropTypes.number,
  degreeStepSize: PropTypes.number,
  setValue: PropTypes.func
}

Knob.defaultProps = {
  boundingRectSize: 50,
  arcGapAngle: 60,
  strokeColor: 'black',
  strokeWidth: 1,
  backgroundColor: 'grey',
  foregroundColor: 'yellow',
  labelFontSize: 15,
  arcWidth: 4,
  indicatorWidth: 4,
  indicatorCornerRadius: 5,
  pixelStepSize: 3,
  degreeStepSize: 3.6
}
