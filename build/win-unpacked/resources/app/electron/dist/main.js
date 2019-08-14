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
var path = require("path");
var url = require("url");
var DB = require('nedb-async').default;
var XLSX = require('xlsx');
var win;
var dbFactory = new DB({
    filename: 'database.db',
    autoload: true
});
// const excelFile = path.join(__dirname, '../horarios2.xlsx')
// const workbook = XLSX.readFile(excelFile);
// const sheetName = workbook.SheetNames;
// const sheetToJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName[0]], { range: 3, blankrows: true });
/*
  Check if database is empty and populate with propierties
*/
var dataInDBExist = function () { return __awaiter(_this, void 0, void 0, function () {
    var newObj, isEmtpy;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                newObj = {
                    maestros: [],
                    materias: [],
                    ciclos: []
                };
                return [4 /*yield*/, dbFactory.asyncFind({})];
            case 1:
                isEmtpy = _a.sent();
                if (isEmtpy.length === 0) {
                    dbFactory.insert(newObj, function (err, newDoc) {
                        console.log(newDoc);
                    });
                }
                return [2 /*return*/];
        }
    });
}); };
dataInDBExist();
// let global;
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
// getGloablId();
electron_1.app.on('ready', createWindow);
electron_1.app.on('activate', function () {
    if (win === null) {
        createWindow();
    }
});
electron_1.app.on('window-all-closed', function () {
    electron_1.app.quit();
});
function createWindow() {
    win = new electron_1.BrowserWindow({ show: false });
    win.maximize();
    win.show();
    win.loadURL(url.format({
        pathname: path.join(__dirname, "/../../dist/SGM/index.html"),
        protocol: 'file:',
        slashes: true,
    })
    // 'http://localhost:4200/'
    );
    win.webContents.openDevTools();
    win.on('closed', function () {
        win = null;
    });
}
//# sourceMappingURL=main.js.map