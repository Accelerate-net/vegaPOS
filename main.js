const electron = require('electron')
// Module to control application life.
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const { Menu } = require('electron')
const { dialog } = require('electron')

app.showExitPrompt = true


const fs = require('fs')
const os = require('os')
const ipc = electron.ipcMain;
const shell = electron.shell;

let mainWindow
let workerWindow //Printer Preview Window

function createWindow () {

      //To get the Computer's resolution
    const screen = require('electron').screen;
    const display = screen.getPrimaryDisplay();
    const area = display.workArea;

    mainWindow = new BrowserWindow(
      {
        width: area.width ? area.width : 1280,
        height: area.height ? area.height : 1024,
        icon: path.join(__dirname, '/assets/icons/png/64x64.png'),
        title: app.getName()
      })

    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))


    workerWindow = new BrowserWindow({show : false, icon: path.join(__dirname, '/assets/icons/png/64x64.png')});
    workerWindow.loadURL("file://" + __dirname + "/templates/print-template.html");
    
    workerWindow.on("closed", () => {
        workerWindow = null;
    });

    workerWindow.hide();

  //Full Screen
  //mainWindow.setFullScreen(true)
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null;

    if(workerWindow != null)
      workerWindow.close(); //Close WorkerWindow as well

  })

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

app.on('ready', function(){

  createWindow();

  // Create the Application's main menu
  const template = [
    {
        label: app.getName(),
        submenu: [
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
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})


/* Printer Processes */

// retransmit it to workerWindow
ipc.on("printBillDocument", (event, content, selected_printer) => {
    if(!workerWindow){
      alert('Error CLOSED.')
      return '';
    }
    workerWindow.webContents.send("printBillDocument", content, selected_printer);
});

// when worker window is ready
ipc.on("readyToPrintBillDocument", (event, selected_printer) => {
    var pageSettingsSilent = selected_printer.settings;
    pageSettingsSilent.deviceName = selected_printer.target;

    workerWindow.webContents.print(pageSettingsSilent);
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
ipc.on('printSmallReport', function(event, html_content, selected_printer){

  if(!html_content || html_content == ''){
    console.log('Error: No Content to Print');
    return '';
  }

  var pageSettingsSilent = selected_printer.settings;
  pageSettingsSilent.deviceName = selected_printer.target;

  if(!pageSettingsSilent || pageSettingsSilent == [] || pageSettingsSilent == null){
    alert('Print Error: No printers found.');
    return '';
  }

  const win = new BrowserWindow({show : false, width: 800, height: 600});
  win.hide();
  win.loadURL("data:text/html;charset=utf-8," + encodeURI(html_content));

  win.webContents.on('did-finish-load', () => {
    win.webContents.print(pageSettingsSilent)      
  })

});

