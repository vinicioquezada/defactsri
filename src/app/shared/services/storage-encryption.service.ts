import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { HeaderMenus } from '../models/header-menus.dto';
import { AccessService } from './access.service';
import { Router } from '@angular/router';
import { UserSessionService } from './user-session.service';
declare var $:any;

@Injectable({
  providedIn: 'root'
})
export class StorageEncryptionService {
private secretKey = 'sistemadevfact001';

  constructor(private router: Router, private accessservice: AccessService,  private usersession: UserSessionService) {}

  setEncryptedItem(key: string, value: any): void {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(value), this.secretKey).toString();
    localStorage.setItem(key, encrypted);
  }

  getDecryptedItem(key: string): any {
    const data = localStorage.getItem(key);
    if (!data)
    {
      this.cerrarSesion();
      return null;
    }
      
    
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (e) {
      console.error('Error al desencriptar', e);
      this.cerrarSesion();
      return null;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clearAll(): void {
    localStorage.clear();
  }

  cerrarSesion()
    {
      this.clearAll();
      this.usersession.clear();
      const headerInfo: HeaderMenus = {
        estadologin: true,
        estadomenu: false,
      };
      this.accessservice.headerManagement.next(headerInfo);
      this.router.navigate(["/", ""]);
  
      if($(window).width() <= 991)
      {
        let parrafo = $("#appmenu");
        parrafo.removeClass("sidebar-open");
        parrafo.addClass('sidebar-closed sidebar-collapse');
      }
  
      localStorage.setItem('logout-event', Date.now().toString());
    }
}
