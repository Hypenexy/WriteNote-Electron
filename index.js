//TODO:
//Upgrade the installation with that inno program
//https://www.electronjs.org/docs/latest/tutorial/tutorial-packaging

const { app, BrowserWindow, Menu, Tray, ipcMain, nativeTheme } = require('electron')
// app.commandLine.appendSwitch('--disable-features=SameSiteByDefaultCookies')
// const EventEmitter = require('events')
const path = require('path')

var splash;
var win;
// const loadingEvents = new EventEmitter()
function createWindow () {
	splash = new BrowserWindow({width: 512, height: 512, transparent: true, frame: false, alwaysOnTop: true, center: true, icon: __dirname + '/favicon.ico'});
	splash.loadFile('loadAnimation/index.html');
	
	win = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
			worldSafeExecuteJavaScript: true,
			contextIsolation: true,
			preload: path.join(__dirname, "electronEvents.js")
		},

    titleBarStyle: 'hidden',
    // titleBarOverlay: {
    //   color: '#1a1a1a',
    //   symbolColor: '#c8c8c8',
    //   height: 60
    // },
    // transparent: true,
    frame: false,
    maximizable: true,

		width: 946,
		height: 633,
		show: false,
		// backgroundColor: '#000',
		icon: __dirname + '/favicon.ico'
	})
	// win.removeMenu()
  
  disableDragRegionRightMenu(win);
	  
	win.loadFile('WriteNote/App/index.html')

	win.once('ready-to-show', () => {
		splash.destroy();
		win.show();
	});
  
  win.webContents.once('dom-ready', () => {
    headerCode = `loadHeader(true)`;
    win.webContents.executeJavaScript(headerCode);
    win.transparent = false;
  });
}

const electronIpcMain = require('electron').ipcMain;

electronIpcMain.on('window:minimize', () => {
  // Now we can access the window variable
  win.minimize();
})

electronIpcMain.on('window:maximize', () => {
  // Now we can access the window variable
  win.maximize();
})

electronIpcMain.on('window:restore', () => {
  // Now we can access the window variable
  win.restore();
})

electronIpcMain.on('window:close', () => {
  // Now we can access the window variable
  win.close();
})

function disableDragRegionRightMenu(win) {
  if (process.platform !== 'win32') return

  const WM_INITMENU = 0x0116 // WM_INITMENU
  if (!win.isWindowMessageHooked(WM_INITMENU)) {
    win.hookWindowMessage(WM_INITMENU, (wParam, lParam) => {
      // disable the window menu when right click on the title bar
      win.setEnabled(false)
      setTimeout(() => {
        win.setEnabled(true)
      }, 50)
    })
  }
}


app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
    }
  })
  win.webContents.on('did-finish-load', function() {
    win.webContents.executeJavaScript("isApp = true")
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

//Discord Rich Presence
// require('dotenv').config()
// const client = require('discord-rich-presence')(process.env.discordKey);
// const timeLaunched = Date.now();
 
// function discordStatus(text, subtext){
// 	if(subtext){
// 		client.updatePresence({
// 		  details: text,
// 		  largeImageKey: "writenotets",
// 		  state: subtext,
// 		  startTimestamp: timeLaunched,
// 		  instance: true
// 		});
// 	}
// 	else{
// 		client.updatePresence({
// 		  details: text,
// 		  largeImageKey: "writenotets",
// 		  instance: true
// 		});
// 	}
// }

// discordStatus("Looking at their library");

// ipcMain.on('request-mainprocess-action', (event, arg) => {
//   discordStatus(arg.message, arg.message2);
// });
//

//tray
var Registry = require('winreg');

async function isUsedSystemLightTheme() {
  const reg = new Registry({
    hive: Registry.HKCU,
    key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize',
  });
  return new Promise((resolve) => reg.get('SystemUsesLightTheme', (err, item) => {
    if (!err) return resolve(item.value === '0x1');
    resolve(false);
  }));
}

let tray = null,
  trayWindow;
app.whenReady().then(() => {
  tray = new Tray(__dirname + '/images/wnTrayDark.png');
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open', click: () => win.webContents.executeJavaScript('openSidepanel("open")') },
    { label: 'Save', click: () => win.webContents.executeJavaScript('SaveFile()') },
    { type: 'separator' },
    { label: 'About', click: () => win.webContents.executeJavaScript('showSettings("About")') },
    { type: 'separator' },
	  { label: 'Exit', click: () => app.exit(0) },
    // { Submenu examples
    //   label: 'Edit',
    //   submenu: [
    //     { role: 'undo' },
    //     { role: 'redo' },
    //     { type: 'separator' },
    //     { role: 'cut' },
    //     { role: 'copy' },
    //     { role: 'paste' },
    //     { role: 'selectAll' },
    //     { type: 'separator' },
    //     {
    //       label: 'Speech',
    //       submenu: [
    //         { role: 'startSpeaking' },
    //         { role: 'stopSpeaking' }
    //       ]
    //     }
    //   ]
    // },
  ])
  tray.setToolTip('WriteNote')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => app.focus());
  
	trayWindow = new BrowserWindow({width: 200, height: 350, transparent: false, frame: false, alwaysOnTop: true, center: false, icon: __dirname + '/favicon.ico'});
	trayWindow.loadFile('tray/index.html');
  // tray.show();


  // app.on('balloon-click', () => { i genually don't know what this does or used to do
  //     tray.removeBalloon()
  // })

  function updateTrayIcon(isDarkTheme){
    if(isDarkTheme==true){
      tray.setImage(__dirname + '/images/wnTrayDark.png');
    }
    else{
      tray.setImage(__dirname + '/images/wnTrayLight.png');
    }
  }

  nativeTheme.on('updated', () => isUsedSystemLightTheme().then(function(result){
    updateTrayIcon(result)
  }));

  isUsedSystemLightTheme().then(function(result){
    updateTrayIcon(result)
  });
});



//

//windos-taskbar

app.setUserTasks([
  {
    program: process.execPath,
    arguments: '--new-window',
    iconPath: process.execPath,
    iconIndex: 0,
    title: 'New Window',
    description: 'Create a new window'
  }
])


//


// Some miscellaneous code!

// app.whenReady().then(() => {
//   const { Notification } = require("electron");

//   const NOTIFICATION_TITLE = "You've started it up";
//   const NOTIFICATION_BODY = "Welcome to your new text editor!";
  
//   new Notification({
//     title: NOTIFICATION_TITLE,
//     body: NOTIFICATION_BODY,
//   }).show();
// })
// app.whenReady().then(() => {
//   const INCREMENT = 0.03
//   const INTERVAL_DELAY = 100 // ms

//   let c = 0
//   progressInterval = setInterval(() => {
//     // update progress bar to next value
//     // values between 0 and 1 will show progress, >1 will show indeterminate or stick at 100%
//     win.setProgressBar(c)

//     // increment or reset progress bar
//     if (c < 2) {
//       c += INCREMENT
//     } else {
//       c = (-INCREMENT * 5) // reset to a bit less than 0 to show reset state
//     }
//   }, INTERVAL_DELAY)
// })