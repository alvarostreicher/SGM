import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  isElectron = this._electronService.isElectronApp;

  constructor(private _electronService: ElectronService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.isElectron) {
     const flag: any = this._electronService.ipcRenderer.sendSync('cycleStartScreen', null);
     return flag;
    }
  }
}
