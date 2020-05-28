import React, { Component } from 'react'
import { Image } from 'react-konva'

class Video extends Component {
  constructor(props) {
    super(props)

    const video = document.createElement('video')
    video.muted = true
    video.autoplay = false
    video.loop = true
    video.src = props.src
    this.state = {
      video: video
    }
    video.addEventListener('canplay', () => {
      video.play()
      this.image.getLayer().batchDraw()
      this.requestUpdate()
    })

  }

    requestUpdate = () => {
      this.image.getLayer().batchDraw()
      requestAnimationFrame(this.requestUpdate)
    }
    render() {
      const { settings } = this.props
      return (
        <Image
          {...settings}
          image={this.state.video}
          ref={node => { this.image = node }}
        />
      )
    }
}

Video.defaultProps = {
  settings: null,
}

export default Video
