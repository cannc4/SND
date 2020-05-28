import {
  computed
} from 'mobx'
import _ from 'lodash'
import Log from '../utils/logger'

import TrackStore from './TrackStore'
import MixStore from './MixStore'
import UserStore from './UserStore'
import LayoutStore from './LayoutStore'
import AudioEngineStore  from './audioEngine/AudioEngineStore'

import * as jsonpatch from 'fast-json-patch'
import TransportStore from './TransportStore'

class ProjectStore {
    JSONObserver = null

    projectData = undefined

    projectTitle = 'default'

    projectVersion = '0.1'

    projectTempo = '120'

    projectList = ['default']

    @computed get getProjectData () {
      return this.projectData
    }

    @computed get getProjectTitle () {
      return this.projectTitle
    }

    @computed get getProjectVersion () {
      return this.projectVersion
    }

    @computed get getProjectTempo () {
      return this.projectTempo
    }

    loadProjectDataFromCache(data){
      this.projectData = data
    }

    loadProjectData (data) {
      this.projectData = data[0]
      this.projectTitle = this.projectData.title
      this.projectTempo = this.projectData.tempo
      this.projectVersion = this.projectData.version

      const AUDIOENGINE = data[0].AUDIOENGINE
      const TRANSPORT = AUDIOENGINE.TRANSPORT
      console.log(AUDIOENGINE)
      const TRACKGROUP = AUDIOENGINE.TRACKGROUPS.TRACKGROUP
      const MIXER = AUDIOENGINE.MIXER.MIXERBUS || AUDIOENGINE.MIXER
      // Load stores
      console.log(MIXER)
      TrackStore.load(TRACKGROUP)
      MixStore.load(MIXER)
      AudioEngineStore.load(AUDIOENGINE)
      TransportStore.load(TRANSPORT)
      // Observe the projectData for future JSONPatch ops
      // localStorage.set('projectData', this.projectData)
      this.JSONObserver = jsonpatch.observe(this.projectData)
    }

    save () {
      // Combine stores
      const stores = {
        MIXER: { MIXERBUS: MixStore.getMixTracks }, 
        TRACKGROUPS: { TRACKGROUP: TrackStore.getTrackGroups }, 
        TRANSPORT: TransportStore.getTransport,
        layouts: LayoutStore.getLayouts, 
        customs: LayoutStore.getCustoms
      }
      
      this.projectData.AUDIOENGINE.TRACKGROUPS = stores.TRACKGROUPS
      this.projectData.AUDIOENGINE.MIXER = stores.MIXER
      this.projectData.AUDIOENGINE.TRANSPORT = stores.TRANSPORT

      const patchOps = this.generatePatchOps()
      this.patchAudioEngine(patchOps)
      this.patchProjectData(this.projectData)
      this.patchUserLayouts(stores.layouts)
      this.patchUserCustoms(stores.customs)
      // cache.set('projectData', this.projectData)
    }

    generatePatchOps(){
      return jsonpatch.generate(this.JSONObserver)
    }
    
    patchAudioEngine (patchOps) {
      Log.info(patchOps, 'Patch ops')
      // AudioEngineStore.sendMessage(patchOps)
    }
    patchProjectData (projectData) {
      UserStore.patchProjectData(projectData)
    }
    
    patchUserCustoms (customs) {
      UserStore.patchCustoms(customs)
    }

    patchUserLayouts (layouts) {
      UserStore.patchLayouts(layouts)
    }
}

export default new ProjectStore()
