import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HeaderMenus } from '../models/header-menus.dto';

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  headerManagement: BehaviorSubject<HeaderMenus> =
  new BehaviorSubject<HeaderMenus>({
    estadologin: true,
    estadomenu: false
  });
}