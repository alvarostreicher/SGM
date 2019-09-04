import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { MainServiceService } from 'src/app/services/main-service.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'app-upload-excel',
  templateUrl: './upload-excel.component.html',
  styleUrls: ['./upload-excel.component.css']
})

export class UploadExcelComponent implements OnInit, OnChanges, OnDestroy {
  title: string = 'Subir Bitacora de Maestros';
  buttonTag: string = 'Seleccionar';
  uploadTag: string = 'Seleccionar Archivo:';
  uploadButtonTag: string = 'Cargar';
  fullFileName: string;
  successloadFile: string;
  srcResult: any;
  binary: any;
  isLoaded: boolean;
  hasError: boolean;
  superLoad: boolean;
  upload = '../../../assets/icons/baseline-unarchive-24px.svg';
  attatch = '../../../assets/icons/baseline-attach_file-24px.svg';
  $unsub  = new Subject();

  constructor(private _service: MainServiceService, private router: Router) { }

  ngOnInit() {
    this._service.responseCycle.pipe(takeUntil(this.$unsub)).subscribe((value) => {
      if (value === false) {
        this.hasError = true;
        this.successloadFile = 'El archivo tuvo un error porfavor cargar nuevamente';
      } else if (value === true){
        this.router.navigate(['dashboard']);
        this._service.showMenu.next(true);
      }
      this.isLoaded = value;
    });
  }

  ngOnChanges() {
  }

  ngOnDestroy() {
    this.$unsub.next();
    this.$unsub.complete();
  }

  onFileSelected() {
    const inputNode: any = document.querySelector('#file');
    this.hasError = false;
    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.srcResult = e.target.result;
        if (this.srcResult) {
          let data = new Uint8Array(this.srcResult);
          let arr = new Array();
          data.forEach((item) => arr.push(String.fromCharCode(item)));
          this.binary = arr.join('');
          this.fullFileName = inputNode.files[0].name;
          this.buttonTag = inputNode.files[0].name.substring(0, 10);
        } else {
          this.hasError = true;
          this.successloadFile = 'El archivo tuvo un error porfavor cargar nuevamente';
        }
      };
      reader.readAsArrayBuffer(inputNode.files[0]);
    }
  }

  uploadFile() {
    this._service.responseCycle.next(undefined);
    let count = 1;
    this.successloadFile = `El archivo ${this.fullFileName} se ha cargado correctamente`;
    this._service.fileFullName.next(this.successloadFile);

    setTimeout(() => {
      count = count + 1;
      if (count === 2) {
        this._service.uploadExcel(this.binary);
      }
    }, 2000);
  }

  remove() {
    this.hasError = false;
    this.fullFileName = null;
    this.binary = undefined;
    this.buttonTag = 'Seleccionar';
    this.srcResult = undefined;
  }

}
