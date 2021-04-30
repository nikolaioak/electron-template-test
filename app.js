// Modules
const {app, BrowserWindow, dialog, ipcMain} = require('electron')
const isDev = require('electron-is-dev')
const { autoUpdater } = require('electron-updater')
const updater = require('./updater.js')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function sendStatusToWindow(text) {
  mainWindow.webContents.send('message', text)
}

ipcMain.on('vrequest', e => {
  sendStatusToWindow(`${app.getVersion()}`)
})

// Create a new BrowserWindow when `app` is ready
function createWindow () {
  
    // check for app updates
    setTimeout(updater, 3000)

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