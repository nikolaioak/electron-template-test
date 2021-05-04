// Modules
const os = require('os')
const { ipcRenderer } = require('electron')

// DOM Node
let message = document.getElementById('message'),
 version = document.getElementById('version')

// Functions
setTimeout( () => {
    helloWorld()
    // send a request for the version number update
    ipcRenderer.send('vrequest')
}, 2000)

let helloWorld = () => {
    message.innerHTML = `Hello ${os.userInfo().username}, are you ready to learn Electron?`
    console.log('You can also display or test information here.')
}

// Listen for messages
ipcRenderer.on('message', (e, text) => {
    // load information into version field
    version.innerHTML = text
})