import {
  observable,
  action,
  computed
} from 'mobx'

// nodejs connections
import api from '../utils/api'

class DirectoryStore {
    @observable samples;

    constructor () {
      // this.getDirectory()
    }

    @action readFile (file) {
      api.post('http://localhost:3001/readfile', {
        file: file
      })
        .then((response) => {
          if (response.status === 200) {
            this.samples = response.data.audiofile
          } else {
            console.log(' ## Directory failed.')
          }
        }).catch(function (error) {
          console.error(' ## Server errors: ', error)
        })
    }

    @action getDirectory () {
      console.log('Get Directory')
      api.post('http://localhost:3001/directory_init')
        .then((response) => {
          if (response.status === 200) {
            this.samples = response.data.fileobj
          } else {
            console.log(' ## Directory failed.')
          }
        }).catch(function (error) {
          console.error(' ## Server errors: ', error)
        })
    }
}

export default new DirectoryStore()
