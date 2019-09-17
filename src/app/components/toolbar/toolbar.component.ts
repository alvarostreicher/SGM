import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ToolbarService } from 'src/app/services/toolbar.service';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  title: string = 'SGM';
  logo: string = 'url(./assets/logo.png)';
  @Output() Click: EventEmitter<object> = new EventEmitter();
  @Input() menusvg: boolean;
  @Input() showCycles: boolean;
  listOfcycles: Array<[]>;
  constructor(private _toolbarService: ToolbarService) { }

  ngOnInit() {
    this._toolbarService.getCycles();
    this._toolbarService.listOfCycles.subscribe((list) => this.listOfcycles = list);

  }

  menuClick(e) {
    this.Click.emit(e);
  }

  getCycleValue(value) {
    this._toolbarService.cycleSelected.next(value);
  }

}
