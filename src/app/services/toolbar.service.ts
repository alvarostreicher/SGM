import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {
  isElectron = this._electronService.isElectronApp;
  listOfCycles = new BehaviorSubject([]);
  cycleSelected = new BehaviorSubject('');
  constructor(private _electronService: ElectronService) { }

  /* return object cycle */
  getCycles() {
    if (this.isElectron) {
      const [cycles] = this._electronService.ipcRenderer.sendSync('getOnlyCycles', null);
      console.log('im running get cycles on toolbar service')
      this.listOfCycles.next(cycles.ciclosindex);
      this.cycleSelected.next(cycles.ciclosindex[0]);
    }
  }


}
