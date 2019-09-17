"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var DB = require('nedb-async').default;
var XLSX = require('xlsx');
var nodeMailer = require('nodemailer');
var win;
var dateCycle, adminEmail, rangoFechas, maestros, transporter;
var getYear = new Date().getFullYear();
/* Creates the database */
var dbFactory = new DB({
    filename: 'database.db',
    autoload: true
});
/*
  Check if database is empty and if is, populate it
*/
var dataInDBExist = function () { return __awaiter(_this, void 0, void 0, function () {
    var newObj, isEmtpy;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                newObj = {
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
                return [4 /*yield*/, dbFactory.asyncFind({})];
            case 1:
                isEmtpy = _a.sent();
                if (!(isEmtpy.length === 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, dbFactory.asyncInsert(newObj)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
dataInDBExist();
/* Get the global id crated for the database */
var global;
/* Checks if the first screen on open should be cycle creation */
electron_1.ipcMain.on('cycleStartScreen', function (event, arg) { return __awaiter(_this, void 0, void 0, function () {
    var value;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbFactory.asyncFind({})];
            case 1:
                value = (_a.sent())[0];
                if (value.ciclos.length === 0) {
                    event.returnValue = true;
                }
                else {
                    event.returnValue = false;
                }
                global = value;
                /* execute SMFTP Service */
                initializedSMFTP();
                return [2 /*return*/];
        }
    });
}); });
/* On ready creates the window */
electron_1.app.on('ready', createWindow);
/* On activate call the create function window */
electron_1.app.on('activate', function () {
    if (win === null) {
        createWindow();
    }
});
/* On close all windows quit the app */
electron_1.app.on('window-all-closed', function () {
    electron_1.app.quit();
});
function createWindow() {
    win = new electron_1.BrowserWindow({
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
    'http://localhost:4200/');
    win.webContents.openDevTools();
    win.on('closed', function () {
        win = null;
    });
}
/* If the app is already loaded it show the window */
electron_1.ipcMain.on('load', function (event, arg) {
    win.show();
});
/* Send the cycle object and insert it in database ciclos propertie */
electron_1.ipcMain.on('sendCycle', function (event, arg) {
    var cycle = arg.cycle;
    if (cycle !== '') {
        dateCycle = cycle;
    }
    event.returnValue = 'success';
});
/* Saves admin email on admin email variable */
electron_1.ipcMain.on('adminEmail', function (event, arg) {
    var email = arg;
    if (email !== '') {
        adminEmail = email;
        event.returnValue = true;
    }
    else {
        event.returnValue = false;
    }
});
/* initialized smftp */
var initializedSMFTP = function () {
    if (global['settings']['adminEmail'] !== '' && global['settings']['adminPassword'] !== '') {
        transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: global['settings']['adminEmail'],
                pass: global['settings']['adminPassword']
            }
        });
    }
};
/* Function that insert admin email to the database */
var saveAdminEmail = function (email) {
    if (email) {
        dbFactory.update({ _id: global['_id'] }, { $set: { "settings.adminEmail": email.email } }, function (err, newDoc) { return console.log('email error', err); });
        dbFactory.update({ _id: global['_id'] }, { $set: { "settings.adminPassword": email.pass } }, function (err, newDoc) { return console.log('password error', err); });
    }
};
/* Function that creates the range of dates for teachers to send evaluation plan every two weeks by default */
var createDateRanges = function () {
    var ranges = [];
    var size = global['settings']['rangoFechas'] * 7;
    if (dateCycle.includes('Agosto/Diciembre')) {
        var inicio = new Date(global['settings']['inicioAgoDic']);
        var year = dateCycle.match(/\d+/g)[0];
        inicio.setFullYear(year);
        var fin = new Date(global['settings']['finAgoDic']);
        fin.setFullYear(year);
        var range = new Date(inicio.setDate(inicio.getDate() + size));
        ranges.push(new Date(range));
        while (range.getTime() < fin.getTime()) {
            range = new Date(range.setDate(range.getDate() + size));
            ranges.push(new Date(range));
        }
        ranges.pop();
        // tslint:disable-next-line: max-line-length
        dbFactory.update({ _id: global['_id'] }, { $set: { "fechasEvaluacion.agoDic": ranges } }, function (err, newDoc) { return console.log('Rango Fechas ago/dic error', err); });
    }
    else if (dateCycle.includes('Enero/Junio')) {
        var inicio = new Date(global['settings']['inicioEneJun']);
        var year = dateCycle.match(/\d+/g)[0];
        inicio.setFullYear(year);
        var fin = new Date(global['settings']['finEneJun']);
        fin.setFullYear(year);
        var range = new Date(inicio.setDate(inicio.getDate() + size));
        ranges.push(new Date(range));
        while (range.getTime() < fin.getTime()) {
            range = new Date(range.setDate(range.getDate() + size));
            ranges.push(new Date(range));
        }
        ranges.pop();
        // tslint:disable-next-line: max-line-length
        dbFactory.update({ _id: global['_id'] }, { $set: { "fechasEvaluacion.eneJun": ranges } }, function (err, newDoc) { return console.log('Rango Fechas ene/jun error', err); });
    }
    if (ranges.length > 0) {
        return ranges;
    }
};
/* Set maestros externalID to verify if exist or not */
var getMaestros = function () {
    if (global['maestros'].length > 0) {
        global['maestros'].map(function (value) {
            maestros = new Set(value['externalId']);
        });
    }
    else {
        maestros = new Set();
    }
};
/* Take the Excel file and parse it to json also validate the header columns */
electron_1.ipcMain.on('excel', function (event, arg) {
    var _a, _b;
    try {
        if (arg && dateCycle) {
            // save maestros on a Set to verify if exist
            getMaestros();
            // saves admin email
            saveAdminEmail(adminEmail);
            // saves dates ranges for emails
            var ranges_1 = createDateRanges();
            // cycle object to push over cycle databse using [datacycle]: [cycleobj]
            var cycleObj_1 = [];
            // Maestros object to push over maestros database
            var maestrosObj = [];
            // Materias object to push over materias database
            var materiasObj = [];
            // temporal obj template
            var temporalObj_1 = {
                maestro: {},
                materias: [],
                total: 0
            };
            // reads the excel file from a binary source
            var workbook = XLSX.read(arg, { type: 'binary' });
            // saves the sheet excel name
            var sheetName = workbook.SheetNames;
            // convert sheet binary to JSON starting the third row as column data for JSON properties
            var sheetToJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName[0]], { range: 3 });
            // iterates through JSON object to save data on the database;
            sheetToJson.map(function (values) {
                // check if the propertie name exists and is string type
                if (typeof values.Nombre === 'string') {
                    var splitting = values.Nombre.split(' ');
                    var slicing = splitting.slice(3, splitting.length);
                    temporalObj_1['maestro'] = { 'Nombre': slicing.join(' ') };
                    var trimming = values.Nombre.match(/\[(.*?)\]/g);
                    temporalObj_1['maestro']['externalId'] = trimming[1].replace('[', '').replace(']', '');
                    temporalObj_1['maestro']['visible'] = true;
                    temporalObj_1['maestro']['email'] = '';
                    // Check if email exist and added to the object
                }
                else if (values.Correo) {
                    temporalObj_1['maestro']['email'] = values.correo;
                    // Check if theres no empty object and the properties dont have name
                }
                else if ((Object.entries(values).length > 0 && values.Nombre === undefined)) {
                    var evaluaciones = [];
                    for (var i = 0; i < ranges_1.length; i = i + 1) {
                        evaluaciones.push({ value: null, evaluated: null });
                    }
                    var evaluacionProperty = Object.assign(values, { evaluacion: evaluaciones });
                    temporalObj_1['materias'].push(evaluacionProperty);
                    // Check if the type of property Nombre is number
                }
                else if (typeof values.Nombre === 'number') {
                    temporalObj_1.total = values.Nombre;
                    if (!maestros.has(temporalObj_1['maestro'['externalId']])) {
                        dbFactory.update({ _id: global['_id'] }, { $push: { maestros: temporalObj_1 } });
                    }
                    cycleObj_1.push(temporalObj_1);
                    temporalObj_1 = {
                        maestro: '',
                        materias: [],
                        total: 0
                    };
                }
                else {
                    console.log('im failing filtering values');
                    // if doesnt had any of the properties it will fail
                    event.returnValue = false;
                }
            });
            //if cycles object is populated insert to database ciclos
            if (cycleObj_1.length > 0) {
                dbFactory.update({ _id: global['_id'] }, { $push: { ciclosindex: dateCycle } }, function (err, newDoc) { return console.log(err); });
                dbFactory.update({ _id: global['_id'] }, { $push: { cicleEvaluated: (_a = {}, _a[dateCycle] = [], _a) } }, function (err, newDoc) { console.log('error creating evaluation cycle'); });
                dbFactory.update({ _id: global['_id'] }, { $push: { ciclos: (_b = {}, _b[dateCycle] = cycleObj_1, _b) } }, function (err, newDoc) {
                    console.log('error updating cycles', err);
                    // console.log('new doc', newDoc);
                });
            }
        }
        event.returnValue = true;
    }
    catch (e) {
        console.log('error on lecture', e);
        event.returnValue = false;
    }
});
electron_1.ipcMain.on('getOnlyCycles', function (event, arg) { return __awaiter(_this, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = event;
                return [4 /*yield*/, dbFactory.asyncFind({})];
            case 1:
                _a.returnValue = _b.sent();
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on('saveCycleDataToDB', function (event, arg) { return __awaiter(_this, void 0, void 0, function () {
    var temporal;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbFactory.update({ _id: global['_id'] }, { $set: { ciclos: arg } }, function (err, num, newDoc) {
                    console.log('error saving cicle', err);
                    if (!err) {
                        event.returnValue = newDoc;
                    }
                })];
            case 1:
                temporal = _a.sent();
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on('saveCycleEvaluation', function (event, arg) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbFactory.asyncUpdate({ _id: global['_id'] }, { $set: { cicleEvaluated: arg } })];
            case 1:
                _a.sent();
                event.returnValue = true;
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on('saveEmail', function (event, arg) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbFactory.asyncUpdate({ _id: global['_id'] }, { $set: { maestros: arg } })];
            case 1:
                _a.sent();
                event.returnValue = true;
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on('isVisible', function (event, arg) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbFactory.asyncUpdate({ _id: global['_id'] }, { $set: { maestros: arg.maestros } })];
            case 1:
                _a.sent();
                return [4 /*yield*/, dbFactory.asyncUpdate({ _id: global['_id'] }, { $set: { ciclos: arg.cycleData['ciclos'] } })];
            case 2:
                _a.sent();
                event.returnValue = true;
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on('sendEmail', function (event, arg) {
    var mailOptions = {
        from: global['settings']['adminEmail'],
        to: global['settings']['adminEmail'],
        subject: 'this is a test',
        html: '<p>Your html here</p>' // plain text body
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
            event.reply('onEmailCallBack', err);
            event.preventDefault();
        }
        else {
            event.reply('onEmailCallBack', info);
            event.preventDefault();
        }
    });
    event.returnValue = true;
});
//# sourceMappingURL=main.js.map