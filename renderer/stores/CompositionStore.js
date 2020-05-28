import {
  observable,
  action,
  computed
} from 'mobx'
import _ from 'lodash'

class CompositionStore {
  
    // Time props
    @observable currentTime = 0
    @observable barInMs = 4 * 1000
    @observable maxTimeInBars = 100
    @observable maxTimeInMs = 100 * 1000

    // Time division props
    @observable timeDivision = 64
    @observable barDivision = 4
    @observable beatDivision = 4

    // Layout props
    @observable width = 1800
    @observable height = 900
    @observable inset = 10 // main {x, y}

    // Subcomponent layout props
    @observable headerWidth = 250
    @observable trackHeight = 50
    @observable timelineRulerHeight = 50
    @observable zoomFactor = 2

    @computed
    get getLayout () {
      return {
        x: this.getInset,
        y: this.getInset,
        width: this.getWidth,
        height: this.getHeight,
        headerWidth: this.getHeaderWidth,
        trackHeight: this.getTrackHeight,
        timelineRulerHeight: this.getTimelineRulerHeight,
        zoomFactor: this.getZoomFactor
      }
    }

    @computed
    get getLayoutBounds () {
      return {
        x: this.getInset,
        y: this.getInset,
        width: this.getWidth,
        height: this.getHeight
      }
    }

    @computed
    get getSubcomponentsLayout () {
      return {
        headerWidth: this.getHeaderWidth,
        trackHeight: this.getTrackHeight,
        timelineRulerHeight: this.getTimelineRulerHeight,
        zoomFactor: this.getZoomFactor
      }
    }

    @computed get getWidth () { return this.width }
    @computed get getHeight () { return this.height }
    @computed get getInset () { return this.inset }
    @computed get getHeaderWidth () { return this.headerWidth }
    @computed get getTrackHeight () { return this.trackHeight }
    @computed get getTimelineRulerHeight () { return this.timelineRulerHeight}
    @computed get getZoomFactor () { return this.zoomFactor }

    @action setWidth (w) { this.width = w }
    @action setHeight (h) { this.height = h }
    @action resizeComponent (clientHeight, clientWidth) {
      this.width = clientWidth - this.getInset
      this.height = clientHeight - this.getInset
    }
    @action setInset (i) { this.inset = i }
    @action setHeaderWidth (w) { this.headerWidth = w }
    @action setTrackHeight (h) { this.trackHeight = h }
    @action setTimebarHeight (h) { this.timelineRulerHeight = h }
    @action setZoomFactor (f) { this.zoomFactor = f }

    @action updateCurrentTime (t) { this.currentTime = t }
    @action updateTimeDivision (td) { this.timeDivision = td }
    @computed get getCurrentTime () { return this.currentTime }
    @computed get getTimeDivisions () {
      return {
        timeDivision: this.getTimeDivision,
        barDivision: this.getBarDivision,
        beatDivision: this.getBeatDivision,
        numberOfTimePoints: this.getMaxTime
      }
    }

    @computed get getTimeDivision () { return this.timeDivision }
    @computed get getBarDivision () { return this.barDivision }
    @computed get getBeatDivision () { return this.beatDivision }
    @computed get getMaxTime () { return this.maxTimeInBars * this.zoomFactor }
}
export default new CompositionStore()
