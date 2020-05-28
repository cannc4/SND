import _ from 'lodash'
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { SubMenu, ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'

// CSS Imports
import '../../styles/css/App.css'
import '../../styles/css/Layout.css'
import '../../styles/css/Home.css'
import '../../styles/css/ContextMenu.css'

import {
  save, saveLayout, timer,
  loadCustomLayout_0, loadCustomLayout_1, loadCustomLayout_2, loadCustomLayout_3,
  resetLayout
} from '../../utils/keyFunctions'

// Component imports
import GraphContainer from '../graph/GraphContainer'
import CompositionContainer from '../composition/CompositionContainer'
import MixContainer from '../mix/MixContainer'

// Grid Layout Initialization
const ReactGridLayout = require('react-grid-layout')
const WidthProvider = ReactGridLayout.WidthProvider
WidthProvider.measureBeforeMount = true
const ResponsiveReactGridLayout = WidthProvider(ReactGridLayout.Responsive)

const keymaster = require('keymaster')

@inject('LayoutStore', 'TrackStore', 'CompositionStore', 'UserStore', 'ProjectStore', 'GraphStore', 'SocketStore')
@observer
export default class Home extends Component {  

  componentDidMount() {

    keymaster('⌘+s, ctrl+s', save)
    keymaster('⌘+shift+s, ctrl+shift+s', saveLayout)
    keymaster('ctrl+enter', timer)

    keymaster('shift+r', resetLayout)
    
    keymaster('shift+1', loadCustomLayout_0)
    keymaster('shift+2', loadCustomLayout_1)
    keymaster('shift+3', loadCustomLayout_2)
    keymaster('shift+4', loadCustomLayout_3)

    // Load the projectData to components
    this.props.LayoutStore.load()
  }
  
  componentWillUnmount() {
    keymaster.unbind('ctrl+s', save)
    keymaster.unbind('⌘+shift+s, ctrl+shift+s', saveLayout)
    keymaster.unbind('ctrl+enter', timer) 

    keymaster.unbind('shift+r', resetLayout)
    
    keymaster.unbind('shift+1', loadCustomLayout_0)
    keymaster.unbind('shift+2', loadCustomLayout_1)
    keymaster.unbind('shift+3', loadCustomLayout_2)
    keymaster.unbind('shift+4', loadCustomLayout_3)
  }

  handleChangeLayout = (layouts, layout) => {
    const componentId = layout.i
    const component = document.getElementById(`${componentId}Container`)
    if (component) {
      const clientHeight = component.clientHeight
      const clientWidth = component.clientWidth
      switch (component) {
      case 'graphContainer':
        this.props.GraphStore.resizeComponent(clientHeight, clientWidth)
        break

      case 'compositionContainer':
        this.props.CompositionStore.resizeComponent(clientHeight, clientWidth)
        break
            
      case 'mixContainer':
        this.props.MixStore.resizeComponent(clientHeight, clientWidth)    
        break

      default:
        break
      }
    }        
  }
  handleChangeLayoutStop = (layouts, layout) => {
    this.props.LayoutStore.onLayoutChange(layouts,layout)
  }
  

  renderLayouts(layoutItem) {
    // console.log('RENDER LAYOUTS @ HOME.JS')
  
    const { LayoutStore } = this.props
    /// ----- GLOBAL LAYOUTS ------
    if (layoutItem.i === 'composition') {
      return layoutItem.isVisible && (<div key={layoutItem.i}>
        <div className={'PanelHeader'} > ● Composition
          <span className={'PanelClose draggableCancel'} onClick={() => LayoutStore.hideLayout(layoutItem.i)}>x</span>   
        </div>
    
        <CompositionContainer/>   
    
      </div>)
    }
    else if (layoutItem.i === 'graph') {
      return layoutItem.isVisible && (<div key={layoutItem.i} >
        <div className={'PanelHeader'}> ● Graph
          <span className={'PanelClose draggableCancel'} onClick={() => LayoutStore.hideLayout(layoutItem.i)}>x</span>
        </div>

        <GraphContainer/>

      </div>)
    }
    else if (layoutItem.i === 'mix') {
      return layoutItem.isVisible && (<div key={layoutItem.i} >
        <div className={'PanelHeader'}> ● Mix
          <span className={'PanelClose draggableCancel'} onClick={() => LayoutStore.hideLayout(layoutItem.i)}>x</span>
        </div>

        <MixContainer/>

      </div>)
    }
    
  }

  handleRightClick = (param, event) => {
    
    if (param.type === 'modulesRemove') this.props.LayoutStore.hideLayout(param.val)
    else if (param.type === 'modulesAdd') this.props.LayoutStore.showLayout(param.val)
    else if (param.type === 'layoutSave') this.props.LayoutStore.save()
    else if (param.type === 'layoutReset') this.props.LayoutStore.reset()
    else if (param.type === 'layoutSaveCustom') { 
      this.props.LayoutStore.saveCustom(param.val)
      this.props.LayoutStore.save()
    }
    else if (param.type === 'layoutLoadCustom') { 
      if (event.altKey) { 
        this.props.LayoutStore.deleteCustom(param.val)
        this.props.LayoutStore.saveCustom(param.val)
        this.props.LayoutStore.save()
      }
      else this.props.LayoutStore.loadCustom(param.val)
    }
    else if (param.type === 'MIDI') this.props.TrackStore.addTrack(0, 'MIDI')
    else if (param.type === 'AUDIO') this.props.TrackStore.addTrack(0, 'AUDIO')
    else if (param.type === 'GROUP') this.props.TrackStore.addTrackGroup()
    else if(param.type === 'Grid'){
      this.props.CompositionStore.updateTimeDivision(param.val)
    }
  };

  render() {
    const ctx = this
    // console.log('RENDER HOME.JS')

    const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 58, // Total Height
      n = 20,               // Number of rows
      m = 4,                // Margin
      h_ = (h-(n+1)*m)/n   // Item height
    
    return (
      <div>
        <ContextMenuTrigger id="global_context" holdToDisplay={-1}>
          <div id={'homepage'} className={'Home'}>
            <ResponsiveReactGridLayout
              className={'layout'}
              layouts={{ lg: this.props.LayoutStore.visibleLayouts }}
              breakpoints={{ lg: 1200, md: 1000, sm: 600, xs: 400 }}
              cols={{ lg: 24, md: 20, sm: 12, xs: 8 }}
              margin={[m, m]}
              rowHeight={h_}
              draggableCancel={'.draggableCancel'}
              onResize={this.handleChangeLayout.bind(this)}
              onResizeStop={this.handleChangeLayoutStop.bind(this)}
              useCSSTransforms={true}
            >
              {this.props.LayoutStore.visibleLayouts.map(this.renderLayouts.bind(this))}
            </ResponsiveReactGridLayout> 
          </div>          
        </ContextMenuTrigger>
      
        <ContextMenu id="global_context" className={'draggableCancel'}>
          <MenuItem onClick={save} data={{ item: 'reset' }}>Save Project<span style={{ float: 'right' }}>⌥ + S</span></MenuItem>
          <MenuItem onClick={ctx.handleRightClick.bind(ctx,{ type:'layoutSave' })} data={{ item: 'reset' }}>Save Layout<span style={{ float: 'right' }}>⇧ + ⌥ + S</span></MenuItem>
          <MenuItem divider />
          <SubMenu title={'Modules'} onClick={(event) => { event.preventDefault()}}>
            {_.map(ctx.props.LayoutStore.allLayouts, (layoutItem, key) => {
              const isVisible = _.find(ctx.props.LayoutStore.allLayouts, { 'i': layoutItem.i, 'isVisible': true })
              return <MenuItem key={key}
                onClick={ctx.handleRightClick.bind(ctx,
                  { type: (isVisible ? 'modulesRemove' : 'modulesAdd'), val: layoutItem.i })}
                data={{ item: layoutItem.i }}>
                {_.startCase(layoutItem.i)}
                <span style={{ float: 'right' }}>{(isVisible ? '*' : ' ')}</span>
              </MenuItem>
            })}
          </SubMenu>
          <SubMenu title={'Layouts'} onClick={(event) => { event.preventDefault()}}>
            <MenuItem onClick={ctx.handleRightClick.bind(ctx,{ type:'layoutReset' })} data={{ item: 'reset' }}>Reset Layout<span style={{ float: 'right' }}>⇧ + R</span></MenuItem>
            <MenuItem onClick={ctx.handleRightClick.bind(ctx, { type: 'matrixFull' })} data={{ item: 'reset' }}>Max. Grid<span style={{ float: 'right' }}>⇧ + F</span></MenuItem>         
            <MenuItem divider />
            <MenuItem disabled> Alt-Click to replace </MenuItem>
            {_.map({ a:0, b:1, c:2, d:3 }, (i, key) => {
              if(!ctx.props.LayoutStore.isSlotEmpty(i))
                return <MenuItem key={key}
                  onClick={ctx.handleRightClick.bind(ctx, { type: 'layoutLoadCustom', val: i })}
                  data={{ item: 'c_' + i }}>Cust. {i+1}<span style={{ float: 'right' }}>⇧ + {i+1}</span>
                </MenuItem>
              else
                return <MenuItem key={key}
                  onClick={ctx.handleRightClick.bind(ctx, { type: 'layoutSaveCustom', val: i })}
                  data={{ item: 'c_' + i }}>click to save here
                </MenuItem>
            })}
          </SubMenu>
          <SubMenu title={'Test'} onClick={(event) => { event.preventDefault()}}>
            <MenuItem onClick={ctx.handleRightClick.bind(ctx,{ type:'GROUP' })} data={{ item: 'reset' }}>Add TrackGroup </MenuItem>
            <MenuItem onClick={ctx.handleRightClick.bind(ctx,{ type:'AUDIO' })} data={{ item: 'reset' }}>Add Audio Track </MenuItem>
            <MenuItem onClick={ctx.handleRightClick.bind(ctx,{ type:'MIDI' })} data={{ item: 'reset' }}>Add MIDI Track </MenuItem>
            <MenuItem onClick={ctx.handleRightClick.bind(ctx,{ type:'Grid', val: 32 })} data={{ item: 'reset' }}>2 bars </MenuItem>
            <MenuItem onClick={ctx.handleRightClick.bind(ctx,{ type:'Grid', val: 64 })} data={{ item: 'reset' }}>4 bars </MenuItem>
          </SubMenu>
        </ContextMenu>
      
      </div>
      
    )
  }
}