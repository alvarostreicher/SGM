import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs';
// const electron = (window as any).require('electron');

@Injectable({
  providedIn: 'root'
})
export class MainServiceService {
  isElectron = this._electronService.isElectronApp;
  responseCycle = new BehaviorSubject<string>('');
  isStartScreenCycle = new BehaviorSubject<boolean>(false);
  constructor(private _electronService: ElectronService) {}

  //Function thats add a new escolar cycle
  addCycle(form: object) {
    if (this._electronService.isElectronApp) {
      this._electronService.ipcRenderer.send('sendCycle', form);
    }
  }

  //function that sends the Excel file
  uploadExcel(file: any){
    if(this.isElectron){
      this._electronService.ipcRenderer.send('excel', file);
    }
  }

  //function that sends a messages once the application is loaded to show the window
  load() {
    if(this.isElectron) {
      this._electronService.ipcRenderer.send('load', null);
    }
  }


}
