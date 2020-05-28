import _ from 'lodash'
import LayoutStore from '../stores/LayoutStore'
import TransportStore from '../stores/TransportStore'
import ProjectStore from '../stores/ProjectStore'

export const executionCssById = (elemId, classname = ' SaveExecuted', duration = 750) => {
  const elem = document.getElementById('logo_disp')
  if (elem !== undefined || elem !== null) {
    elem.className += classname
    _.delay(() => { elem.className = _.replace(elem.className, classname, '') }, duration)
  }
}

export const executionCssByEvent = (event, duration = 500) => {
  event.persist()
  event.target.className += ' Executed'
  _.delay(() => (event.target.className = _.replace(event.target.className, ' Executed', '')),
    duration)
}

export const save = () => {
  console.log(' ## Saving...')
  ProjectStore.save()

  executionCssById('logo_disp')
  return false
}

export const saveLayout = () => {
  // LayoutStore.save()
  executionCssById('logo_disp')
  return false
}

export const timer = () => {
  if (TransportStore.isActive) { TransportStore.stopPulse() } else { TransportStore.startPulse() }
}

export const resetLayout = () => {
  LayoutStore.reset()
}
export const fullscreen_matrix = () => {
  LayoutStore.matFullscreen()
  // LayoutStore.fullscreen('tracker')
}
export const loadCustomLayout_0 = () => {
  LayoutStore.loadCustom(0)
}
export const loadCustomLayout_1 = () => {
  LayoutStore.loadCustom(1)
}
export const loadCustomLayout_2 = () => {
  LayoutStore.loadCustom(2)
}
export const loadCustomLayout_3 = () => {
  LayoutStore.loadCustom(3)
}
