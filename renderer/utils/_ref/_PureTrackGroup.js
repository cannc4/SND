import React, { Component } from 'react'
import { toJS } from 'mobx'
import { Group } from 'react-konva'

import * as uiDebug from '../uiDebug.js'

// import TrackStore from '../../stores/TrackStore'
// import ContextMenuKonva from '../common/menu/ContextMenu'
// import ContextMenuTriggerKonva from '../common/menu/ContextMenuTrigger'

// import Track from './Track'
// import Knob from '../common/Knob'
// import Slider from '../common/Slider'

export default class PureTrackGroup extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      tracks: [],
      defaultHeaderHeight: 100,
      defaultTrackHeight: 200,
      defaultContainerHeight: 800,
      isSelected: false
    }
  }

  createTitleText (trackName) {
    var titleText = new Konva.Text({
      x: 3,
      y: this.props.timebarHeight * (this.props.tgid + 1),
      text: trackName,
      fontSize: 14,
      fontFamily: 'Calibri',
      fill: 'white',
      padding: 10,
      align: 'center'
    })
    return titleText
  }

  createTitleBar (totalWidth, titleText) {
    const titleBar = new Konva.Rect({
      x: 3,
      y: this.props.timebarHeight * (this.props.tgid + 1),
      stroke: '#333',
      strokeWidth: 3,
      fill: 'black',
      width: (totalWidth * 2) - 3,
      height: titleText.height(),
      cornerRadius: 2,
      padding: 10
    })
    return titleBar
  }

  createKnob () {

    // text for indicating name
    //  const { boundingRectSize,
    //   strokeColor,
    //   strokeWidth,
    //   arcWidth,
    //   indicatorWidth,
    //   backgroundColor,
    //   foregroundColor,
    //   label,
    //   labelFontSize,
    //   indicatorCornerRadius,
    //   arcGapAngle } = this.props

  }

  createButton (type, itemHolder, index) {
    const buttonSpace = (itemHolder.width() / 2) / 3
    const buttonHeight = itemHolder.height() / 3 // center
    // let singleSpace = buttonSpace / 3 // total number of buttons
    const createdButton = new Konva.Rect({
      x: (itemHolder.attrs.x + buttonHeight * index),
      y: itemHolder.attrs.y + 2,
      id: type,
      stroke: '#333',
      fill: 'green',
      height: buttonSpace,
      width: buttonHeight,
      cornerRadius: 2,
      strokeWidth: 2
    })
    return createdButton
  }

  createSlider () {
    // const { boundingRectWidth,
    //   boundingRectHeight,
    //   strokeColor,
    //   strokeWidth,
    //   indicatorWidth,
    //   backgroundColor,
    //   fontSize,
    //   gapSize,
    //   indicatorSize } = this.props
  }

  createHeader () {
    // create title text
    // create knobs
    // create mute
    // create solo
    // create delete
    // create sliders

  }

  createGroupLine (nameContainer, totalHeight) {
    const line = new Konva.Line({
      x: nameContainer.attrs.x - 4.5,
      y: nameContainer.attrs.y,
      points: [0, 0, 0, totalHeight],
      stroke: 'yellow',
      strokeWidth: 8,
      tension: 1,
      cornerRadius: 2,
      bezier: false
    })
    return line
  }

  createVerticalSeperator (nameContainer, totalHeight, width) {
    const line = new Konva.Line({
      x: nameContainer.attrs.x - 4.5,
      y: nameContainer.attrs.y + totalHeight,
      points: [0, 0, width * 2, 0],
      stroke: 'yellow',
      strokeWidth: 1,
      tension: 1,
      cornerRadius: 2,
      bezier: false
    })
    return line
  }

  createTrackGroupContainer (posX, posY, height, tgid) {
    const createdButton = new Konva.Rect({
      x: posX,
      y: posY * (this.props.tgid + 1),
      id: `trackgroup_${tgid}_container`,
      stroke: 'yellow',
      strokeWidth: 1,
      fill: 'gray',
      opacity: 0.3,
      width: this.props.boundingRectWidth, //  props.width
      height: height, // total number of tracks + trackgroup header
      cornerRadius: 5,
      strokeWidth: 2,
      listening: false
    })
    return createdButton
  }

  createHeaderContainer (nameContainer, seperator, totalHeight) {
    const createdButton = new Konva.Rect({
      x: nameContainer.attrs.x,
      y: nameContainer.attrs.y + nameContainer.height(),
      id: 'buttonContainer',
      stroke: '#333',
      fill: 'black',
      width: seperator.width() - 3,
      height: totalHeight - nameContainer.height(),
      cornerRadius: 1,
      strokeWidth: 2
    })
    return createdButton
  }

  createTrackContainer (id, tgid, posY) {
    const createdButton = new Konva.Rect({
      x: 0,
      y: posY * (id + 1),
      id: `track_${tgid}_${id}_container`,
      stroke: 'white',
      strokeWidth: 1,
      opacity: 0.2,
      fill: 'blue',
      width: this.props.boundingRectWidth, //  props.width
      height: this.state.defaultTrackHeight, // total number of tracks + trackgroup header
      cornerRadius: 5,
      strokeWidth: 2,
      listening: false
    })
    return createdButton
  }

  createTrackTitleHolder (header, idx) {
    const titleBar = new Konva.Rect({
      x: 3,
      y: (header.attrs.y + header.height()) * (idx + 1),
      stroke: '#333',
      strokeWidth: 3,
      fill: 'black',
      width: 300,
      height: 50,
      cornerRadius: 2,
      padding: 10
    })
    return titleBar
  }

  createTrackTitle (header, idx, track) {
    var titleText = new Konva.Text({
      x: 3,
      y: (header.attrs.y + header.height()) * (idx + 1),
      text: track.name,
      fontSize: 14,
      fontFamily: 'Calibri',
      fill: 'white',
      padding: 20,
      align: 'center'
    })
    return titleText
  }

  createTrack (header, tgid, idx, track) {
    const trackKonvaGroup = new Konva.Group()
    const container = this.createTrackContainer(idx, tgid, header.attrs.y + header.height())
    const titleHolder = this.createTrackTitleHolder(header, idx)
    const trackTitle = this.createTrackTitle(header, idx, track)
    trackKonvaGroup.add(container)
    trackKonvaGroup.add(titleHolder)
    trackKonvaGroup.add(trackTitle)

    return trackKonvaGroup
  }

  createHeaderSeperator (xPos) {
    const line = new Konva.Line({
      x: xPos,
      y: 80 * (this.props.tgid + 1),
      points: [xPos, 0, xPos, this.props.boundingRectHeight],
      stroke: 'green',
      strokeWidth: 2,
      tension: 0,
      bezier: false
    })
    return line
  }

  createHeaderContainerSeperator (container) {
    const line = new Konva.Line({
      x: 0,
      y: container.attrs.y * (this.props.tgid + 1),
      points: [container.width() / 2, 0, container.width() / 2, container.height()],
      stroke: 'red',
      strokeWidth: 2,
      tension: 0,
      bezier: false
    })
    return line
  }

  createTransform () {
    var MAX_WIDTH = 200
    // create new transformer
    var tr = new Konva.Transformer({
      boundBoxFunc: function (oldBoundBox, newBoundBox) {
        // "boundBox" is an object with
        // x, y, width, height and rotation properties
        // transformer tool will try to fit node into that box
        // "width" property here is a visible width of the object
        // so it equals to rect.width() * rect.scaleX()

        // the logic is simple, if new width is too big
        // we will return previous state
        if (Math.abs(newBoundBox.width) > MAX_WIDTH) {
          return oldBoundBox
        }

        return newBoundBox
      }
    })
    return tr
  }

  draw () {
    const { boundingRectWidth, boundingRectHeight, headerWidth, trackGroup, tracks, tgid } = this.props

    console.log('TG', toJS(trackGroup))
    console.log('TRACKS', toJS(tracks))

    const seperatorOffset = 10
    const seperatorX = headerWidth - seperatorOffset

    // Main header group
    const headerGroup = new Konva.Group()

    const totalHeight = tracks.length * this.state.defaultTrackHeight + this.state.defaultHeaderHeight
    const tgContainer = this.createTrackGroupContainer(0, 80, totalHeight, tgid)
    const tgSeperator = this.createHeaderSeperator(seperatorX)

    const nameGroup = new Konva.Group()
    const name = this.createTitleText(trackGroup.name)
    const nameContainer = this.createTitleBar(seperatorX, name)
    nameGroup.add(nameContainer)
    nameGroup.add(name)

    const tgLine = this.createGroupLine(nameContainer, totalHeight)
    const tgHeaderSeperator = this.createVerticalSeperator(nameContainer, this.state.defaultHeaderHeight, seperatorX)
    const tgHeaderContainer = this.createHeaderContainer(nameContainer, tgHeaderSeperator, this.state.defaultHeaderHeight)

    const buttonGroup = new Konva.Group()
    const soloButton = this.createButton('solo', tgHeaderContainer, 0)
    const deleteButton = this.createButton('mute', tgHeaderContainer, 1)
    const muteButton = this.createButton('delete', tgHeaderContainer, 2)
    buttonGroup.add(soloButton)
    buttonGroup.add(deleteButton)
    buttonGroup.add(muteButton)

    const headerSeperator = this.createHeaderContainerSeperator(tgHeaderContainer)
    headerGroup.add(tgHeaderContainer)

    headerGroup.add(buttonGroup)
    headerGroup.add(headerSeperator)
    // let rmsIndicator = this.createSlider()

    headerGroup.add(tgContainer)
    headerGroup.add(tgSeperator)
    headerGroup.add(nameGroup)
    headerGroup.add(tgLine)
    headerGroup.add(tgHeaderSeperator)
    this.group.add(headerGroup)
    const trx = this.state.tracks
    for (let i = 0; i < tracks.length; i++) {
      const trackToDraw = this.createTrack(tgHeaderContainer, tgid, i, this.props.tracks[i])
      this.group.add(trackToDraw)

      trx.push(trackToDraw)
    }
    this.setState({ tracks: trx })
  }

  componentDidUpdate (prevProps, prevState) {
    // Render conditions
    console.log(this.props.tracks.length, prevProps.tracks.length)
    if (this.props.tracks.length !== prevProps.tracks.length) {
      this.draw()
    }
  }

  componentDidMount () {
    this.setState({ tracks: this.props.tracks })
    this.draw()
    // console.log(trackGroup)

    // create headers
    // create track
  }

  render () {
    return (
      <Group ref={ref => (this.group = ref)}
        draggable={false} />
    )
  }
}
