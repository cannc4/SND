import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'

// CSS Imports
import '../../styles/css/App.css'
import '../../styles/css/Layout.css'
import '../../styles/css/MenuBar.css'

@inject('MenubarStore', 'UserStore', 'TransportStore')
@withRouter
@observer
class MenuBar extends Component {
  render () {
    // console.log("RENDER MENUBAR.JS")

    let serverStatusClass = 'ServerStatus'
    if (this.props.MenubarStore.getActive <= 0) { serverStatusClass += ' inactive' } else if (this.props.MenubarStore.getActive === 1) { serverStatusClass += ' ready' } else if (this.props.MenubarStore.getActive === 2) { serverStatusClass += ' running' }

    const startServer = () => {

    }
    const stopServer = () => {

    }

    const handleLogout = (e) => {
      e.preventDefault()
      this.props.UserStore.logout()
        .then(() => this.props.history.replace('/login'))
    }

    return (<div className='MenuBar boxshadow'>
      <div className={'Logo'} id={'logo_disp'} title={'Refresh'}>
        {<img
          onClick={() => {
            if (window.confirm('Do you want to refresh page? Unsaved changes will be destroyed.')) {
              window.location.reload(false)
            }
          }}
          alt=''
          src={require('../../assets/logo.svg')}
          height={30} width={30} />}
      </div>

      <div className={'TimerControls'}>

        {/* RMS SHAPE LEFT */}
        {/* <canvas className={'RMSVis'} id={'RMSVis_Left'}
          width={MenubarStore.rmsArray.length * 0.5 * 20} height={30}>
        </canvas> */}

        {<button className={'Button'} title={'Stop Pulse'}
          onClick={() => (this.props.TransportStore.stop())}>◼</button>}
        {!this.props.TransportStore.isActive &&
          <button className={'Button'} title={'Start Pulse'}
            onClick={() => (this.props.TransportStore.play())}>▶</button>}
        {this.props.TransportStore.isActive &&
          <button className={'Button'} title={'Pause Pulse'}
            onClick={() => (this.props.TransportStore.stop())}>⏸</button>}

        <div style={{ borderLeft: '1px solid var(--global-color)', height: '90%', marginLeft: '5px', marginRight: '10px' }} />

        {<button className={'Button ' + (this.props.MenubarStore.isRecording ? 'Record' : '')}
          title={(this.props.MenubarStore.isRecording ? 'Recording...' : 'Start recording')}
          onClick={() => { this.props.MenubarStore.toggleRecording() }}>
          ⬤
        </button>}

        {/* RMS SHAPE RIGHT */}
        {/* <canvas className={'RMSVis'} id={'RMSVis_Right'}
          width={MenubarStore.rmsArray.length * 0.5 * 20} height={30}>
        </canvas> */}
      </div>

      {/* <div className={'OtherControls'}>

        {!this.props.MenubarStore.isPlaying && <button className={'Button '}
          onClick={() => this.props.MenubarStore.togglePlay()}>
          >
        </button>}
        {this.props.MenubarStore.isPlaying && <button className={'Button '}
          onClick={() => this.props.MenubarStore.togglePlay()}>
          ||
        </button>}
      </div> */}

      <div className='OtherControls'>
        {this.props.UserStore.currentUser !== undefined && <button className={'Button draggableCancel '}
          onClick={handleLogout} title={'Logout'}> Logout </button>}

        <div className={serverStatusClass} title={'Server Status'} />

        {this.props.MenubarStore.getActive === 0 &&
          <button className={'Button draggableCancel '}
            onClick={startServer} title={'Initalize Server'}> Talon </button>}
        {this.props.MenubarStore.getActive === 1 &&
          <button className={'Button draggableCancel disabledView'}
            title={'Booting Server'}> Loading </button>}
        {this.props.MenubarStore.getActive === 2 &&
          <button className={'Button draggableCancel '}
            onClick={stopServer} title={'Terminate Server'}> Talon </button>}

        {/* <Popup trigger={<button className={'Button draggableCancel'} title={"Help"} > Help</button>} position={'bottom right'}>
          <div className={'helpContainer'}>
            TODO
          </div>
        </Popup> */}

      </div>
    </div>)
  }
}
export default MenuBar
