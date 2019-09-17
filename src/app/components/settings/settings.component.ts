import { Component, OnInit } from '@angular/core';
import { MaestrosService } from 'src/app/services/maestros.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  emailGroup: FormGroup;
  rangeGroup: FormGroup;
  data;
  Enero: Date;
  Junio: Date;
  Agosto: Date;
  Diciembre: Date;
  showPass;
  constructor(private dataService: MaestrosService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.data = this.dataService.getSettings();
    this.emailGroup = this.formBuilder.group({
      email: [ this.data['adminEmail'], [Validators.required, Validators.email] ],
      pass: [this.data['adminPassword'], [Validators.required]]
    });
    this.rangeGroup = this.formBuilder.group({
      range: [this.data['rangoFechas'], Validators.required]
    })
    this.Enero = this.data['inicioEneJun'];
    this.Junio = this.data['finEneJun'];
    this.Agosto = this.data['inicioAgoDic'];
    this.Diciembre = this.data['finAgoDic'];
  }

  visible() {
    this.showPass = !this.showPass;
  }

  editEmail() {
    if (this.emailGroup.status === 'VALID') {
      
    }
  }

  editRange() {
    if (this.rangeGroup.status === 'VALID') {

    }
  }

  eneroDate(date) {
    console.log(date)
  }
  junioDate(date) {
    console.log(date)
  }
  agostoDate(date) {
    console.log(date)
  }
  diciembreDate(date) {
    console.log(date)
  }

}
