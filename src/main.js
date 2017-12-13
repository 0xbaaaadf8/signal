const electron = require("electron")
const { app, BrowserWindow, ipcMain } = electron

const { default: installExtension, REACT_DEVELOPER_TOOLS } = require("electron-devtools-installer")

let mainWindow

const baseUrl = process.env.ELECTRON_START_URL || "http://localhost:3000"

function installDevTools() {
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension: ${name}`))
    .catch((err) => console.log('An error occurred: ', err));
}

function createWindow() {
  installDevTools()

  mainWindow = new BrowserWindow({ width: 800, height: 600 })

  mainWindow.loadURL(baseUrl)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

app.commandLine.appendSwitch("disable-renderer-backgrounding")
app.on("ready", createWindow)

app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", function () {
  // On OS X it"fs common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

/**

  メインウィンドウからシンセのウィンドウにメッセージを送るために
  ipcMain を経由する

*/
let synthWindow

app.on("browser-window-created", (e, win) => {
  if (win.getTitle() === "synth") {
    synthWindow = win
  }
})

ipcMain.on("synth", (e, { type, payload }) => {
  if (!synthWindow) {
    return
  }
  synthWindow.webContents.send(type, payload)
})

ipcMain.on("main", (e, { type, payload }) => {
  if (!mainWindow) {
    return
  }
  mainWindow.webContents.send(type, payload)
})

ipcMain.on("create-synth", () => {
  // シンセのウィンドウを作成済みでなければ作る
  if (synthWindow) {
    // 作成済みなら終了時のメッセージをメインウィンドウに送る
    mainWindow.webContents.send("did-create-synth-window")
    return
  }
  const url = `${baseUrl}#synth`
  const win = new BrowserWindow({
    title: "synth",
    width: 375,
    height: 600,
    frame: false,
    show: false
  })
  win.loadURL(url)
  win.webContents.openDevTools()

  synthWindow = win
  win.on("closed", function () {
    synthWindow = null
  })
})

ipcMain.on("show-synth", () => {
  if (synthWindow) {
    synthWindow.show()
  }
})
