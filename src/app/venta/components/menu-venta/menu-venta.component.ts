import { Component, OnInit } from '@angular/core';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
declare var $:any;

@Component({
  selector: 'app-menu-venta',
  templateUrl: './menu-venta.component.html',
  styleUrls: ['./menu-venta.component.css']
})
export class MenuVentaComponent implements OnInit {
  
  opcionesmenu : any;
  constructor(private usersession: UserSessionService) { }
  ngOnInit(): void {
    this.opcionesmenu = this.usersession.getAllMenu();
  }

  clickReporteVentas()
  {
    $("#mymodalopcionesreporteventas").modal("show");
  }

  clickReporteVentasProductos()
  {
    $("#mymodalopcionesreporteventasproductos").modal("show");
  }

  clickReporteNotasCreditos()
  {
    $("#mymodalopcionesreportenotascreditos").modal("show");
  }

  permisosProcesosOperativos(): boolean
  {
    if (this.opcionesmenu['cajero'] == 1 || this.opcionesmenu['facturaventa'] == 1 || this.opcionesmenu['preventa'] == 1 || this.opcionesmenu['recaudacion'] == 1 || this.opcionesmenu['pedidos'] == 1 || this.opcionesmenu['pagonotacredito'] == 1)
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
    if (this.opcionesmenu['exploradorcajero'] == 1 || this.opcionesmenu['exploradorclientes'] == 1 || this.opcionesmenu['exploradorventa'] == 1 || this.opcionesmenu['exploradorpedidos'] == 1 || this.opcionesmenu['exploradorfactura'] == 1 || this.opcionesmenu['exploradornotacredito'] == 1 || this.opcionesmenu['exploradorguiaremision'] == 1)
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
    if (this.opcionesmenu['reporteclientes'] == 1 || this.opcionesmenu['reporteguiaremision'] == 1 || this.opcionesmenu['reporteventas'] == 1 || this.opcionesmenu['reporteventaformapago'] == 1 || this.opcionesmenu['resumenventas'] == 1 || this.opcionesmenu['reportecontrolventas'] == 1 || this.opcionesmenu['reporteventasdetalles'] == 1 || this.opcionesmenu['reporteventacredito'] == 1 || this.opcionesmenu['reporteventascategoria'] == 1 || this.opcionesmenu['reporteventasproductos'] == 1 || this.opcionesmenu['reporterotacionproducto'] == 1 || this.opcionesmenu['reportenotacredito'] == 1 || this.opcionesmenu['reportesaldonotacredito'] == 1 || this.opcionesmenu['reportepagonotacredito'] == 1 || this.opcionesmenu['reporteconsolidadosaldopendientenotacredito'] == 1)
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
    if (this.opcionesmenu['tipocliente'] == 1 || this.opcionesmenu['cliente'] == 1 || this.opcionesmenu['transportista'] == 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  permisosBotonReporteVentas(): boolean
  {
    if (this.opcionesmenu['reporteventas'] == 1 || this.opcionesmenu['reporteventaformapago'] == 1 || this.opcionesmenu['resumenventas'] == 1 || this.opcionesmenu['reportecontrolventas'] == 1 || this.opcionesmenu['reporteventasdetalles'] == 1 || this.opcionesmenu['reporteventacredito'] == 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  permisosBotonReporteVentaProducto(): boolean
  {
    if (this.opcionesmenu['reporteventascategoria'] == 1 || this.opcionesmenu['reporteventasproductos'] == 1 || this.opcionesmenu['reporterotacionproducto'] == 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  permisosBotonReporteNotaCredito(): boolean
  {
    if (this.opcionesmenu['reportenotacredito'] == 1 || this.opcionesmenu['reportesaldonotacredito'] == 1 || this.opcionesmenu['reportepagonotacredito'] == 1 || this.opcionesmenu['reporteconsolidadosaldopendientenotacredito'] == 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  }
}