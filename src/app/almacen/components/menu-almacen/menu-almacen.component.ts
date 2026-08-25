import { Component, OnInit } from '@angular/core';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
declare var $:any;

@Component({
  selector: 'app-menu-almacen',
  templateUrl: './menu-almacen.component.html',
  styleUrls: ['./menu-almacen.component.css']
})
export class MenuAlmacenComponent implements OnInit {
  
  opcionesmenu : any;
  constructor(private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.opcionesmenu = this.usersession.getAllMenu();
  }

  permisosProcesosOperativos(): boolean
  {
    if (this.opcionesmenu['productos'] == 1 || this.opcionesmenu['buscarproducto'] == 1 || this.opcionesmenu['movimientomercaderia'] == 1 || this.opcionesmenu['ingresomercaderia'] == 1 || this.opcionesmenu['salidamercaderia'] == 1)
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
    if (this.opcionesmenu['exploradorproducto'] == 1 || this.opcionesmenu['exploradormovimientomercaderia'] == 1 || this.opcionesmenu['verificacionmovimientomercaderia'] == 1 || this.opcionesmenu['exploradoringresomercaderia'] == 1 || this.opcionesmenu['exploradorsalidamercaderia'] == 1)
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
    if (this.opcionesmenu['reportestockproducto'] == 1 || this.opcionesmenu['reporteingresomercaderia'] == 1 || this.opcionesmenu['reportesalidamercaderia'] == 1 || this.opcionesmenu['reportemovimientomercaderia'] == 1)
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
    if (this.opcionesmenu['categorias'] == 1 || this.opcionesmenu['subcategorias'] == 1 || this.opcionesmenu['marcas'] == 1 || this.opcionesmenu['unidadesmedida'] == 1 || this.opcionesmenu['tipotarifa'] == 1 || this.opcionesmenu['denominacion'] == 1 || this.opcionesmenu['tipoingresomercaderia'] == 1 || this.opcionesmenu['tiposalidamercaderia'] == 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  clickReporteKardex()
  {
    $("#mymodalopcionesreportekardex").modal("show");
  }

  permisosBotonReporteKardex(): boolean
  {
    if (this.opcionesmenu['registrokardex'] == 1 || this.opcionesmenu['reportecostoproducto'] == 1 || this.opcionesmenu['reportemargenganancia'] == 1 || this.opcionesmenu['reporteingresosmanuales'] == 1 || this.opcionesmenu['reportesalidasmanuales'] == 1 || this.opcionesmenu['reportecaducidad'] == 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

}