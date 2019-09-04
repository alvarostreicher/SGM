import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainServiceService } from '../../services/main-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-cycle',
  templateUrl: './add-cycle.component.html',
  styleUrls: ['./add-cycle.component.css']
})
export class AddCycleComponent implements OnInit {
  year = new Date().getFullYear();
  years = [{value: this.year, viewValue: this.year}];
  i = 0;
  periods = [
    {value: 'Enero/Junio', viewValue: 'Enero/Junio'},
    {value: 'Agosto/Diciembre', viewValue: 'Agosto/Diciembre'}
  ];
  formGroup: FormGroup;
  @Output() CycleAdded: EventEmitter<any> = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private electron: MainServiceService, private router: Router) { }

  ngOnInit() {
    this.generateYears();
    this.formGroup = this.formBuilder.group({
      period: ['', Validators.required],
      year: ['', Validators.required]
    });
  }

  generateYears() {
    let incremetalyear = this.year;
    for (let i = 0; i < 20; i = i + 1) {
      this.years.push({value: incremetalyear + 1, viewValue: incremetalyear + 1});
      incremetalyear = incremetalyear + 1;
    }
  }

  onSubmit() {
    if (this.formGroup.status === 'VALID') {
      this.electron.addCycle({cycle: `${this.formGroup.value.period}/${this.formGroup.value.year}`});
      this.CycleAdded.emit(true);
      // this.router.navigate(['uploadExcel']);
    }
  }

}
