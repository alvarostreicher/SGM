import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject, Subject, Observable, combineLatest } from 'rxjs';
import { ToolbarService } from './toolbar.service';
import { takeUntil, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  isElectron = this._electronService.isElectronApp;
  updateDataCycle = new BehaviorSubject([]);
  updateData = new BehaviorSubject({});
  isDeadLine = new BehaviorSubject([]);
  cycle: string;
  cycleIndex: number;
  cycleData: any;
  emailResponse = new BehaviorSubject(null);
  $unsub = new Subject();
  toBefilter: BehaviorSubject<string> = new BehaviorSubject<string>('');
  filtering: Observable<any> = this.toBefilter.asObservable();
  dataFiltered: Observable<any>;
  constructor(private _electronService: ElectronService, private toolbarService: ToolbarService) { }


  getData() {
    const [data] = this._electronService.ipcRenderer.sendSync('getOnlyCycles', null);
    // console.log('-------->', data.settings.inicioEneJun)
    // let inicio = new Date(data.settings.inicioEneJun);
    // console.log(new Date(inicio.setDate(inicio.getDate()+14)))
    this.cycleData = data;
    this.updateData.next(data);
  }

  getCycle() {
    if (this.isElectron) {
      this.toolbarService.cycleSelected.pipe(takeUntil(this.$unsub)).subscribe((value) => {
        this.cycle = value;
        const [actualSelectedData] = this.cycleData['ciclos'].filter((ciclos, index) => {
          if (ciclos[this.cycle]) {
            this.cycleIndex = index;
            return ciclos[this.cycle];
          }
        });
        if (actualSelectedData) {
          this.updateDataCycle.next(actualSelectedData[this.cycle]);
        }
      });
      this.verfiesDeadLine();
      return this.updateDataCycle;
    }
  }

  filter() {
    this.dataFiltered = combineLatest(this.updateDataCycle, this.toBefilter).pipe(
      map(this.filterFunc.bind(this))
    );
  }

  filterFunc([name, data]) {
    if (data === '') {
      return name;
    }
    return name.filter((value) => value.maestro.Nombre.toLowerCase().includes(data) || value.maestro.Nombre.toUpperCase().includes(data))
  }
  // enviar update a la db, hacer todo en el front, sacar el index del array del ciclo y mandar todo el objeto ciclo
  sendCycleDataToDB(data) {
    this.cycleData['ciclos'][this.cycleIndex][this.cycle] = data;
    if (this.isElectron) {
      const cycle = this._electronService.ipcRenderer.sendSync('saveCycleDataToDB', this.cycleData['ciclos']);
    }
  }

  /* Function that verifies Dealine coming (2 days before) */
  verfiesDeadLine() {
    if (this.isElectron) {
      const actualDate = new Date();
      let deadlines, currentDeadLine, deadlineIndex;
      if (this.cycle.includes('Agosto/Diciembre')) {
        deadlines = this.cycleData['fechasEvaluacion']['agoDic'];
      } else if (this.cycle.includes('Enero/Junio')) {
        deadlines = this.cycleData['fechasEvaluacion']['eneJun'];
      }
      deadlines.forEach((value, index) => {
        let temporalDate = new Date(value);
        actualDate.setHours(0, 0, 0, 0);
        if (new Date(temporalDate.setDate(temporalDate.getDate() - 2)).valueOf() === actualDate.valueOf() || actualDate.valueOf() > new Date(temporalDate.setDate(temporalDate.getDate())).valueOf()) {
          deadlineIndex = index;
          this.cycleData['cicleEvaluated'].forEach((value) => {
            if (value[this.cycle]) {
              value[this.cycle][index] = true;
              this.isDeadLine.next(value[this.cycle]);
            }
          });
          /* anadir un id a cada materia o maestro debido a que necesitas saber en una condicion si
          ya se evaluo esa fecha y si la materia o maestro tiene algun pendiente
          en caso de cumplirse tener que desplegar una forma para mandar el correo de notificacion
          correspondiente
          */
          if (this.cycleData['cicleEvaluated'].length > 0) {
            this._electronService.ipcRenderer.sendSync('saveCycleEvaluation', this.cycleData['cicleEvaluated']);
          }
        }
      });
    }
  }

  sendIndividualEmail(data) {
    let counter = 1;
    let response = this._electronService.ipcRenderer.sendSync('sendEmail', data);
    this._electronService.ipcRenderer.on('onEmailCallBack', (event, result) => {
      if (counter === 1) {
        this.emailResponse.next(result);
        counter = counter + 1;
      }
    });
  }

}
