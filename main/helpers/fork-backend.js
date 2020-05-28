
const { fork } = require('child_process')
const { app } = require('electron')
const path = require('path')

function forkBackend () {
  return new Promise((resolve) => {
    let workerProcess
    const handleReady = (message) => {
      if (message === 'ready') {
        console.log('Ready:', message)
        workerProcess.removeListener('message', handleReady)
        resolve(workerProcess)
      }
    }

    workerProcess = fork(path.join(__dirname, '../../backend'))
    workerProcess.on('message', handleReady)
    workerProcess.on('exit', (code) => {
      console.log(code)
      if (code !== 0 && code !== null) {
        throw new Error(
          `Backend thread unexpectedly exited with code ${code}.`
        )
      }
    })

    workerProcess.send({
      event: 'init',
      dataDir: app.getPath('userData')
    })
  })
}

module.exports = forkBackend
