import {
  observable,
  action,
  computed
} from 'mobx'

import SocketStore from './SocketStore'
  
export class AudioEngineStore {

    @observable connectionStatus = false

    load (projectData) {
      if(SocketStore.connectionStatus === true) {
        const serializedData = JSON.stringify(projectData)
        this.sendMessage(serializedData)
      } else {
        console.log('Not connected')
      }
    }

    sendMessage(message){
      SocketStore.sendMessage(message)
    }
}
export default new AudioEngineStore()
