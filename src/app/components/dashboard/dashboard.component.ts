import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MainServiceService } from 'src/app/services/main-service.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Subscription } from 'rxjs';
import { ToolbarService } from 'src/app/services/toolbar.service';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material';
import { DashboardEvaluationDialogComponent } from '../dashboard-evaluation-dialog/dashboard-evaluation-dialog.component';

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
  $unsubFile = new Subscription();
  $unsubLoad = new Subscription();
  $unsubDeadline = new Subscription();
  $unsubCycle = new Subscription();
  $unsubEmail = new Subscription();
  $deadline;
  dataSource;
  overall = [];
  emailsObject = [];
  size = 10;
  loadMoreVisible = true;
  constructor(private _service: MainServiceService, private dataService: DashboardService, private toolbarService: ToolbarService, private notifierService: NotifierService, public dialog: MatDialog) { }

  ngOnInit() {
    this.$unsubFile = this._service.fileFullName.subscribe((filename) => this.successloadFile = filename);
    this.$unsubLoad = this._service.responseCycle.subscribe((value) => { this.isLoaded = value; });
    this.$unsubDeadline = this.dataService.isDeadLine.subscribe((value) => {
      this.$deadline = value;
    });
    this.$unsubEmail = this.dataService.emailResponse.subscribe((value) => {
      if (value) {
        this.notifierService.notify('success', 'Email Enviado Con exito');
        this.dataService.emailResponse.next(null);
      } else if (value === false) {
        this.notifierService.notify('error', 'El envio del email ha tenido un error porfavor intente de nuevo');
        this.dataService.emailResponse.next(null);
      }
    });
    if (this.isLoaded) {
      this.notifierService.notify('success', this.successloadFile);
      this.notifierService.notify('info', 'Las opciones configurables al inicio se pueden volver a \n asignar en el apartado de Configuracion en el Menu');
      setTimeout(() => {
        this._service.responseCycle.next(null);
      }, 10000);
    }
    this.dataService.getData();
    this.$unsubCycle = this.dataService.getCycle().subscribe((value) => {
      this.dataSource = [...value].splice(0, this.size);
      this.data = value;
      this.overallPercentage();
      this.dataService.verfiesDeadLine();
      this.validateEmailSend();
    });
    this.toolbarService.listOfCycles.next(this.dataService.cycleData.ciclosindex);
    // this.dataService.updateDataCycle.next()
  }

  overallPercentage() {
    this.overall = [];
    let lengthevaluacion;
    let temporalPercentage;
    this.dataSource.map((value) => {
      temporalPercentage = 0;
      lengthevaluacion = 0;
      value.materias.map((materias) => {
        lengthevaluacion = lengthevaluacion + materias.evaluacion.length;
        temporalPercentage = temporalPercentage + materias.evaluacion.reduce((acc, curr) => {
          if (curr.value > 0) {
            return acc + curr.value;
          } else {
            return acc;
          }
        }, 0);
      });
      this.overall.push(((temporalPercentage / lengthevaluacion) * 100).toFixed(2));
    });
  }

  applyFilter(filterValue: string) {
    // this.dataService.toBefilter.next(filterValue);
    if (filterValue !== '') {
      this.dataSource = this.data.filter((value) => value.maestro.Nombre.toLowerCase().includes(filterValue.toLocaleLowerCase()));
    } else {
      this.dataSource = [...this.data].splice(0, this.size);
    }
  }

  clickEvaluation(masterindex, materiasindex, evaluacion, index, maestro, materia) {
    // console.log(masterindex, materiasindex, evaluacion, index);
    if (evaluacion.value === null || evaluacion.value === 0) {
      this.dataSource[masterindex]['materias'][materiasindex]['evaluacion'][index]['value'] = 1;
      this.data[masterindex]['materias'][materiasindex]['evaluacion'][index]['value'] = 1;
      this.dataSource[masterindex]['materias'][materiasindex]['evaluacion'][index]['evaluated'] = true;
      this.data[masterindex]['materias'][materiasindex]['evaluacion'][index]['evaluated'] = true;
      this.dataSource[masterindex]['materias'].forEach((value, indexMaterias) => {
        if (value['evaluacion'][index]['value'] !== 1) {
          this.data[masterindex]['materias'][indexMaterias]['evaluacion'][index]['evaluated'] = false;
          value['evaluacion'][index]['evaluated'] = false;
        }
      });

      // this.dataService.updateDataCycle.next(this.data);
      this.dataService.sendCycleDataToDB(this.data);
      this.overallPercentage();
      this.validateEmailSend();
    } else {
      let dialogRef = this.dialog.open(DashboardEvaluationDialogComponent, {
        data: {
          maestro,
          materia,
          index: index + 1
        }
      });
      dialogRef.componentInstance.Erase.subscribe((value) => {
        let allnull = 0;
        this.dataSource[masterindex]['materias'][materiasindex]['evaluacion'][index]['value'] = null;
        this.data[masterindex]['materias'][materiasindex]['evaluacion'][index]['value'] = null;
        this.dataSource[masterindex]['materias'][materiasindex]['evaluacion'][index]['evaluated'] = false;
        this.data[masterindex]['materias'][materiasindex]['evaluacion'][index]['evaluated'] = false;
        this.dataSource[masterindex]['materias'].map((value) => {
          let exist = value['evaluacion'][index]['value'] === 1 ? 1 : 0;
          allnull = allnull + exist;
        });
        if (allnull === 0) {
          this.dataSource[masterindex]['materias'].forEach((value, materiasIndex) => {
            this.data[masterindex]['materias'][materiasIndex]['evaluacion'][index]['evaluated'] = null;
            value['evaluacion'][index]['evaluated'] = null;
          });
        }
        this.dataService.sendCycleDataToDB(this.dataSource);
        this.overallPercentage();
        this.validateEmailSend();
        dialogRef.close();
      });
    }
  }

  validateEmailSend() {
    let temporal = [];
    if (this.$deadline.length > 0) {
      this.$deadline.forEach((value, index) => {
        this.data.forEach((cycle, indexCycle) => {
          cycle['materias'].forEach((materias) => {
            let evaluated = materias['evaluacion'][index]['evaluated'];
            if (!evaluated || evaluated === null) {
              temporal.push({ maestro: cycle['maestro']['Nombre'], materia: materias['Materia'], evaluacion: index + 1, correo: this.dataService.cycleData['maestros'][indexCycle]['maestro']['email'] });
              materias['evaluacion'][index]['evaluated'] = false;
            } else {
              temporal.push(null);
            }
          });
          this.emailsObject[indexCycle] = [this.emailsObject[indexCycle], ...temporal];
          temporal = [];
        });
      });
    }
  }

  showEmailButton(data, index): boolean {
    return this.emailsObject[index].some((value) => value !== null || value !== undefined);
  }

  notifyDocentes() {
    let trueArray = []
    this.emailsObject.map((value) => {
      trueArray.push(value.some((validationEmail) => validationEmail !== null || value !== undefined));
    })
    return trueArray.some((value) => value === true);
  }

  SendIndividualEmail(masterindex) {
    let objects = this.emailsObject[masterindex][0];
    if(this.emailsObject[masterindex][0][0] === undefined) {
      objects.shift();
    }
    console.log(this.emailsObject[masterindex].flat())
    console.log(this.emailsObject[masterindex]);
    // this.dataService.sendIndividualEmail(this.emailsObject[masterindex]);
  }

  sendAllEmail() {

  }

  loadMore() {
    this.size = this.size + 10;
    if (this.size < this.data.length) {
      this.dataSource = [...this.data].splice(0, this.size);
      this.overallPercentage();
    } else {
      this.dataSource = [...this.data];
      this.loadMoreVisible = false;
      this.overallPercentage();
    }
  }

  ngOnDestroy() {
    this.$unsubCycle.unsubscribe();
    this.$unsubDeadline.unsubscribe();
    this.$unsubFile.unsubscribe();
    this.$unsubLoad.unsubscribe();
  }



}
