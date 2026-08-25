import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { CompraService } from 'src/app/compra/services/compra.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ConfigService } from 'src/app/shared/services/config.service';
import { Router } from '@angular/router';
import { NotaCreditoComprasService } from 'src/app/compra/services/nota-credito-compras.service';

import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-listado-compra-retencion',
  templateUrl: './listado-compra-retencion.component.html',
  styleUrls: ['./listado-compra-retencion.component.css']
})
export class ListadoCompraRetencionComponent implements OnInit {
  @Output() datosenviar: EventEmitter<any> = new EventEmitter<any>();
  
  opcionesmenu : any;
  multisucursal : string = "0";
  datos : any;
  datossucursal : any;
  filterpost = "";

  cod_sucursal : string = "";

  fechadesde : string = "";
  fechahasta : string = "";

  cod_factura_compra : string = "";

  loadinglistado : boolean = false;
  

  page = 1;
  count = 0;
  pagesize = 5;
  
  constructor(private router : Router, private compraservice:CompraService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private Notacreditocomprasservice: NotaCreditoComprasService, private usersession: UserSessionService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.opcionesmenu = this.usersession.getAllMenu();
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.listarSucursales();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  changeSucursal(event: any): void {
    const elemento = event.target.value;
    this.cod_sucursal= elemento;
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  visualizar()
  {
    let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/compras/facturacompra?codfacturacompra=" + this.cod_factura_compra, "", 'width=600,height=400,left=300,top=100');
     miVentana.focus();
  }

  clickBuscar()
  {
    if(this.datossucursal.length>0)
    {
      this.listarFacturas();
    }
    else
    {
      this.toastr.warning("Presiona F5 o Recarga la página, no se completó la conexión correctamente debido error de conectividad", "INFORMACIÓN DEL SISTEMA");
    }
  }

  agregar(cod_factura_compra: string, numero_factura: string, estado : string, proveedor : string)
  {
    this.cod_factura_compra = cod_factura_compra;
    this.buscarFacturaCompra();
  }

  formularioNormal()
  {
    this.filterpost="";
    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');
    this.cod_factura_compra = "";
    this.datos = [];
  }
 
  listarFacturas()
  {
    let opcion = "explorador";
    this.loadinglistado = true;
    

    this.compraservice.listarFacturas(this.fechadesde, this.fechahasta, this.cod_sucursal).subscribe( (data : any) =>
    {
      this.datos = data;
      this.loadinglistado = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
    
  }

  listarSucursales()
  {
    this.datossucursal = [];
    this.loadinglistado = true;
    
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursalesservice.listarSucursales().subscribe( (data : any) =>
    {
      this.datossucursal = data;
      this.loadinglistado = false;
      
      this.formularioNormal();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  buscarFacturaCompra()
  {
    this.loadinglistado = true;
  
    this.compraservice.buscarFactura(this.cod_factura_compra).subscribe( (data : any) =>
    {
      this.datosenviar.emit(data);
      /*
      this.cod_sucursal = data[0].cod_sucursal;
      this.sucursal = data[0].sucursal;
      
      this.numerocompraproveedor = data[0].codigo;

      this.inventario = data[0].inventario_factura;

      this.tipo_compra = data[0].tipo_compra;

      this.cod_usuario = data[0].cod_usuario;

      this.numero_factura = this.padLeft(data[0].numero_factura, 9);
  
      this.colormensaje = "";
      this.textomensaje = "";
  
      this.cod_identificacion = data[0].cod_identificacion;
      this.identificacion = data[0].identificacion;
      this.cod_proveedor = data[0].cod_proveedor;
      this.proveedor = data[0].proveedor;
      this.numero_identificacion = data[0].cedula;
      this.celular = data[0].celular;
      this.telefono = data[0].convencional;
      this.correo = data[0].correo;
      this.direccion = data[0].direccion;
  
      this.id_forma_pago = data[0].id_forma_pago;
      this.forma_pago = data[0].forma_pago;
       
      this.datosformapago = [];
      this.listarFormaPagos();
  
      this.diferencia = "";
      this.recibido = "";
  
      this.deudor = data[0].deudor;

      if(this.deudor==1){
        this.chkcontado = false;        
      }else{
        this.chkcontado = true;
      }

      this.fecha_registro = moment(data[0].fecha_emision).format('YYYY-MM-DD');
      
      */
     

      this.loadinglistado = false;
      

      $("#mymodal").modal("show");
    }, err => {
      this.loadinglistado = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }

  handlePageChange(event: number): void {
    this.page = event;
  }

}