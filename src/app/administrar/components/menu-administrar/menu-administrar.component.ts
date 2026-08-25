import { Component, OnInit } from '@angular/core';

import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-menu-administrar',
  templateUrl: './menu-administrar.component.html',
  styleUrls: ['./menu-administrar.component.css']
})
export class MenuAdministrarComponent implements OnInit {
  status: string = "";
  opcionesmenu : any;
  
  constructor(private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.opcionesmenu = this.usersession.getAllMenu();
    this.status = this.usersession.getConfiguracion("status");
  }

  permisosProcesosOperativos(): boolean
  {
    if (this.opcionesmenu['roles'] == 1 || this.opcionesmenu['empleados'] == 1 || this.opcionesmenu['usuarios'] == 1)
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
    if (this.opcionesmenu['configuracionimpresion'] == 1 || this.status == "1")
    {
      return true;
    }
    else
    {
      return false;
    }
  }

}