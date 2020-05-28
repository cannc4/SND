import { observable, action, reaction, computed } from 'mobx'

class TokenStore {
  @observable appName = 'CLAWHammer'

  @observable token = window.localStorage.getItem('jwt')

  @observable appLoaded = false

  @observable tags = []

  @observable isLoadingTags = false

  constructor () {
    reaction(
      () => this.token,
      token => {
        if (token) {
          window.localStorage.setItem('jwt', token)
        } else {
          window.localStorage.removeItem('jwt')
        }
      }
    )
  }

  @action setToken (token) {
    this.token = token
  }

  @computed get getToken () {
    return this.token
  }

  @action setAppLoaded () {
    this.appLoaded = true
  }
}

export default new TokenStore()
