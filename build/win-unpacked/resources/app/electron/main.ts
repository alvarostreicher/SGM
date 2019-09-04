import { app, BrowserWindow, IpcMain, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
const DB = require('nedb-async').default;
const XLSX = require('xlsx');


let win;

const dbFactory = new DB({
  filename: 'database.db',
  autoload: true
});

/*
  Check if database is empty and populate with propierties
*/
const dataInDBExist = async () => {
  const newObj = {
    maestros: [],
    materias: [],
    ciclos: []
  };
  const isEmtpy = await dbFactory.asyncFind({});
  if (isEmtpy.length === 0) {
    dbFactory.insert(newObj, (err, newDoc) => {
      console.log(newDoc)
    });
  }
};
dataInDBExist();

ipcMain.on('cycleStartScreen', async (event, arg) => {
  const [value] = await dbFactory.asyncFind({});
  if (value.ciclos.length === 0) {
    event.returnValue = true;
  }
});

let global;
async function getGloablId() {
  global = await dbFactory.asyncFind({});
}
getGloablId();
// async function getGloablId(){
//   global = await dbFactory.asyncFind({});
//   console.log(global);
//   // tslint:disable-next-line: no-string-literal
//   // console.log(global[0]['_id']);
//   // dbFactory.update({_id: global[0]['_id'] }, { $push: { ciclos: { 'agosto/diciembre/2019': [] } } }, (err, newDoc)=>{
//   //   console.log('error', err);
//   //   console.log('new doc', newDoc);
//   // })
// }

app.on('ready', createWindow);

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
})

app.on('window-all-closed', () => {
  app.quit();
})

function createWindow() {
  win = new BrowserWindow({
    show: false, webPreferences: {
      nodeIntegration: true
    }
  });
  win.maximize();
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/../../dist/SGM/index.html`),
      protocol: 'file:',
      slashes: true,
    })
    // 'http://localhost:4200/'
  );
  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });
}
//If the app is already loaded it show the window
ipcMain.on('load', (event, arg) => {
  win.show();
});
//Send the cycle object and insert it in database ciclos propertie
ipcMain.on('sendCycle', (event, arg) => {
  const { cycle } = arg;
  if (cycle !== '') {

  }
  event.returnValue = 'success';
});
// Take the Excel file and parse it to json also validate the header columns
ipcMain.on('excel', (event, arg) => {
  if (arg) {
    const workbook = XLSX.read(arg, {type: 'binary'});
    const sheetName = workbook.SheetNames;
    const sheetToJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName[0]], { range: 3, blankrows: true });
    console.log(sheetToJson)
  }
  event.returnValue = true;
})