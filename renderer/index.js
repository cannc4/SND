
import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route } from 'react-router-dom'
import { configure } from 'mobx'
import { Provider } from 'mobx-react'

import './index.css'
import App from './components/App'
import LayoutStore from './stores/LayoutStore'
import MenubarStore from './stores/MenubarStore'
import TransportStore from './stores/TransportStore'
import ProjectStore from './stores/ProjectStore'
import AudioEngineStore from './stores/audioEngine/AudioEngineStore'
import GraphStore from './stores/GraphStore'
import DirectoryStore from './stores/DirectoryStore'
import MixStore from './stores/MixStore'
import TrackStore from './stores/TrackStore'
import CompositionStore from './stores/CompositionStore'
import UserStore from './stores/UserStore'
import TokenStore from './stores/TokenStore'
import SocketStore from './stores/audioEngine/SocketStore'

const stores = {
  UserStore,
  TokenStore,
  LayoutStore,
  TrackStore,
  AudioEngineStore,
  CompositionStore,
  GraphStore,
  ProjectStore,
  MenubarStore,
  TransportStore,
  DirectoryStore,
  MixStore,
  SocketStore
}

if (process.env.NODE_ENV !== 'production') {
  window.localStorage.setItem('debug', 'CH:*')
}

// For easier debugging
window.CH = stores

configure(false)

ReactDOM.render((
  <Provider {...stores} >
    <HashRouter>
      <Route component={App} />
    </HashRouter>
  </Provider>
), document.getElementById('root'))
