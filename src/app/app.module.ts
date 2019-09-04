import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { NgxElectronModule, ElectronService } from 'ngx-electron';
import { AddCycleComponent } from './components/add-cycle/add-cycle.component';
import { UploadExcelComponent } from './components/upload-excel/upload-excel.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import { SetupComponent } from './components/setup/setup.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatIconModule} from '@angular/material/icon';
import { AdminEmailComponent } from './components/admin-email/admin-email.component';
import { EvaluationRangeComponent } from './components/evaluation-range/evaluation-range.component';
import {MatListModule} from '@angular/material/list';
import { NotifierModule } from 'angular-notifier';

@NgModule({
  declarations: [
    AppComponent,
    AddCycleComponent,
    UploadExcelComponent,
    ToolbarComponent,
    DashboardComponent,
    SetupComponent,
    AdminEmailComponent,
    EvaluationRangeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgxElectronModule,
    MatProgressBarModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatExpansionModule,
    MatTableModule,
    MatInputModule,
    MatStepperModule,
    MatIconModule,
    MatListModule,
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: 'right'
        },
        vertical: {
          position: 'top',
          distance: 100
        }
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
