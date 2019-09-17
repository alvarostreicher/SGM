import { app, BrowserWindow, IpcMain, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
const DB = require('nedb-async').default;
const XLSX = require('xlsx');
const nodeMailer = require('nodemailer');


let win;
let dateCycle, adminEmail, rangoFechas, maestros, transporter;
let getYear = new Date().getFullYear();
/* Creates the database */
const dbFactory = new DB({
  filename: 'database.db',
  autoload: true
});

/*
  Check if database is empty and if is, populate it
*/
const dataInDBExist = async () => {
  const newObj = {
    maestros: [],
    materias: [],
    ciclos: [],
    ciclosindex: [],
    cicleEvaluated: [],
    fechasEvaluacion: {
      eneJun: [],
      agoDic: []
    },
    settings: {
      adminEmail: '',
      adminPassword: '',
      inicioEneJun: new Date('01-12-' + getYear),
      finEneJun: new Date('06-12-' + getYear),
      inicioAgoDic: new Date('08-14-' + getYear),
      finAgoDic: new Date('12-12-' + getYear),
      rangoFechas: 2
    }
  };
  const isEmtpy = await dbFactory.asyncFind({});
  if (isEmtpy.length === 0) {
    await dbFactory.asyncInsert(newObj);
  }
};
dataInDBExist();
/* Get the global id crated for the database */
let global;
/* Checks if the first screen on open should be cycle creation */
ipcMain.on('cycleStartScreen', async (event, arg) => {
  const [value] = await dbFactory.asyncFind({});
  if (value.ciclos.length === 0) {
    event.returnValue = true;
  } else {
    event.returnValue = false;
  }
  global = value;
  /* execute SMFTP Service */
  initializedSMFTP();
});
/* On ready creates the window */
app.on('ready', createWindow);
/* On activate call the create function window */
app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
})
/* On close all windows quit the app */
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
    // url.format({
    //   pathname: path.join(__dirname, `/../../dist/SGM/index.html`),
    //   protocol: 'file:',
    //   slashes: true,
    // })
    'http://localhost:4200/'
  );
  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });
}
/* If the app is already loaded it show the window */
ipcMain.on('load', (event, arg) => {
  win.show();
});
/* Send the cycle object and insert it in database ciclos propertie */
ipcMain.on('sendCycle', (event, arg) => {
  const { cycle } = arg;
  if (cycle !== '') {
    dateCycle = cycle;
  }
  event.returnValue = 'success';
});
/* Saves admin email on admin email variable */
ipcMain.on('adminEmail', (event, arg) => {
  const email = arg;
  if (email !== '') {
    adminEmail = email;
    event.returnValue = true;
  } else {
    event.returnValue = false;
  }
});

/* initialized smftp */
const initializedSMFTP = () => {
  if (global['settings']['adminEmail'] !== '' && global['settings']['adminPassword'] !== '') {
    transporter = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        user: global['settings']['adminEmail'],
        pass: global['settings']['adminPassword']
      }
    });
  }
}

/* Function that insert admin email to the database */
const saveAdminEmail = (email) => {
  if (email) {
    dbFactory.update({ _id: global['_id'] }, { $set: { "settings.adminEmail": email.email } }, (err, newDoc) => console.log('email error', err));
    dbFactory.update({ _id: global['_id'] }, { $set: { "settings.adminPassword": email.pass } }, (err, newDoc) => console.log('password error', err));
  }
};
/* Function that creates the range of dates for teachers to send evaluation plan every two weeks by default */
const createDateRanges = () => {
  let ranges = [];
  let size = global['settings']['rangoFechas'] * 7;
  if (dateCycle.includes('Agosto/Diciembre')) {
    let inicio = new Date(global['settings']['inicioAgoDic']);
    let [year] = dateCycle.match(/\d+/g)
    inicio.setFullYear(year);
    let fin = new Date(global['settings']['finAgoDic']);
    fin.setFullYear(year);
    let range = new Date(inicio.setDate(inicio.getDate() + size));
    ranges.push(new Date(range));
    while (range.getTime() < fin.getTime()) {
      range = new Date(range.setDate(range.getDate() + size));
      ranges.push(new Date(range));
    }
    ranges.pop();
    // tslint:disable-next-line: max-line-length
    dbFactory.update({ _id: global['_id'] }, { $set: { "fechasEvaluacion.agoDic": ranges } }, (err, newDoc) => console.log('Rango Fechas ago/dic error', err));
  } else if (dateCycle.includes('Enero/Junio')) {
    let inicio = new Date(global['settings']['inicioEneJun']);
    let [year] = dateCycle.match(/\d+/g)
    inicio.setFullYear(year);
    let fin = new Date(global['settings']['finEneJun']);
    fin.setFullYear(year);
    let range = new Date(inicio.setDate(inicio.getDate() + size));
    ranges.push(new Date(range));
    while (range.getTime() < fin.getTime()) {
      range = new Date(range.setDate(range.getDate() + size));
      ranges.push(new Date(range));
    }
    ranges.pop();
    // tslint:disable-next-line: max-line-length
    dbFactory.update({ _id: global['_id'] }, { $set: { "fechasEvaluacion.eneJun": ranges } }, (err, newDoc) => console.log('Rango Fechas ene/jun error', err));
  }
  if (ranges.length > 0) {
    return ranges;
  }
}
/* Set maestros externalID to verify if exist or not */
const getMaestros = () => {
  if (global['maestros'].length > 0) {
    global['maestros'].map((value) => {
      maestros = new Set(value['externalId']);
    });
  } else {
    maestros = new Set();
  }
};

/* Take the Excel file and parse it to json also validate the header columns */
ipcMain.on('excel', (event, arg) => {
  try {
    if (arg && dateCycle) {
      // save maestros on a Set to verify if exist
      getMaestros();
      // saves admin email
      saveAdminEmail(adminEmail);
      // saves dates ranges for emails
      let ranges = createDateRanges();
      // cycle object to push over cycle databse using [datacycle]: [cycleobj]
      let cycleObj = [];
      // Maestros object to push over maestros database
      let maestrosObj = [];
      // Materias object to push over materias database
      let materiasObj = [];
      // temporal obj template
      let temporalObj = {
        maestro: {},
        materias: [],
        total: 0
      };
      // reads the excel file from a binary source
      const workbook = XLSX.read(arg, { type: 'binary' });
      // saves the sheet excel name
      const sheetName = workbook.SheetNames;
      // convert sheet binary to JSON starting the third row as column data for JSON properties
      let sheetToJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName[0]], { range: 3 });
      // iterates through JSON object to save data on the database;
      sheetToJson.map((values) => {
        // check if the propertie name exists and is string type
        if (typeof values.Nombre === 'string') {
          let splitting = values.Nombre.split(' ');
          let slicing = splitting.slice(3, splitting.length);
          temporalObj['maestro'] = { 'Nombre': slicing.join(' ') };
          const trimming = values.Nombre.match(/\[(.*?)\]/g);
          temporalObj['maestro']['externalId'] = trimming[1].replace('[', '').replace(']', '');
          temporalObj['maestro']['visible'] = true;
          temporalObj['maestro']['email'] = '';
          // Check if email exist and added to the object
        } else if (values.Correo) {
          temporalObj['maestro']['email'] = values.correo;
          // Check if theres no empty object and the properties dont have name
        } else if ((Object.entries(values).length > 0 && values.Nombre === undefined)) {
          let evaluaciones = [];
          for (let i = 0; i < ranges.length; i = i + 1) {
            evaluaciones.push({ value: null, evaluated: null });
          }
          const evaluacionProperty = Object.assign(values, { evaluacion: evaluaciones });
          temporalObj['materias'].push(evaluacionProperty);
          // Check if the type of property Nombre is number
        } else if (typeof values.Nombre === 'number') {
          temporalObj.total = values.Nombre;
          if (!maestros.has(temporalObj['maestro'['externalId']])) {
            dbFactory.update({ _id: global['_id'] }, { $push: { maestros: temporalObj } });
          }
          cycleObj.push(temporalObj);
          temporalObj = {
            maestro: '',
            materias: [],
            total: 0
          };
        } else {
          console.log('im failing filtering values');
          // if doesnt had any of the properties it will fail
          event.returnValue = false;
        }
      });
      //if cycles object is populated insert to database ciclos
      if (cycleObj.length > 0) {
        dbFactory.update({ _id: global['_id'] }, { $push: { ciclosindex: dateCycle } }, (err, newDoc) => console.log(err));
        dbFactory.update({ _id: global['_id'] }, { $push: { cicleEvaluated: { [dateCycle]: [] } } }, (err, newDoc) => { console.log('error creating evaluation cycle') });
        dbFactory.update({ _id: global['_id'] }, { $push: { ciclos: { [dateCycle]: cycleObj } } }, (err, newDoc) => {
          console.log('error updating cycles', err);
          // console.log('new doc', newDoc);
        });
      }
    }
    event.returnValue = true;
  } catch (e) {
    console.log('error on lecture', e)
    event.returnValue = false;
  }
});

ipcMain.on('getOnlyCycles', async (event, arg) => {
  event.returnValue = await dbFactory.asyncFind({});
});

ipcMain.on('saveCycleDataToDB', async (event, arg) => {
  const temporal = await dbFactory.update({ _id: global['_id'] }, { $set: { ciclos: arg } }, (err, num, newDoc) => {
    console.log('error saving cicle', err);
    if (!err) {
      event.returnValue = newDoc;
    }
  });
});

ipcMain.on('saveCycleEvaluation', async (event, arg) => {
  await dbFactory.asyncUpdate({ _id: global['_id'] }, { $set: { cicleEvaluated: arg } });
  event.returnValue = true;
});

ipcMain.on('saveEmail', async (event, arg) => {
  await dbFactory.asyncUpdate({ _id: global['_id'] }, { $set: { maestros: arg } });
  event.returnValue = true;
});

ipcMain.on('isVisible', async (event, arg) => {
  await dbFactory.asyncUpdate({ _id: global['_id'] }, { $set: { maestros: arg.maestros } });
  await dbFactory.asyncUpdate({ _id: global['_id'] }, { $set: { ciclos: arg.cycleData['ciclos'] } });
  event.returnValue = true;
});

ipcMain.on('sendEmail', (event, arg) => {
  const mailOptions = {
    from: global['settings']['adminEmail'], // sender address
    to: global['settings']['adminEmail'], // list of receivers
    subject: 'this is a test', // Subject line
    html: '<p>Your html here</p>'// plain text body
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err)
      event.reply('onEmailCallBack', err);
      event.preventDefault();
    } else {
      event.reply('onEmailCallBack', info);
      event.preventDefault();
    }
  });
  event.returnValue = true;
});