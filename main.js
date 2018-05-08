const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

/*
  PRINTER
*/
const fs = require('fs')
const os = require('os')
const ipc = electron.ipcMain;
const shell = electron.shell;



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow(
    {
      width: 1080,
      minWidth: 680,
      height: 840,
      title: app.getName()
    })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))



  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}




// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

/* Printer Processes */
ipc.on('print-to-pdf', function(event){

  var pageSettings = {
    'marginsType': 1, //No Margin
    'printBackground': true, 
    'pageSize': {
      "height": 297000,
      "width": 72000
    }
  }


  const pdfPath = path.join(os.tmpdir(), 'print.pdf')
  const win =   new BrowserWindow({width: 800, height: 1500});

  win.loadURL(url.format({
    pathname: path.join(__dirname+'/templates', 'kot.html'),
    protocol: 'file:',
    slashes: true
  }));

setTimeout(function(){ 

  win.webContents.printToPDF(pageSettings, function(error, data){
    if(error){
      console.log(error.message)
      return
    }
    else{
      fs.writeFile(pdfPath, data, function(err){
        if(err){
          console.log(error.message)
          return
        }
        else{
          shell.openExternal('file://'+pdfPath);
          event.sender.send('wrote-pdf', pdfPath);
        }
      })

    }
  });


}, 3000);



});

