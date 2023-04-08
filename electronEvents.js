const { clipboard } = require('electron')

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

var isApp = true

window.addEventListener("load", function(){
    console.log("hiiii")
    var electronStyle = this.document.createElement("style")
    electronStyle.innerText = "header{-webkit-app-region: drag;padding-right: 140px} header *{-webkit-app-region: no-drag;}"
    this.document.head.appendChild(electronStyle)
})