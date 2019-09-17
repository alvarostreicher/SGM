import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { UploadExcelComponent } from './components/upload-excel/upload-excel.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AddCycleComponent } from './components/add-cycle/add-cycle.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SetupComponent } from './components/setup/setup.component';
import { MaestrosComponent } from './components/maestros/maestros.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  {path: '', component: SetupComponent, canActivate: [AuthGuardService]},
  { path: 'uploadExcel', component: UploadExcelComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'maestros', component: MaestrosComponent },
  { path: 'configuracion', component: SettingsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class AppRoutingModule { }
