import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { VentaService } from 'src/app/venta/services/venta.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ConfigService } from 'src/app/shared/services/config.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-listar-ventas-cliente',
  templateUrl: './listar-ventas-cliente.component.html',
  styleUrls: ['./listar-ventas-cliente.component.css']
})
export class ListarVentasClienteComponent implements OnInit {
  @Output() datosenviar: EventEmitter<any> = new EventEmitter<any>();
  
  opcionesprivilegios : any;

  estado : string = "";

  multisucursal : string = "0";
  datos : any;
  datossucursal : any;
  filterpost = "";

  cod_sucursal : string = "";
  cod_cliente : string = "";

  fechadesde : string = "";
  fechahasta : string = "";
 
  cod_proyecto : string = "";
  
  loadinglistado : boolean = false;

  cantidad_registros : number = 0;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private ventaservice:VentaService, private toastr: ToastrService, private error:ErrorService, private usersession: UserSessionService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  clickBuscar()
  {
    this.listarFacturasVentasPorCliente();
  }

  formularioNormal()
  {
    this.page = 1;
    this.filterpost="";

    this.estado = "0";

    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');

    this.datos = [];
  }
 
  listarFacturasVentasPorCliente()
  {
    this.filterpost="";

    this.loadinglistado = true;

    this.ventaservice.listarFacturasVentasPorCliente(this.fechadesde, this.fechahasta, this.cod_sucursal, this.cod_cliente).subscribe( (data : any) =>
    {
      this.datos = data;
      this.cantidad_registros = data.length;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
    
  }

  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }

  handlePageChange(event: number): void {
    this.page = event;
  }

  revisarDocumentoError(cod_factura_venta: string)
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/facturas/4_rechazados/" + cod_factura_venta + ".xml", "Documento", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }

  revisarDocumentoXml(cod_factura_venta: string)
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/facturas/1_creados/" + cod_factura_venta + ".xml", "Documento", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }

  imprimirVenta(cod_factura_venta: string)
  {
    let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/facturaventa?codfacturaventa=" + cod_factura_venta + "&electronico=1", "Factura de Venta", 'width=600,height=400,left=300,top=100');
    miVentana.focus();
  }

  descargarRide(cod_factura_venta: string)
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/facturas/0_ride/" + cod_factura_venta + ".pdf", "Ride", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }
  
  agregar(item : any)
  {
    this.datosenviar.emit(item);
    $("#mymodallistadoventascliente").modal("hide");
  }

}