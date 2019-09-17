import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs';
// const electron = (window as any).require('electron');

@Injectable({
  providedIn: 'root'
})
export class MainServiceService {
  isElectron = this._electronService.isElectronApp;
  responseCycle = new BehaviorSubject<boolean>(null);
  isStartScreenCycle = new BehaviorSubject<boolean>(false);
  fileFullName = new BehaviorSubject<string>(undefined);
  showMenu = new BehaviorSubject<boolean>(false);
  // cycle created or set it
  cycleCreated = new BehaviorSubject<Date>(new Date());
  constructor(private _electronService: ElectronService) {}


  /* Function that verifies if the menu is shown */
  isMenuShown() {
    if(this.isElectron) {
      const shown = this._electronService.ipcRenderer.sendSync('cycleStartScreen', null);
      if(!shown) {
        this.showMenu.next(true);
      }
    }
  }

  // Function thats add a new escolar cycle
  addCycle(form: object) {
    if (this._electronService.isElectronApp) {
      this._electronService.ipcRenderer.send('sendCycle', form);
    }
  }

  // function that send admin email
  addEmail(form: object) {
    if (this.isElectron) {
      this._electronService.ipcRenderer.send('adminEmail', form);
    }
  }

  // function that sends the Excel file
  uploadExcel(file: any){
    if (this.isElectron){
     const response = this._electronService.ipcRenderer.sendSync('excel', file);
     this.responseCycle.next(response);
    }
  }

  // function that sends a messages once the application is loaded to show the window
  load() {
    if (this.isElectron) {
      this._electronService.ipcRenderer.send('load', null);
    }
  }

}
