import { Component, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainServiceService } from 'src/app/services/main-service.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {
  cycleCompleted = false;
  email = false;
  constructor(private formBuilder: FormBuilder, private electron: MainServiceService) { }

  ngOnInit() {
  }

  getCycleAddedValidation(value, stepper: MatStepper) {
    this.cycleCompleted = value;
    setTimeout(() => {           // or do some API calls/ Async events
      stepper.next();
     }, 1);
  }

  getEmailValidation(value, stepper: MatStepper){
    this.email = value;
    setTimeout(() => {
      stepper.next();
    }, 1);
  }

}
