require('hazardous')
const electron = require('electron')
const { app, dialog} = require('electron')
const { ipcMain: ipc } = require('electron-better-ipc')
const dotenv = require('dotenv')
const forkBackend = require('./helpers/fork-backend.js')
const createWindow = require('./helpers/create-window')
const path = require('path')
const url = require('url')
const { autoUpdater } = require('electron-updater')
const logger = require('electron-log')
const notifier = require('node-notifier')
const ProgressBar = require('electron-progressbar')
const sc = require('supercolliderjs')
dotenv.config()
const nodeEnv = process.env.NODE_ENV
let mainWindow, workerProcess, scLang
var appVersion = app.getVersion()
let updateAvailable = false

console.log(`App version ${appVersion}`)
autoUpdater.channel = 'latest'
autoUpdater.allowDowngrade = true

autoUpdater.autoInstallOnAppQuit = true 
autoUpdater.logger = logger
autoUpdater.logger.transports.file.level = 'silly'
autoUpdater.logger.transports.file.appName = 'snd'
autoUpdater.autoDownload = true

logger.info('Talon is starting...')

const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
}

autoUpdater.on('download-progress', (progressObj) => {
  
  let logMessage = 'Download speed: ' + progressObj.bytesPerSecond
  logMessage = logMessage + ' - Downloaded ' + progressObj.percent + '%'
  logMessage = logMessage + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
  sendStatusToWindow(logMessage)
  
  // progressBar
  //   .on('completed', function() {
  //     console.info(`completed...`)
  //     progressBar.detail = 'Task completed. Exiting...'
  //   })
  //   .on('aborted', function(value) {
  //     console.info(`aborted... ${value}`)
  //   })
  //   .on('progress', function(value) {
  //     progressBar.detail = value
  //   })
  //   progressBar.value = progressObj.transferred

    mainWindow.setProgressBar(progressObj.percent / 100)
})

function sendStatusToWindow(text) {
    logger.info(text)
    mainWindow.webContents.send('message', text)
}

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    message: 'update Downloaded !! restart to download'
  })
  autoUpdater.quitAndInstall()
})

autoUpdater.on('checking-for-update', () => {
  console.log('checking for updates')
})

autoUpdater.on('update-available', () => {
  updateAvailable = true
  notifier.notify({
    title: 'A new update available',
    message: 'Click to download'
  })
})

autoUpdater.on('error', (error) => {
  autoUpdater.logger.debug(error)
})


function createRendererWindow (workerProcess) {
  logger.transports.file.level = 'debug'
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  mainWindow = createWindow('main', {
    width: width,
    height: height,
    minWidth: 1000,
    minHeight: 600
  })
  delegateRequestEvents(workerProcess, 'to-worker')
  delegatePushEvents(workerProcess, mainWindow, 'to-renderer')

  if (nodeEnv === 'development') {
    mainWindow.loadURL(url.format({
      pathname: 'localhost:3000',
      protocol: 'http:',
      slashes: true
    }))
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadURL(url.format({
      pathname: path.join(path.resolve(__dirname, '../dist'), 'index.html'),
      protocol: 'file:',
      slashes: true
    }))
    // mainWindow.webContents.openDevTools()
  }
}


async function bootSclang() {
  const options = {
    debug: true,
    echo: true,
    sclang: vendor("./mac/SuperCollider/MacOS/sclang"),
    sclang_conf: null
  }
  try {
    scLang = await sc.lang.boot(options)
    await scLang.interpret('s.boot')
    setTimeout(() => {
      scLang.interpret('{ SinOsc.ar(200, 0, 0.5) }.play;')
      scLang.interpret('{ SinOsc.ar(400, 0, 0.5) }.play;')
      scLang.interpret('{ SinOsc.ar(600, 0, 0.5) }.play;')
      
    }, 5000);
    console.log("SuperCollider BOOTED")
  } catch(err) {
    console.error(err)
  }
}


async function sendRequest (workerProcess, { id: requestId, event, data, ...opts }) {
  if (!requestId || !event) {
    throw new Error('Malformed event received')
  }

  return new Promise((resolve) => {
    const handleResponse = ({ id: responseId, response, error }) => {
      if (requestId === responseId) {
        workerProcess.removeListener('message', handleResponse)
        resolve({ id: responseId, response, error })
      }
    }
    workerProcess.on('message', handleResponse)
    workerProcess.send({ id: requestId, event, data, ...opts })
  })
}

function delegateRequestEvents (workerProcess, eventName) {
  ipc.answerRenderer(
    eventName,
    async (event) => await sendRequest(workerProcess, event)
  )
}

function delegatePushEvents (workerProcess, rendererWindow, eventName) {
  const handlePush = ({ pushEvent }) => {
    if (!pushEvent || !pushEvent.event) {
      return
    }
    ipc.callRenderer(rendererWindow, eventName, pushEvent)
  }
  workerProcess.on('message', handlePush)
  return () => workerProcess.removeListener('message', handlePush)
}

function vendor(filepath) {
  return path.join(__dirname, "../vendor", filepath);
}


async function main () {
  await bootSclang()
  console.log('ENV:', nodeEnv)
  if (nodeEnv === 'development') {
    const webpack = require('webpack')
    const WebpackDevServer = require('webpack-dev-server')
    const webpackConfig = require('../webpack.config')

    const compiler = webpack(webpackConfig)
    const server = new WebpackDevServer(compiler, {
      stats: {
        colors: true
      }
    })
    server.listen(3001, '127.0.0.1', function () {
      console.log('Starting dev server on http://localhost:3001')
    })
  }

  workerProcess = await forkBackend()

  if (app.isReady()) {
    console.log('App is ready')
    await createRendererWindow(workerProcess)
    if(updateAvailable === true && nodeEnv !== 'development'){
      await autoUpdater.checkForUpdates()
      progressBar = new ProgressBar({
        title: 'Installer',
        text: 'Updating to a new version ...',
        browserWindow: {
                webPreferences: {
                    nodeIntegration: true
                }
            }
        })
    }
  } else {
    console.log('Still forking backend')
    app.on('ready', () => { 
      createRendererWindow(workerProcess)
      if(updateAvailable === true && nodeEnv !== 'development'){
            autoUpdater.checkForUpdates()
            progressBar = new ProgressBar({
            title: 'Installer',
            text: 'Updating to a new version ...',
            browserWindow: {
                    webPreferences: {
                        nodeIntegration: true
                    }
                }
            })
      }
    })
  }
}

app.setAsDefaultProtocolClient('clawhammer')

app.on('window-all-closed', () => {
  app.quit()
})

app.on('will-quit', () => {
  if (workerProcess) {
    workerProcess.kill('SIGHUP')
  }
  scLang.interpret('s.quit')
})

// Call the main function on setup
main()
