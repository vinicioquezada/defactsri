import { Injectable } from '@angular/core';
import { Menu } from '../models/Menu';
import { Privilegio } from '../models/Privilegio';

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {

  private configuracion: any = {};
  private menu: any = [];
  private privilegios: any = [];

  constructor() {}

  setAllConfiguracion(config: any) {
    this.configuracion = config;
  }

  setAllMenu(menu: any) {
    this.menu = this.obtenerMenu(menu);
  }

  setAllPrivilegios(privilegios: any) {
    this.privilegios = this.obtenerPrivilegios(privilegios);
  }

  getAllConfiguracion(): any {
    return this.configuracion;
  }

  getConfiguracion(key: string): any {
    return this.configuracion[key];
  }

  getAllMenu(): any {
    return this.menu;
  }

  getAllPrivilegios(): any {
    return this.privilegios;
  }

  /*
  tienePermiso(cod_submenu: number, accion: string): boolean {
    const menu = this.configuracion.menu || [];
    const p = menu.find((m: any) => m.cod_sub_menu === cod_submenu);
    return p ? p[accion] === true : false;
  }
  */

  clear(): void {
    this.configuracion = {};
    this.menu = [];
    this.privilegios = [];
  }

  obtenerMenu(arreglomenu: any)
  {
    let objetosmenu = (arreglomenu || []).map(menu => new Menu(menu.menu, menu.verificar));
    let opcionesmenu: any = {};

    objetosmenu.forEach(item => { 
      opcionesmenu[item["menu"]] = item["verificar"];
    });

    let menu: any = {};

    Object.keys(opcionesmenu).forEach(key => {
      const nuevaClave = key.replace(/_/g, '').toLowerCase();
      menu[nuevaClave] = parseInt(opcionesmenu[key]);
    });

    return menu;
  }

  obtenerPrivilegios(arregloprivilegios: any)
  {
    const objetosprivilegios = (arregloprivilegios || []).map(privilegios => new Privilegio(privilegios.privilegio, privilegios.verificar));
    const opcionesprivilegios: any = {};

    objetosprivilegios.forEach(item => {
      opcionesprivilegios[item["privilegio"]] = item["verificar"];
    });

    const privilegios: any = {};

    Object.keys(opcionesprivilegios).forEach(key => {
      const nuevaClave = key.replace(/_/g, '').toLowerCase();
      privilegios[nuevaClave] = parseInt(opcionesprivilegios[key]) || 0;
    });

    return privilegios;
  }
}