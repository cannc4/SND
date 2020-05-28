import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Graph from './Graph'
import Plugins from './Plugins'
// CSS Imports
import '../../styles/css/Graph.css'

@inject('GraphStore', 'UserStore')
@observer
export default class GraphContainer extends Component {

    componentDidMount(){
      this.props.GraphStore.commandStack = []
    }

    handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        this.props.GraphStore.undo()
      }
    }

    render() {
      const graph = this.props.GraphStore.graph
      const graphScale = this.props.GraphStore.graphScale
      const selectedNodes = this.props.GraphStore.getSelectedNodes
      const graphW = this.props.GraphStore.componentWidth
      const graphH = this.props.GraphStore.componentHeight    
      const activePlugins = this.props.UserStore.currentUser ? this.props.UserStore.currentUser.plugins : [{}]
      
      return (
        <div className={'Graph draggableCancel PanelAdjuster'} 
          id='graphContainer'
          tabIndex={1} 
          onKeyDown={this.handleKeyDown}>
          <div className={'Plugins'} id='pluginContianer'>
            <Plugins activePlugins={activePlugins}/>
          </div>
          {`TrackGroup-${this.props.GraphStore.activeGraphIndex}`}
          <div>
            <Graph 
              graph={graph}
              boundingRectWidth={graphW}
              boundingRectHeight={graphH}
              graphScale={graphScale}
              selectedNodes={selectedNodes}
            />
          </div>
        </div>
      )
    }
}
