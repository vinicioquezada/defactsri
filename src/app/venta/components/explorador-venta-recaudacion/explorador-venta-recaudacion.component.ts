import { Component, OnInit , ViewChild} from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { VentaService } from '../../services/venta.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ConfigService } from 'src/app/shared/services/config.service';
import { Router } from '@angular/router';
import { PedidoPanaderiaComponent } from 'src/app/shared/components/venta/pedido-panaderia/pedido-panaderia.component';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { SriVentaService } from 'src/app/shared/services/sri-venta.service';
import { lastValueFrom } from 'rxjs';
import { SwalService } from 'src/app/shared/services/swal.service';

@Component({
  selector: 'app-explorador-venta-recaudacion',
  templateUrl: './explorador-venta-recaudacion.component.html',
  styleUrls: ['./explorador-venta-recaudacion.component.css']
})
export class ExploradorVentaRecaudacionComponent implements OnInit {
  multisucursal : string = "0";
  electronico : string = "0";
  kardex : string = "";
  datos : any;
  filterpost = "";

  cod_sucursal : string = "";

  estado : string = "";
  estado_comprobante : string = "";

  fechadesde : string = "";
  fechahasta : string = "";
 
  cod_proyecto : string = "";
  claveacceso : string = "";

  numero_factura : string = "";
  cliente : string = "";
  cod_factura_venta : string = "";
  tipo_venta : string = "";
  ptoemi : string = "";
  correo : string = "";

  serieestab : string = "";
  ruc : string = "";
  tipoambiente : string = "";
  razon_social : string = "";
  nombre_comercial : string = "";
  contabilidad : string = "";
  direccion_matriz : string = "";
  direccion_establecimiento : string = "";
  tipo_contribuyente : string = "";
  contribuyente : string = "";
  leyenda : string = "";

  loading : boolean = false;
  loadinglistado : boolean = false;
  loadingmodal : boolean = false;

  disabledbtnrecaudar : boolean = true;
  //disabledbtnanular : boolean = false;

  @ViewChild(PedidoPanaderiaComponent) childpedidopanaderia: any;

  firmasruc: string = "";

  importetotal : number = 0.00;
  recibido : string = "";
  diferenciavalor : string = "";

  formapago: any = [];

  codigo_iva: string;
  
  page = 1;
  count = 0;
  pagesize = 10;

  constructor(private router : Router, private ventaservice: VentaService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private usersession: UserSessionService, private sriventa: SriVentaService, private configService: ConfigService, private swalservice: SwalService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.electronico = this.usersession.getConfiguracion("electronico");
    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
    this.kardex = this.usersession.getConfiguracion("kardex");
    this.firmasruc = this.usersession.getConfiguracion("firmasruc");
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.codigo_iva = this.usersession.getConfiguracion("codigo_iva");
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  changeEstadoRecaudacion(event: any): void {
    const elemento = event.target.value;
    this.estado = elemento;
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  imprimirPreVenta()
  {
    if(this.tipo_venta=="FACTURA" || this.tipo_venta=="ELECTRONICA")
      {
       let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/facturaventa?codfacturaventa=" + this.cod_factura_venta + "&electronico=" + this.electronico, "Factura de Venta", 'width=600,height=400,left=300,top=100');
       miVentana.focus();
      }
      
     if(this.tipo_venta=="RECIBO")
     {
       let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/recibo?codfacturaventa=" + this.cod_factura_venta, "Nota de Venta", 'width=600,height=400,left=300,top=100');
       miVentana.focus();
     }
   
     if(this.tipo_venta=="PROFORMA")
     {
       let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/proforma?codfacturaventa=" + this.cod_factura_venta, "Proforma", 'width=600,height=400,left=300,top=100');
       miVentana.focus();
     }
  }
  
  recaudar()
  {
    this.mantenerEstados();
    this.router.navigate(["/menuventa/aprobarpreventa", "recaudar", this.cod_factura_venta]);
  }

  clickBuscar()
  {
    this.listarPorRecaudarVentas(1);
  }

  opciones(item: any)
  {
    this.cod_factura_venta = item.cod_factura_venta;
    this.numero_factura = item.numero_factura;
    this.tipo_venta = item.tipo_venta;
    this.cliente = item.cliente;
    this.claveacceso = item.claveacceso;
    this.ptoemi = item.ptoemi;
    this.correo = item.correo;
    this.estado_comprobante = item.estado;

    if(item.estado_recaudado==0) {
      this.disabledbtnrecaudar = false;
    } else {
      this.disabledbtnrecaudar = true;
    }
   
    $("#mymodalopciones").modal("show");
  }

  formularioNormal()
  {
    this.page = 1;
    this.filterpost="";

    this.tipo_venta = "";
    this.claveacceso = "";

    this.estado = "0";
    this.estado_comprobante = "";

    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');
   
    this.numero_factura = "";
    this.cod_factura_venta = "";

    this.datos = [];

    const savedtipoformulario = sessionStorage.getItem("tipo_formulario");//Restaurar datos
    const savedcodsucursal = sessionStorage.getItem("cod_sucursal");
    const savedestado = sessionStorage.getItem("estado");
    const savedpage = parseInt(sessionStorage.getItem("page"));
    const savedfechadesde = sessionStorage.getItem("fechadesde");
    const savedfechahasta = sessionStorage.getItem("fechahasta");
    if (savedtipoformulario=="explorador_venta_recaudacion") {
      this.cod_sucursal = savedcodsucursal;
      this.estado = savedestado;
      this.fechadesde = savedfechadesde;
      this.fechahasta = savedfechahasta;
      sessionStorage.removeItem("tipo_formulario");
      sessionStorage.removeItem("cod_sucursal");
      sessionStorage.removeItem("estado");
      sessionStorage.removeItem("page");
      sessionStorage.removeItem("fechadesde");
      sessionStorage.removeItem("fechahasta");
      this.listarPorRecaudarVentas(savedpage);
    }
    else
    {
      sessionStorage.removeItem("tipo_formulario");
      sessionStorage.removeItem("cod_sucursal");
      sessionStorage.removeItem("estado");
      sessionStorage.removeItem("page");
      sessionStorage.removeItem("fechadesde");
      sessionStorage.removeItem("fechahasta");
    }
  }

  mantenerEstados()
  {
    sessionStorage.setItem("tipo_formulario", "explorador_venta_recaudacion");//Restaurar datos
    sessionStorage.setItem("cod_sucursal", this.cod_sucursal);
    sessionStorage.setItem("estado", this.estado);
    sessionStorage.setItem("page", String(this.page));
    sessionStorage.setItem("fechadesde", this.fechadesde);
    sessionStorage.setItem("fechahasta", this.fechahasta);
  }
 
  listarPorRecaudarVentas(page: number)
  {
    this.page = page;
    this.filterpost="";

    this.loadinglistado = true;

    this.ventaservice.listarPorRecaudarVentas(this.fechadesde, this.fechahasta, this.cod_sucursal, this.estado).subscribe( (data : any) =>
    {
      this.datos = data;
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

  async cobrarVenta(item: any)
  {
    this.cod_factura_venta = item.cod_factura_venta;
    this.ruc = item.ruc_sucursal;
    this.numero_factura = item.numero_factura;
    this.serieestab = item.serieestab;
    this.ptoemi = item.ptoemi;
    this.tipoambiente = item.tipo_ambiente;
    this.claveacceso = item.claveacceso;
    this.cliente = item.cliente;
    this.correo = item.correo;
    this.importetotal = item.importetotal;
    this.tipo_venta = item.tipo_venta;
    this.estado_comprobante = item.estado;

    const recibido = await this.swalservice.alertRecaudacion(item);

    if (recibido !== null) {
      this.recibido = String(recibido);
      this.diferenciavalor = redondeardecimales(recibido - this.importetotal, 2);
      this.aprobarRecaudacionVenta();
    }
  }

  async aprobarRecaudacionVenta()
  {
    this.swalservice.iniciarLoading("Recaudando...");

      let factura_venta = {
        'cod_factura_venta' : this.cod_factura_venta,
        'recibido' : this.recibido,
        'diferencia' : this.diferenciavalor
      };

      try
      {
        const data: any = await lastValueFrom(this.ventaservice.aprobarRecaudacionVenta(factura_venta));
        
          if (data.estado == true)
          {
            this.toastr.success("Factura de Venta aprobada correctamente", "INFORMACIÓN DEL SISTEMA");
            this.datos = this.datos.filter(
              elemento => elemento.cod_factura_venta != this.cod_factura_venta
            );

            if (this.tipo_venta == "ELECTRONICA" && this.estado_comprobante == "CREADA") {
              const cod_proyecto = this.cod_proyecto;
              await this.sriventa.actualizarFechaClaveAccesoActual(this.cod_factura_venta, this.numero_factura, this.ruc, this.tipoambiente, this.serieestab, this.ptoemi);

              const { cliente, rucempresa, facturaventa, formapago, datosdetalles } = await this.sriventa.buscarFactura(this.cod_factura_venta, this.codigo_iva);

              this.sriventa.iniciarProcesoFacturacion(cod_proyecto, cliente, rucempresa, facturaventa, formapago, datosdetalles, "envio");
            }

            this.swalservice.close();
            this.calcularRecibido();
          }
          else
          {
            this.toastr.error("Factura de Venta no se pudo aprobar, error inesperado", "INFORMACIÓN DEL SISTEMA");
          }

      }
      catch (err) {
        this.swalservice.close();
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      }
  }

  async calcularRecibido()
  {
    let diferencia = "Cambio: " + this.diferenciavalor;

    const ok = await this.swalservice.alertOkRequerido({
    title: diferencia,
    text: "Recibido: " + this.recibido,
    confirmText: "ACEPTAR Y CONTINUAR"
    });
  }

  

}