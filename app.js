// Modules
const {app, BrowserWindow, dialog, ipcMain} = require('electron')
const isDev = require('electron-is-dev')
const { autoUpdater } = require('electron-updater')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function sendStatusToWindow(text) {
  mainWindow.webContents.send('message', text)
}

// Create a new BrowserWindow when `app` is ready
function createWindow () {
  
    // check for app updates
    setTimeout(updater(), 3000)

    mainWindow = new BrowserWindow({
      minWidth: 900, maxWidth: 1366, minHeight: 600,
      show: false, frame: true,
      webPreferences: { 
        nodeIntegration: true,
        enableRemoteModule: true,
        worldSafeExecuteJavaScript: true
      }
    })
    
    // show window once ready
    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
        // Pass App Version to main.html
        sendStatusToWindow(`${app.getVersion()}`)
    })

    // Load main.html into the new BrowserWindow
    mainWindow.loadFile('renderer/index.html')

    // Open DevTools
    if (isDev) {
      mainWindow.webContents.openDevTools()
    }
  
    // Listen for window being closed
    mainWindow.on('closed',  () => {
      mainWindow = null
    })
}

// force renderer process reuse to false
app.allowRendererProcessReuse = false

// Electron `app` is ready
app.on('ready', createWindow)

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})

// Configure log debugging
autoUpdater.logger = require('electron-log')
autoUpdater.logger.transports.file.level = "debug"

// disable auto downloading of updates
autoUpdater.autoDownload = false

let updater = () => {
  if (isDev) {
    // do nothing
  } else {
      // check for updates from the remote server
      autoUpdater.checkForUpdates()

      // listen for update found
      autoUpdater.on('update-available', () => {
          autoUpdater.downloadUpdate()
      })

      // listen for download ready
      autoUpdater.on('update-downloaded', () => {
          // prompt user to update
          dialog.showMessageBox({
              type: 'info',
              title: 'Update Available',
              message: 'A new version of aSAP is available and will be installed.',
              buttons: ['Update']
          }).then(result => {
              let buttonIndex = result.response
              // if update selected, start download
              if (buttonIndex === 0) {
                  autoUpdater.quitAndInstall(true,true)
              }
          })
          
      })
  }
}