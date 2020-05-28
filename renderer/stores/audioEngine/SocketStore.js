import {
  observable,
  action,
  computed
} from 'mobx'
import AudiEngineStore from './AudioEngineStore'

const 
  Keyboard = 0x0001,
  MouseButton = 0x0002,
  MouseAbsolute = 0x0004,
  MouseRelative = 0x0008,
  Mouse = MouseButton || MouseAbsolute || MouseRelative,
  // Talon-specific data messages
  TalonDataAdd = 0x0010,
  TalonDataRemove = 0x0020,
  TalonDataModify = 0x0040,
  TalonData = TalonDataAdd || TalonDataRemove || TalonDataModify,
  TalonCommand = 0x0080,
  MidiInput = 0x0100,
  AudioInput = 0x0200

class SocketStore {
    @observable connectionStatus = false
    websocket = null
    talonURL =  'ws://localhost:8080'
    talonServerName = 'ws-vnc'

    constructor(){
      this.websocket = new WebSocket(this.talonURL, this.talonServerName)
      if(this.websocket.readyState === 1) { 
        this.connectionStatus = true
      }
    }

    sendMessage(message){
      this.websocket.sendMessage(message)
    }

}
  
export default new SocketStore()
