const electron = require('electron')
// Module to control application life.
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const { Menu } = require('electron')
const { dialog } = require('electron')

app.showExitPrompt = true

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
let workerWindow //Printer Preview Window

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




    workerWindow = new BrowserWindow({show : false});
    workerWindow.loadURL("file://" + __dirname + "/templates/print-template.html");
    // workerWindow.hide();
    workerWindow.webContents.openDevTools();
    workerWindow.on("closed", () => {
        workerWindow = null;
    });

    workerWindow.hide();


// const execFile = require('child_process').execFile;
// const child = execFile('couchdb', ['--version'], (error, stdout, stderr) => {
//     if (error) {
//         console.error('stderr', stderr);
//         throw error;
//     }
//     console.log('stdout', stdout);
// });


  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  //Full Screen
  mainWindow.setFullScreen(true)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    workerWindow.close(); //Close WorkerWindow as well

  })



  //Do not close warning for PRINTER Window
  workerWindow.on('close', (e) => {
    if (app.showExitPrompt && mainWindow != null) {
        e.preventDefault() // Prevents the window from closing 
        dialog.showMessageBox({
            type: 'question',
            buttons: ['Close Window','Keep Open'],
            title: 'Caution',
            message: 'Please do not Close this Window, Printing will be affected. Do you still want to Close?'
        }, function (response) {
            if (response === 0) { // Runs the following if 'Yes' is clicked
                app.showExitPrompt = false
                workerWindow.close()
            }
        })
    }
  })


}



//To retrieve printers list
let printerWindowContent = null;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function(){

    createWindow();

  // Create the Application's main menu
  const template = [
    {
        label: app.getName(),
        submenu: [
            { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
            { type: "separator" },
            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]
    },

    {
      label: 'Edit',
      submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
      ]
    },
    {
      label: 'View',
      submenu: [
        {role: 'reload'},
        {role: 'forcereload'},
        {type: 'separator'},
        {role: 'togglefullscreen'}
      ]
    },
    {
      role: 'window',
      submenu: [
        {role: 'minimize'},
        {role: 'close'}
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click () { shell.openExternal('https://www.accelerate.net.in/vega/docs') }
        },
        { label: "Team Accelerate", click() { shell.openExternal('https://www.accelerate.net.in') } }
      ]
    }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));


})

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


/* Printer Processes */

// retransmit it to workerWindow
ipc.on("printBillDocument", (event, content, printer_list) => {

    if(!workerWindow){
      alert('Error CLOSED.')
      return '';
    }
    workerWindow.webContents.send("printBillDocument", content, printer_list);
});

// when worker window is ready
ipc.on("readyToPrintBillDocument", (event, printer_list) => {

    const pdfPath = path.join(os.tmpdir(), 'print.pdf');

    // var pageSettingsSilent = {
    //   'marginsType': 1, //No Margin
    //   'printBackground': true, 
    //   'pageSize': {
    //     "height": 297000,
    //     "width": 72000
    //   },
    //   'silent': true
    // }


    var pageSettingsSilent = printer_list[0].settings;

    // workerWindow.webContents.printToPDF(pageSettingsSilent, function (error, data) {
    //     if (error) throw error
    //     fs.writeFile(pdfPath, data, function (error) {
    //         if (error) {
    //             throw error
    //         }
    //         shell.openItem(pdfPath)
    //         event.sender.send('wrote-pdf', pdfPath)
    //     })
    // })

    workerWindow.webContents.print(pageSettingsSilent,  function (error, data) {
        if (error) throw error
    })
});




/* Get Printers List */
ipc.on('getMeAllPrinters', function(event, optionalRequest){
  printerWindowContent = workerWindow.webContents;
  var printerList = printerWindowContent.getPrinters();
  mainWindow.webContents.send('all-printers-list', printerList, optionalRequest);
});


/* PDF Report Generator */
ipc.on('generatePDFReportA4', function(event, html_content, report_title){

  if(!html_content || html_content == ''){
    console.log('Error: No Content to Print');
    return '';
  }

  var pageSettings = {
    'marginsType': 1, //No Margin
    'printBackground': true
  }


  const pdfPath = path.join(os.tmpdir(), report_title+'.pdf')
  const win = new BrowserWindow({show : false, width: 800, height: 600});
  win.hide();
  win.loadURL("data:text/html;charset=utf-8," + encodeURI(html_content));

  win.webContents.on('did-finish-load', () => {

      win.webContents.printToPDF(pageSettings, (error, data) => {
      
        if(error){
          return ''
        }
        else{
          fs.writeFile(pdfPath, data, function(error){
            if(error){
              return '';
            }
            else{
                shell.openExternal('file://'+pdfPath);
                win.close();
                win == null;
            }
          })
        }

      })
  })

});





/* PDF Report Printer */
ipc.on('printSmallReport', function(event, html_content, selected_printers){

  if(!html_content || html_content == ''){
    console.log('Error: No Content to Print');
    return '';
  }

    // var pageSettingsSilent = {
    //   'marginsType': 1, //No Margin
    //   'printBackground': true, 
    //   'pageSize': {
    //     "height": 297000,
    //     "width": 72000
    //   },
    //   'silent': true
    // }

  var pageSettingsSilent = selected_printers[0].settings;

  if(!pageSettingsSilent || pageSettingsSilent == [] || pageSettingsSilent == null){
    alert('Print Error: No printers found.');
    return '';
  }

  //const pdfPath = path.join(os.tmpdir(), 'print.pdf')
  const win = new BrowserWindow({show : false, width: 800, height: 600});
  win.hide();
  win.loadURL("data:text/html;charset=utf-8," + encodeURI(html_content));

  win.webContents.on('did-finish-load', () => {

    win.webContents.print(pageSettingsSilent,  function (error, data) {
        if (error) throw error
    })

      // win.webContents.printToPDF(pageSettingsSilent, (error, data) => {
      
      //   if(error){
      //     return ''
      //   }
      //   else{
      //     fs.writeFile(pdfPath, data, function(error){
      //       if(error){
      //         return '';
      //       }
      //       else{
      //           shell.openExternal('file://'+pdfPath);
      //           win.close();
      //           win == null;
      //       }
      //     })
      //   }
      // })

      
  })

});

