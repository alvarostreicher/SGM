import { Component, Input, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { MainServiceService } from './services/main-service.service';
import { DashboardService } from './services/dashboard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges{
  showMenu: boolean;
  showMenusvg: boolean = false;
  
  constructor(private electron: MainServiceService, private cdr: ChangeDetectorRef, private data: DashboardService) { }

  ngOnInit() {
    this.electron.isMenuShown();
    this.electron.load();
    this.electron.showMenu.subscribe((value) => this.showMenu = value);
    this.data.getData();
  }

  ngOnChanges() {
  }

}
