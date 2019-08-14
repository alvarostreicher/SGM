import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  title: string = 'SGM';
  logo: string = 'url(./assets/logo.png)';
  constructor() { }

  ngOnInit() {
  }

}
