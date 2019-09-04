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
  cycle: string;
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
    this.updateData.next(data);
  }

  getCycle() {
    if  (this.isElectron) {
    this.toolbarService.cycleSelected.pipe(takeUntil(this.$unsub)).subscribe((value)=> this.cycle = value);
    this.updateData.subscribe((data) => {
      const [actualSelectedData] = data['ciclos'].filter((ciclos) =>  ciclos[this.cycle] );
      if(actualSelectedData) {
        this.updateDataCycle.next(actualSelectedData[this.cycle]);
      }
    });
    return this.updateDataCycle;
    }
  }

  filter() {
    this.dataFiltered = combineLatest(this.updateDataCycle, this.toBefilter).pipe(
      map(this.filterFunc.bind(this))
    );
  }

  filterFunc([name, data]) {
    if(data === '') {
      return name;
    }
    return name.filter((value) => value.maestro.Nombre.toLowerCase().includes(data) || value.maestro.Nombre.toUpperCase().includes(data))
  }



}
