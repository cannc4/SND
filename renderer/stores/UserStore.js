import { observable, action, computed, toJS } from 'mobx'
import TokenStore from './TokenStore'
import ProjectStore from './ProjectStore'
import TrackStore from './TrackStore'
import api from '../utils/api'
import { request } from '../utils/request'

class UserStore {
  @observable inProgress = false

  @observable errors = undefined

  @observable currentUser = undefined

  @observable loadingUser

  @observable updatingUser

  @observable updatingUserErrors

  @observable values = {
    username: '',
    email: '',
    password: ''
  };

  @computed get getCurrentUser () {
    return this.currentUser
  }

  @action setUsername (username) {
    this.values.username = username
  }

  @action setEmail (email) {
    this.values.email = email
  }

  @action setPassword (password) {
    this.values.password = password
  }

  @action reset () {
    this.values.username = ''
    this.values.email = ''
    this.values.password = ''
  }

  @action pullUser () {
    const accessToken = TokenStore.getToken
    return api.post('/authentication', { strategy: 'jwt', accessToken })
      .then(action(response => {
        console.log(response)
        this.inProgress = false
        this.currentUser = response.data.user
        if (response.data.user.projectData &&
          response.data.user.projectData.length > 0) {
          ProjectStore.loadProjectData(response.data.user.projectData) 
          
        }
      }))
      .catch(error => {
        if (error.response.status === 401) {
          // unauthenticated
        }
        return Promise.reject(error)
      })
  }

  @action login () {
    this.inProgress = true
    this.errors = undefined

    return api.post('/authentication', { email: this.values.email, password: this.values.password, strategy: 'local' })
      .then((response) => {
        TokenStore.setToken(response.data.accessToken)
        this.currentUser = response.data.user
        this.inProgress = false
        ProjectStore.loadProjectData(this.currentUser.projectData)        
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors
        return Promise.reject(err)
      }))
  }

  @action patchProjectData (projectData) {
    const data = projectData
    const config = {
      headers: {
        Authorization: 'Bearer ' + TokenStore.getToken,
        'Content-Type': 'application/json'
      }
    }
    const user = this.currentUser
    const projectDataId = user.activeProjectDataId
    return api.patch(`/project-data/${projectDataId}`, data, config)
      .then((response) => {
        console.log('[UserStore] save: ', response.data)
      })
      .catch((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors
        throw err
      })
  }

  @action patchLayouts (layouts) {
    const data = {
      layouts: layouts
    }
    const config = {
      headers: {
        Authorization: 'Bearer ' + TokenStore.getToken,
        'Content-Type': 'application/json'
      }
    }
    const user = this.currentUser
    return api.patch(`/users/${user._id}`, data, config)
      .then((response) => {
        // console.log(`Layouts patch response ${response}`)
      })
      .catch((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors
        throw err
      })
  }

  @action patchCustoms (customs) {
    const data = {
      customs: customs
    }
    const config = {
      headers: {
        Authorization: 'Bearer ' + TokenStore.getToken,
        'Content-Type': 'application/json'
      }
    }
    const user = this.currentUser
    return api.patch(`/users/${user._id}`, data, config)
      .then((response) => {
        // console.log(`Customs patch response ${response}`)
      })
      .catch((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors
        throw err
      })
  }

  @action register () {
    this.inProgress = true
    this.errors = undefined
    return api.post('/users', { email: this.values.email, password: this.values.password })
      .then(r => {
        return api.post('/authentication', { email: this.values.email, password: this.values.password, strategy: 'local' })
          .then(response => {
            this.currentUser = response.data.user
            this.inProgress = false
            TokenStore.setToken(response.data.accessToken)
            ProjectStore.loadProjectData(this.currentUser.projectData)
            let userData = { jwt: response.data.accessToken, 
                             email: this.values.email, 
                             projectData: this.currentUser.projectData[0]
                           }
            return request('set-user', userData)
          })
          .catch(e => {
            console.log(e)
          })
      })
  }

  @action logout () {
    TokenStore.setToken(undefined)
    TrackStore.clear()
    this.currentUser = undefined
    return Promise.resolve()
  }
}

export default new UserStore()
