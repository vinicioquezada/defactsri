import { Component, OnInit } from '@angular/core';

import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-menu-gastos-ingresos',
  templateUrl: './menu-gastos-ingresos.component.html',
  styleUrls: ['./menu-gastos-ingresos.component.css']
})
export class MenuGastosIngresosComponent implements OnInit {
  
  opcionesmenu : any;
  constructor(private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.opcionesmenu = this.usersession.getAllMenu();
  }

  permisosProcesosOperativos(): boolean
  {
    if (this.opcionesmenu['ingresos'] == 1 || this.opcionesmenu['gastos'] == 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  permisosInformesReportes(): boolean
  {
    if (this.opcionesmenu['reporteingresos'] == 1 || this.opcionesmenu['reportegastos'] == 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  permisosConfiguracionAuxiliares(): boolean
  {
    if (this.opcionesmenu['categoriaingresos'] == 1 || this.opcionesmenu['categoriagastos'] == 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

}
