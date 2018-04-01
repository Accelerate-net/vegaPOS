const ipc = require('electron').ipcRenderer;

function sendToPrinter(kot, targetPrinters){
  console.log('Printing... on '+targetPrinters)
  ipc.send('print-to-pdf');
}