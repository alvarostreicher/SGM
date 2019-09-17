import { Component, OnInit, Inject, Output, Input, EventEmitter} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { materialize } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-evaluation-dialog',
  templateUrl: './dashboard-evaluation-dialog.component.html',
  styleUrls: ['./dashboard-evaluation-dialog.component.css']
})
export class DashboardEvaluationDialogComponent implements OnInit {
  @Output() Erase : EventEmitter<object> = new EventEmitter<object>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onErase() {
    this.Erase.emit({});
  }


}
