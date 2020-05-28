const createDebug = require('debug')
const dotenv = require('dotenv')
const { handleRequest } = require('./handlers')
const projectStore = require('./stores/project-store')
const userStore = require('./stores/user-store')
const { setConfig } = require('./config')
const pushEvent = require('./pushEvent')

dotenv.config()

function initBackend () {
  createDebug.enable('backend*')
  const debug = createDebug('backend')
  const error = createDebug('backend:error')
  debug('Backend worker initializing')
  const processRequests = () =>
    process.on('message', async ({ id, event, data, progress }) => {
      try {
        const handleProgress = progress
          ? (progress) => pushEvent(`progress-${id}`, progress)
          : undefined

        process.send({ id, response: await handleRequest(event, data, handleProgress) })
      } catch (err) {
        error(`Error while handling request \`${event}\`:`, err)
        process.send({ id, error: err })
      }
    })

  const handleInit = ({ event, dataDir }) => {
    if (event === 'init') {
      process.removeListener('message', handleInit)
      setConfig({
        dataDir
      })

      projectStore.init()
      userStore.init()

      processRequests()
      process.send('ready')
    } else {
      console.error('Invalid message received, expected `init` event.')
    }
  }

  process.on('message', handleInit)
  process.on('exit', () => {
    debug('Background worker shutting down')
    // ProjectWatcher.unwatchAll();
  })
}

initBackend()
