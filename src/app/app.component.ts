import { Component, Input, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { MainServiceService } from './services/main-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges{
  constructor(private electron: MainServiceService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // this.isStartScreenCycle = this.electron.isStartScreenCycle;
    // this.electron.responseCycle.subscribe((value) => {
    //   console.log(value);
    //   this.cdr.detectChanges();
    // })
    this.electron.load();
  }

  ngOnChanges() {
  }

}
