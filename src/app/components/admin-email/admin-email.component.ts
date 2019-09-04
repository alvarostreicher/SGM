import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainServiceService } from 'src/app/services/main-service.service';

@Component({
  selector: 'app-admin-email',
  templateUrl: './admin-email.component.html',
  styleUrls: ['./admin-email.component.css']
})
export class AdminEmailComponent implements OnInit {
  formGroup: FormGroup;
  @Output() adminEmailAdded: EventEmitter<boolean> = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private electron: MainServiceService) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email] ]
    });
  }

  sendEmail() {
    if (this.formGroup.status === 'VALID') {
      this.electron.addEmail({email: this.formGroup.value.email});
      this.adminEmailAdded.emit(true);
    }
  }

}
