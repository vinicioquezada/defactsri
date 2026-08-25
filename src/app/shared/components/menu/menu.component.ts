import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/shared/services/config.service';
import { HeaderMenus } from '../../models/header-menus.dto';
import { AccessService } from '../../services/access.service';
import { Router } from '@angular/router'
import { UserSessionService } from '../../services/user-session.service';
declare var $:any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  
  opcionesmenu : any;
  color_menu_activo : string = "";
  rol : string = "";
  menuadministrar : Boolean = false;
  menualmacen : Boolean = false;
  menuventas : Boolean = false;
  menuhotel : Boolean = false;
  menucompras : Boolean = false;
  menuretencion : Boolean = false;
  menucuentaspc : Boolean = false;
  menugastosingresos : Boolean = false;
  menugym : Boolean = false;
  urlfoto : string = "";
  sucursal: string = "";
  constructor(private router: Router, private accessservice: AccessService, private usersession: UserSessionService, private configService: ConfigService)
  {
    this.urlfoto = this.configService.settings.baseUrl + "/fotouser/" + this.usersession.getConfiguracion("foto");
   }

  clickMenu() {
    if ($(window).width() <= 991) {
      let body = $("#appmenu");
      body.removeClass("sidebar-open");
      body.addClass("sidebar-collapse");
    }
  }

  controlSidebar() {
    let body = $("#appmenu");

    if ($(window).width() <= 991) {
      body.removeClass("sidebar-open");
      body.addClass("sidebar-collapse");
    } else {
      body.removeClass("sidebar-collapse");
    }
  }

  ngOnInit(): void {
    this.sucursal = this.usersession.getConfiguracion("sucursal");
    this.opcionesmenu = this.usersession.getAllMenu();
    //console.log( this.validacion.obtenerMenuAdministrar() );
    /*Configuraciones del Usuario y Sucursales*/
    this.rol = this.usersession.getConfiguracion("rol");

    this.controlSidebar();

    window.addEventListener('resize', () => {
      this.controlSidebar();
    });

    /*Configuraciones del Menú Administrar*/
    if(this.opcionesmenu["roles"] == 1 || this.opcionesmenu["empleados"] == 1 || this.opcionesmenu["usuarios"] == 1)
    {
      this.menuadministrar = true;
    }

    /*Configuraciones del Menú Almacen*/
    if(this.opcionesmenu["categorias"] == 1 || this.opcionesmenu["subcategorias"] == 1 || this.opcionesmenu["marcas"] == 1
      || this.opcionesmenu["unidadesmedida"] == 1 || this.opcionesmenu["codigobarra"] == 1 || this.opcionesmenu["productos"] == 1 || this.opcionesmenu["denominacion"] == 1 || this.opcionesmenu["reportestockproducto"] == 1 || this.opcionesmenu["exploradorproducto"] == 1 || this.opcionesmenu["tipoingresomercaderia"] == 1 || this.opcionesmenu["ingresomercaderia"] == 1 || this.opcionesmenu["tipotarifa"] == 1 || this.opcionesmenu["tiposalidamercaderia"] == 1  || this.opcionesmenu["exploradoringresomercaderia"] == 1 || this.opcionesmenu["salidamercaderia"] == 1 || this.opcionesmenu["exploradorsalidamercaderia"] == 1
      || this.opcionesmenu["reporteingresomercaderia"] == 1 || this.opcionesmenu["reportesalidamercaderia"] == 1 || this.opcionesmenu["buscarproducto"] == 1)
    {
      this.menualmacen = true;
    }

    /*Configuraciones del Menú Ventas*/    
    if(this.opcionesmenu["tipocliente"] == 1 || this.opcionesmenu["cliente"] == 1 || this.opcionesmenu["facturaventa"] == 1
      || this.opcionesmenu["exploradorventa"] == 1 || this.opcionesmenu["exploradorfactura"] == 1 || this.opcionesmenu["exploradornotacredito"] == 1
      || this.opcionesmenu["transportista"] || this.opcionesmenu["exploradorguiaremision"] == 1 || this.opcionesmenu["buscarproforma"] == 1 || this.opcionesmenu["reporteclientes"] == 1
      || this.opcionesmenu["reporteventas"] == 1 || this.opcionesmenu["reporteventasdetalles"] == 1 || this.opcionesmenu["reporterotacionproducto "] == 1 || this.opcionesmenu["reporteventasproductos"] == 1
      || this.opcionesmenu["cajero"] == 1 || this.opcionesmenu["exploradorcajero"] == 1 || this.opcionesmenu["reporteventascategoria"] == 1
      || this.opcionesmenu["reporteventacredito"] == 1 || this.opcionesmenu["reportemargenganancia"] == 1
      || this.opcionesmenu["reportenotacredito"] == 1 || this.opcionesmenu["reporteguiaremision"] == 1 || this.opcionesmenu["exploradorpedidos"] == 1)
    {
      this.menuventas = true;
    }

    /*Configuraciones del Menú Compras*/ 
    if(this.opcionesmenu["proveedores"] == 1 || this.opcionesmenu["exploradorproveedores"] == 1 || this.opcionesmenu["facturacompra"] == 1 || this.opcionesmenu["exploradorcompra"] == 1 || this.opcionesmenu["reporteproveedores"] == 1 || this.opcionesmenu["reportecompra"] == 1 || this.opcionesmenu["reportecomprascredito"] == 1)
    {
      this.menucompras = true;
    }

    /*Configuraciones del Menú Retencion*/ 
    if(this.opcionesmenu["codigoretencion"] == 1 || this.opcionesmenu["retencion"] == 1 || this.opcionesmenu["exploradorretencion"] == 1 || this.opcionesmenu["reporteretencion"] == 1)
    {
      this.menuretencion = true;
    }


    /*Configuraciones del Menú Cuentas por pagar y cobrar*/ 
    if(this.opcionesmenu["credito"] == 1 || this.opcionesmenu["abonoventa"] == 1 || this.opcionesmenu["abonocompra"] == 1 || this.opcionesmenu["reporteventaporcobrar"] == 1 || this.opcionesmenu["reportecorteporcobrar"] == 1 || this.opcionesmenu["reportecompraporpagar"] == 1
    || this.opcionesmenu["reporteabonocompra"] == 1 || this.opcionesmenu["reporteabonoventa"] == 1)
    {
      this.menucuentaspc = true;
    }

    /*Configuraciones del Menú Cuentas por pagar y cobrar*/ 
    if(this.opcionesmenu["categoriaingresos"] == 1 || this.opcionesmenu["ingresos"] == 1 || this.opcionesmenu["reporteingresos"] == 1 || this.opcionesmenu["categoriagastos"] == 1 || this.opcionesmenu["gastos"] == 1 || this.opcionesmenu["reportegastos"] == 1)
    {
      this.menugastosingresos = true;
    }

    /*Configuraciones del Menú Hotel*/ 
    if(this.opcionesmenu["servicioshotel"] == 1 || this.opcionesmenu["exploradordepartamentos"] == 1)
    {
      this.menuhotel = true;
    }

    /*Configuraciones del Menú Gym*/ 
    if(this.opcionesmenu["socios"] == 1 || this.opcionesmenu["planes"] == 1 || this.opcionesmenu["membresias"] == 1 || this.opcionesmenu["ventadiario"] == 1 || this.opcionesmenu["exploradorventamembresias"] == 1 || this.opcionesmenu["reportesocios"] == 1 || this.opcionesmenu["reporteestadomembresia"] == 1 || this.opcionesmenu["reportepromocionalmes"] == 1)
    {
      this.menugym = true;
    }
  }

  cerrarsesion()
  {
    this.usersession.clear();
    localStorage.clear();
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