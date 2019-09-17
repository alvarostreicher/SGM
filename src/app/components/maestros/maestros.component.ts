import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MaestrosService } from 'src/app/services/maestros.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'app-maestros',
  templateUrl: './maestros.component.html',
  styleUrls: ['./maestros.component.css']
})
export class MaestrosComponent implements OnInit {
  openAccordion = false;
  data;
  group: FormGroup;
  checked: boolean;
  expand: boolean = false;
  email;
  constructor(private dataService: MaestrosService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.data = this.dataService.getMaestros();
    this.group = this.formBuilder.group({
      email: [this.email !== undefined ? this.email : '', [Validators.required, Validators.email]]
    });
  }

  isActivate(ob: MatSlideToggleChange, generalIndex, externalId) {
    this.data[generalIndex]['maestro']['visible'] = ob.checked;
    this.dataService.isVisible(this.data, externalId, ob.checked);
  }

  addEmail(generalIndex) {
    if (this.group.status === 'VALID') {
      this.data[generalIndex]['maestro']['email'] = this.group.value.email;
      this.dataService.SaveEmail(this.data);
    }
  }

  onEdit(generalIndex) {
    this.email = this.data[generalIndex]['maestro']['email'];
    this.data[generalIndex]['maestro']['email'] = '';
    console.log(this.email)
    this.group = this.formBuilder.group({
      email: [this.email !== undefined ? this.email : '', [Validators.required, Validators.email]]
    });
  }

}
