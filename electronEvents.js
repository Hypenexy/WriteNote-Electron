const { clipboard } = require('electron')
const username = require("os").userInfo().username

// clipboard.writeText('hello i am a bit of text!')


// function PasteElectron(){
//     const text = clipboard.readText()
//     console.log(text)
// }

// const { contextBridge, ipcRenderer } = require('electron');
// // var Data = {message: "Looking at their library", message2: ""};
// // ipcRenderer.send('request-mainprocess-action', Data);

// const API = {
// 	sendMsg: function(msg) {
// 		ipcRenderer.send('request-mainprocess-action', {message: msg[0], message2: msg[1]})
// 	}
// };

// contextBridge.exposeToMainWorld("api", API);

// updateDiscordRichPresence("bruh", "whyyy");

// const { contextBridge, ipcRenderer } = require("electron");
// contextBridge.exposeInMainWorld("api", API);

// var isApp = true

window.addEventListener("load", function(){
    // console.log(username)
    // console.log("hiiii")
    // var electronStyle = this.document.createElement("style")
    // electronStyle.innerText = "header{-webkit-app-region: drag;padding-right: 140px} header *{-webkit-app-region: no-drag;}"
    // this.document.head.appendChild(electronStyle)
})

// Import the necessary Electron components.
const contextBridge = require('electron').contextBridge;
const ipcRenderer = require('electron').ipcRenderer;

// White-listed channels.
const ipc = {
    'render': {
        // From render to main.
        'send': [
            'window:minimize',
            'window:maximize',
            'window:restore',
            'window:close'
        ],
        // From main to render.
        'receive': [],
        // From render to main and back again.
        'sendReceive': []
    }
};

// Exposed protected methods in the render process.
contextBridge.exposeInMainWorld(
    // Allowed 'ipcRenderer' methods.
    'ipcRender', {
        // From render to main.
        send: (channel, args) => {
            let validChannels = ipc.render.send;
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, args);
            }
        },
        // From main to render.
        receive: (channel, listener) => {
            let validChannels = ipc.render.receive;
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`.
                ipcRenderer.on(channel, (event, ...args) => listener(...args));
            }
        },
        // From render to main and back again.
        invoke: (channel, args) => {
            let validChannels = ipc.render.sendReceive;
            if (validChannels.includes(channel)) {
                return ipcRenderer.invoke(channel, args);
            }
        }
    }
);
