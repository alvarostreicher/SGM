import { Component, OnInit } from '@angular/core';
import { MainServiceService } from 'src/app/services/main-service.service';

@Component({
  selector: 'app-upload-excel',
  templateUrl: './upload-excel.component.html',
  styleUrls: ['./upload-excel.component.css']
})
export class UploadExcelComponent implements OnInit {
  title: string = 'Subir Bitacora de Maestros';
  buttonTag: string = 'Seleccionar';
  uploadTag: string = 'Seleccionar Archivo:';
  srcResult: any;
  binary: any;
  upload = '../../../assets/icons/round-menu-24px.svg';
  constructor(private _service: MainServiceService) { }

  ngOnInit() {
  }

  onFileSelected() {
    const inputNode: any = document.querySelector('#file');

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.srcResult = e.target.result;
        let data = new Uint8Array(this.srcResult);
        let arr = new Array();
        data.forEach((item)=> arr.push(String.fromCharCode(item)));
        this.binary = arr.join("");
      };

      reader.onloadend = (e: any) => {
        this._service.uploadExcel(this.binary);
      };

      reader.readAsArrayBuffer(inputNode.files[0]);
    }
  }

}
