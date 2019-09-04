import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { UploadExcelComponent } from './components/upload-excel/upload-excel.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AddCycleComponent } from './components/add-cycle/add-cycle.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SetupComponent } from './components/setup/setup.component';

const routes: Routes = [
  {path: '', component: SetupComponent, canActivate: [AuthGuardService]},
  { path: 'uploadExcel', component: UploadExcelComponent },
  { path: 'dashboard', component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class AppRoutingModule { }
