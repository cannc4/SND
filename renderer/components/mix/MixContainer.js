import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Mix from './Mix'
// CSS Imports
import '../../styles/css/Mix.css'

@inject('MixStore')
@observer
export default class MixContainer extends Component {

  handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      this.props.MixStore.undo()
    }
  }

  render () {

    const mixW = this.props.MixStore.componentWidth
    const mixH = this.props.MixStore.componentHeight    
    const mixTracks = this.props.MixStore.getMixTracks
    return <div className={'MixContainer draggableCancel PanelAdjuster'} 
                id='mixContainer'
                tabIndex={1} 
                onKeyDown={this.handleKeyDown}>
      <Mix 
        boundingRectWidth={mixW}
        boundingRectHeight={mixH}
        mixTracks={mixTracks} 
      />
    </div>
  }
}