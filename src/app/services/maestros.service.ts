import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { ToolbarService } from '../services/toolbar.service';

@Injectable({
  providedIn: 'root'
})
export class MaestrosService {
  cycle;
  fullData;
  constructor(private _electronService: ElectronService, private toolbarService: ToolbarService) { }

  getMaestros() {
    const [data] = this._electronService.ipcRenderer.sendSync('getOnlyCycles', null);
    this.fullData = data;
    return data['maestros'];
  }

  SaveEmail(data) {
    this._electronService.ipcRenderer.sendSync('saveEmail', data);
  }

  isVisible(data, externalId, rawValue) {
    this.toolbarService.cycleSelected.subscribe((value) => this.cycle = value );
    this.fullData['ciclos'].map((value, ciclosIndex) => {
      if (value[this.fullData['ciclosindex'][ciclosIndex]]) {
        value[this.fullData['ciclosindex'][ciclosIndex]].map((valores, index) => {
          if (valores['maestro']['externalId'] === externalId ){
            this.fullData['ciclos'][ciclosIndex][this.fullData['ciclosindex'][ciclosIndex]][index]['maestro']['visible'] = rawValue;
          }
        })
      }
    });
    let newData = { maestros: data, cycleData: this.fullData };
    if(newData.maestros && newData.cycleData) {
      this._electronService.ipcRenderer.sendSync('isVisible', newData);
    }
  }

  getSettings() {
    this.getMaestros();
    return this.fullData['settings'];
  }

}
