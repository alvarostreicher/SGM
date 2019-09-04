import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainServiceService } from 'src/app/services/main-service.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Observable, Subject } from 'rxjs';
import { ToolbarService } from 'src/app/services/toolbar.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  successloadFile: string;
  isLoaded: boolean;
  openAccordion = false;
  data;
  $unsub = new Subject();
  dataSource;
  constructor(private _service: MainServiceService, private dataService: DashboardService, private toolbarService: ToolbarService, private notifierService: NotifierService) { }

  ngOnInit() {
    this._service.fileFullName.subscribe((filename) => this.successloadFile = filename);
    this._service.responseCycle.subscribe((value) => { this.isLoaded = value; });
    if (this.isLoaded) {
      this.notifierService.notify('success', this.successloadFile);
      this.notifierService.notify('info', 'Las opciones configurables al inicio se pueden volver a \n asignar en el apartado de Configuracion en el Menu');
      setTimeout(() => {
        this._service.responseCycle.next(false);
      }, 10000);
    }
    this.dataService.getData();
    this.dataService.getCycle().subscribe((value) => {
      this.dataSource = value;
      this.data = value;
    });
    // this.dataService.updateDataCycle.next()
  }

  applyFilter(filterValue: string) {
    // this.dataService.toBefilter.next(filterValue);
    if (filterValue !== '') {
      this.dataSource = this.data.filter((value) => value.maestro.Nombre.toLowerCase().includes(filterValue.toLocaleLowerCase()));
    } else {
      this.dataSource = this.data;
    }
  }

  clickEvaluation(masterindex, materiasindex, evaluacion, index) {
    // console.log(masterindex, materiasindex, evaluacion, index);
    if (evaluacion === null) {
      this.dataSource[masterindex]['materias'][materiasindex]['evaluacion'][index] = 1;
    } else {
      this.dataSource[masterindex]['materias'][materiasindex]['evaluacion'][index] = null;
    }
  }
  ngOnDestroy() {
  }

}
