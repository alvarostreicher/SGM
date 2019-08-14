import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { UploadExcelComponent } from './components/upload-excel/upload-excel.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AddCycleComponent } from './components/add-cycle/add-cycle.component';

const routes: Routes = [
  {path: '', component: AddCycleComponent, canActivate: [AuthGuardService]},
  { path: 'uploadExcel', component: UploadExcelComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class AppRoutingModule { }
