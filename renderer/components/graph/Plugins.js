import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

class Plugin extends React.PureComponent {

  render () {
    return (<div>
  
    </div>)
  }
}

@inject('GraphStore')
@observer
class Plugins extends Component {

  render () {
    const activePlugins = this.props.activePlugins

    return (<div>
      {activePlugins.map(p => {
        <Plugin plugin={p}/>
      })
      }
    </div>)
  }
}
export default Plugins
