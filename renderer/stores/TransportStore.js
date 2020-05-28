import {
  observable,
  action,
  computed
} from 'mobx'

class TransportStore {

  @observable audioContext
  @observable currentTime = 0.0
  @observable stopped = true
  @observable isPlaying = false
  rAF

  @observable transport = {}
  transportSocket = undefined
  transportUrl = 'ws://localhost:8081'

  constructor () {


    this.transportSocket = new WebSocket(this.transportUrl, 'transport')
    this.transportSocket.onopen = (event) => {
      console.log(event)
      this.transportSocket.send('Boot')
      this.initAudioContext()
    }
    this.transportSocket.onmessage = (event) => {
      console.log(event.data)
    }
    
  }
  
  initAudioContext(){
      window.AudioContext = window.AudioContext || window.webkitAudioContext
      this.audioContext = new AudioContext()
      console.log(this.audioContext)
  }

  play() {
    // this.audioContext.start()
    this.rAF = requestAnimationFrame(this.updateCurrentTime.bind(this, this.audioContext))
    this.stopped = false
    this.isPlaying = true
  }

  stop(){
    // this.audioContext.stop()
    cancelAnimationFrame(this.rAF)
    this.stopped = true
    this.isPlaying = false
    this.currentTime = 0
  }

  @action
  updateCurrentTime(audioContext) {
    this.currentTime = audioContext.currentTime
    // this.currentTime = this.currentTime + 0.2
    console.log(this.currentTime)
    this.rAF = requestAnimationFrame(this.updateCurrentTime.bind(this, this.audioContext))
  }

  @computed get getCurrentTime(){
    return (this.stopped) ? 0 : this.currentTime
  }

  @computed get getTransport(){
    return this.transport
  }

  @action
  load(t){
    this.transport = t
  }

}

export default new TransportStore()
