import { Component, OnInit } from '@angular/core';

import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-menu-retencion',
  templateUrl: './menu-retencion.component.html',
  styleUrls: ['./menu-retencion.component.css']
})
export class MenuRetencionComponent implements OnInit {
  
  opcionesmenu : any;

  constructor(private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.opcionesmenu = this.usersession.getAllMenu();
  }

  permisosProcesosOperativos(): boolean
  {
    if (this.opcionesmenu['retencion'] == 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  permisosGestionDocumentos(): boolean
  {
    if (this.opcionesmenu['exploradorretencion'] == 1)
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
    if (this.opcionesmenu['reporteretencion'] == 1)
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
    if (this.opcionesmenu['codigoretencion'] == 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

}