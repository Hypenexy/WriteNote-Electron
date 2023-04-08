const { clipboard } = require('electron')

// clipboard.writeText('hello i am a bit of text!')


function PasteElectron(){
    const text = clipboard.readText()
    console.log(text)
}

var isApp = true

window.addEventListener("load", function(){
    console.log("hiiii")
    var electronStyle = this.document.createElement("style")
    electronStyle.innerText = "header{-webkit-app-region: drag;padding-right: 140px} header *{-webkit-app-region: no-drag;}"
    this.document.head.appendChild(electronStyle)
})