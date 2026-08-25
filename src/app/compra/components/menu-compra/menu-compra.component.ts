import { Component, OnInit } from '@angular/core';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
declare var $:any;

@Component({
  selector: 'app-menu-compra',
  templateUrl: './menu-compra.component.html',
  styleUrls: ['./menu-compra.component.css']
})
export class MenuCompraComponent implements OnInit {
  
  opcionesmenu : any;
  constructor(private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.opcionesmenu = this.usersession.getAllMenu();
  }

  clickReporteCompras()
  {
    $("#mymodalopcionesreportecompras").modal("show");
  }

  permisosProcesosOperativos(): boolean
  {
    if (this.opcionesmenu['facturacompra'] == 1 || this.opcionesmenu['compragastos'] == 1)
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
    if (this.opcionesmenu['exploradorproveedores'] == 1 || this.opcionesmenu['exploradorcompra'] == 1 || this.opcionesmenu['exploradornotacreditocompras'] == 1)
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
    if (this.opcionesmenu['reporteproveedores'] == 1 || this.opcionesmenu['reportenotacreditocompras'] == 1 || this.opcionesmenu['reportecompra'] == 1 || this.opcionesmenu['reportecompradetalle'] == 1 || this.opcionesmenu['reportecomprascredito'] == 1)
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
    if (this.opcionesmenu['proveedores'] == 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  permisosBotonReporteCompras(): boolean
  {
    if (this.opcionesmenu['reportecompra'] == 1 || this.opcionesmenu['reportecompradetalle'] == 1 || this.opcionesmenu['reportecomprascredito'] == 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

}