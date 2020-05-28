import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Composition from './Composition'

@inject('TrackStore', 'CompositionStore', 'TransportStore')
@observer
export default class CompositionContainer extends Component {

  handleKeyDown = (e) => {
    e.preventDefault()
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      this.props.TrackStore.undo()
    }
  }

  componentDidMount(){
    this.props.TrackStore.commandStack = []
  }

  render () {

    const trackGroups = this.props.TrackStore.getTrackGroups
    const tracks = this.props.TrackStore.getTracks
    const time = this.props.CompositionStore.getTimeDivisions
    const layout = this.props.CompositionStore.getLayout
    const transport = this.props.TransportStore.getCurrentTime

    return (
      <div className={'Composition draggableCancel'} 
      tabIndex={1} 
      onKeyDown={this.handleKeyDown.bind(this)} 
      id='compositionContainer'>
        <Composition 
          trackGroups={trackGroups}
          tracks={tracks}
          time={time}
          layout={layout}
          transport={transport}
        /> 
      </div>
    )

  }
}
