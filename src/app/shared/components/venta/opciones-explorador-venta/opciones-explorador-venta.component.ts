import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { VentaService } from 'src/app/venta/services/venta.service';
import { MembresiaService } from 'src/app/gym/services/membresia.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { ConfigService } from 'src/app/shared/services/config.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { NotaCreditoService } from 'src/app/venta/services/nota-credito.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { lastValueFrom } from 'rxjs';
import { SriVentaService } from 'src/app/shared/services/sri-venta.service';
import { FacturaVentaDTO } from 'src/app/venta/models/factura-venta.dto';
import { ClienteDTO } from 'src/app/venta/models/cliente.dto';
import { RucEmpresaDTO } from 'src/app/usuario/models/rucempresa.dto';
import { SwalService } from 'src/app/shared/services/swal.service';

@Component({
  selector: 'app-opciones-explorador-venta',
  templateUrl: './opciones-explorador-venta.component.html',
  styleUrls: ['./opciones-explorador-venta.component.css']
})
export class OpcionesExploradorVentaComponent implements OnInit {
  @Input() tipoformulario: string = "";
  @Output() datosenvioestado: EventEmitter<any> = new EventEmitter<any>();
  @Output() datosenviocorreo: EventEmitter<any> = new EventEmitter<any>();
  
  opcionesprivilegios : any;

  electronico : string = "0";
  kardex : string = "";

  estado_comprobante : string = "";

  cod_proyecto : string = "";
  claveacceso : string = "";

  numero_factura : string = "";
  cliente : string = "";
  cod_factura_venta : string = "";
  tipo_venta : string = "";
  ptoemi : string = "";
  correo : string = "";
  fecha_hora: string = "";
  
  error_sri: number = 0;

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

  arr_factura_venta : any;

  loadingmodal : boolean = false;

  disabledbtneditar : boolean = false;
  disabledbtnenviarcorreo : boolean = false;
  disabledbtnenviarsri : boolean = false;
  disabledbtnanular : boolean = false;
  disabledbtndescargarride : boolean = false;
  disabledbtndescargarxml : boolean = false;
  disabledbtndescargardocumentos : boolean = false;
  disabledbtncomprobarsri : boolean = false;
  disabledbtncrearride : boolean = false;
  disabledbtnnotacredito : boolean = false;

  /*Formulario Gym*/
  plan : string = "";

  /*Formulario Hotel*/
  cod_reserva : string = "";
  formapago: any = [];

  cod_sucursal : string = "";
  cod_ruc: string = "";
  cod_tipo_documento : string = "";
  fechadesde : string = "";
  fechahasta : string = "";
  estado : string = "";
  page : string = "";
  
  recaudador: string = "";
  excluir_general: number = 0;
  estado_recaudado: number = 0;
  codigo_iva: string;

  monitor_actividades: string = "";
  id_membresia: number = 0;

  constructor(private router : Router, private ventaservice:VentaService, private toastr: ToastrService, private error:ErrorService, private membresiaservice : MembresiaService, private notacreditoservice: NotaCreditoService, private usersession: UserSessionService, private sriventa: SriVentaService, private configService: ConfigService, private swalservice: SwalService) { }

  ngOnInit(): void {
    this.electronico = this.usersession.getConfiguracion("electronico");
    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
    this.kardex = this.usersession.getConfiguracion("kardex");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.recaudador = this.usersession.getConfiguracion("recaudador");
    this.codigo_iva = this.usersession.getConfiguracion("codigo_iva");
    this.monitor_actividades = this.usersession.getConfiguracion("monitor_actividades");
    this.formularioNormal();
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  crearNotaCredito()
  {
    this.mantenerEstados();
    this.router.navigate(["/menuventa/notacredito", "nuevoregistro", this.cod_factura_venta]);
  }

  crearGuiaRemision()
  {
    this.mantenerEstados();
    this.router.navigate(["/menuventa/guiaremision", "nuevoregistro", this.cod_factura_venta, 0]);
  }

  descargarRide()
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/facturas/0_ride/" + this.cod_factura_venta + ".pdf", "Ride", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }

  descargarXml()
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/facturas/3_autorizados/" + this.cod_factura_venta + ".xml", "Documento", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }

  descargarDocumentos()
  {
	  window.open(this.configService.settings.baseUrlSri + "/ride/descargararchivofacuraventa.php?cod_proyecto=" + this.cod_proyecto + "&cod_factura_venta=" + this.cod_factura_venta + "&numero_factura=" + this.padLeft(this.numero_factura, 9) + "&serieestab=" + this.serieestab + "&ptoemi=" + this.ptoemi + "&op=2");
  }

  descargarXmlAutorizado()
  {
	  window.open(this.configService.settings.baseUrlSri + "/ride/descargararchivofacuraventa.php?cod_proyecto=" + this.cod_proyecto + "&cod_factura_venta=" + this.cod_factura_venta + "&numero_factura=" + this.padLeft(this.numero_factura, 9) + "&serieestab=" + this.serieestab + "&ptoemi=" + this.ptoemi + "&op=1");
  }

  imprimirVenta()
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
   
   /*
    if(this.tipo_venta=="PEDIDO RESERVADO")
    {
      let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/pedido?codfacturaventa=" + this.cod_factura_venta, "Nota de Pedido", 'width=600,height=400,left=300,top=100');
      miVentana.focus();
    }

    if(this.tipo_venta=="PEDIDO PANADERIA")
    {
      let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/pedidopanaderia?codfacturaventa=" + this.cod_factura_venta, "Nota de Pedido", 'width=600,height=400,left=300,top=100');
      miVentana.focus();
    }
    */
  }

  imprimirVentaGym()
  {
    if(this.tipo_venta=="FACTURA" || this.tipo_venta=="ELECTRONICA")
    {
     let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/facturaventamembresia?codfacturaventa=" + this.cod_factura_venta + "&electronico=" + this.electronico, "Factura de Venta", 'width=600,height=400,left=300,top=100');
     miVentana.focus();
    }
    
   if(this.tipo_venta=="RECIBO")
   {
     let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/recibomembresia?codfacturaventa=" + this.cod_factura_venta, "Nota de Venta", 'width=600,height=400,left=300,top=100');
     miVentana.focus();
   }
 
   if(this.tipo_venta=="PROFORMA")
   {
     let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/proformamembresia?codfacturaventa=" + this.cod_factura_venta, "Proforma", 'width=600,height=400,left=300,top=100');
     miVentana.focus();
   }
  }

  async editarVenta()
  {
    if(this.tipo_venta=="ELECTRONICA")
    {
      if(this.estado_comprobante != "AUTORIZADO")
      {
        try
        {
          this.swalservice.iniciarLoading("Procesando con el SRI...");
          let facturaventa1: FacturaVentaDTO = new FacturaVentaDTO;
          facturaventa1.claveacceso = this.claveacceso;

          const resultadocomprobacionsri = await this.sriventa.verificarComprobanteSri(facturaventa1);
          const data = resultadocomprobacionsri.data;
          if(resultadocomprobacionsri.estado)
          {
              if(data.estadomensaje=="AUTORIZADO")
              {
                await this.swalservice.alertOkRequerido({
                  title: "Control del Sistema",
                  text: "El comprobante Nº " + this.numero_factura + " no se puede editar porque está en estado AUTORIZADA, precione el boton Enviar SRI para actualizar el estado",
                  icon: "info"
                });
              }
              else
              {
                if(data.estadomensaje=="EN PROCESO")
                {
                  await this.swalservice.alertOkRequerido({
                    title: "Control del Sistema",
                    text: "El comprobante Nº " + this.numero_factura + " no se puede editar porque está en estado EN PROCESO, precione el boton Enviar SRI para actualizar el estado",
                    icon: "info"
                  });
                }
                else
                {
                  this.mantenerEstados();
                  this.router.navigate(["/menuventa/venta", "actualizarregistro", this.cod_factura_venta]);
                }
              }
          }
          else
          {
            /**/
            if(this.estado_comprobante == "EN PROCESO")
            {
                const fecha_hora_servidor =  data.fechahora;
                const fecha_hora = this.fecha_hora;
                const momentservidor = moment(fecha_hora_servidor);
                const momentfactura = moment(fecha_hora).add(1, 'days'); // Sumamos 24 horas
                if (momentfactura.isAfter(momentservidor))
                {
                  await this.swalservice.alertOkRequerido({
                    title: "Control del Sistema",
                    text: "El comprobante Nº " + this.numero_factura + " con fecha " + fecha_hora + " esta en estado EN PROCESO, no se puede editar hasta obtener un resultado de autorización. Debe esperar máximo 24 Horas a partir de la fecha y hora del comprobante para poder comprobar su autorización",
                    icon: "info"
                  });
                }
                else
                {
                    this.mantenerEstados();
                    this.router.navigate(["/menuventa/venta", "actualizarregistro", this.cod_factura_venta]);
                }
            }
            else
            {
                this.mantenerEstados();
                this.router.navigate(["/menuventa/venta", "actualizarregistro", this.cod_factura_venta]);
            }
            /**/
          }
        } catch (err) {
          this.toastr.error(err.message || err, "INFORMACIÓN DEL SISTEMA");
        } finally {
          this.swalservice.close();
        }
      }
      else
      {
          this.mantenerEstados();
          this.router.navigate(["/menuventa/venta", "actualizarregistro", this.cod_factura_venta]);
      } 
    }
    else
    {
      this.mantenerEstados();
      this.router.navigate(["/menuventa/venta", "actualizarregistro", this.cod_factura_venta]);
    }
  }

  async editarVentaGym()
  {
    let cod_tipo_plan = 1; //0 es diario 1 es mensual
    if(this.plan == "" || this.plan == null) {
      cod_tipo_plan = 0;
    }

    if(this.tipo_venta=="ELECTRONICA")
    {
      if(this.estado_comprobante != "AUTORIZADO")
      {
        try
        {
          this.swalservice.iniciarLoading("Procesando con el SRI...");
          let facturaventa1: FacturaVentaDTO = new FacturaVentaDTO;
          facturaventa1.claveacceso = this.claveacceso;

          const resultadocomprobacionsri = await this.sriventa.verificarComprobanteSri(facturaventa1);
          const data = resultadocomprobacionsri.data;
          if(resultadocomprobacionsri.estado)
          {
              if(data.estadomensaje=="AUTORIZADO")
              {
                await this.swalservice.alertOkRequerido({
                  title: "Control del Sistema",
                  text: "El comprobante Nº " + this.numero_factura + " no se puede editar porque está en estado AUTORIZADA, precione el boton Enviar SRI para actualizar el estado",
                  icon: "info"
                });
              }
              else
              {
                if(data.estadomensaje=="EN PROCESO")
                {
                  await this.swalservice.alertOkRequerido({
                    title: "Control del Sistema",
                    text: "El comprobante Nº " + this.numero_factura + " no se puede editar porque está en estado EN PROCESO, precione el boton Enviar SRI para actualizar el estado",
                    icon: "info"
                  });
                }
                else
                {
                  this.mantenerEstados();
                  this.router.navigate(["/menugym/facturaplan", "actualizarregistro", 0, this.cod_factura_venta, cod_tipo_plan]);
                }
              }
          }
          else
          {
            /**/
            if(this.estado_comprobante == "EN PROCESO")
            {
                const fecha_hora_servidor =  data.fechahora;
                const fecha_hora = this.fecha_hora;
                const momentservidor = moment(fecha_hora_servidor);
                const momentfactura = moment(fecha_hora).add(1, 'days'); // Sumamos 24 horas
                if (momentfactura.isAfter(momentservidor))
                {
                  await this.swalservice.alertOkRequerido({
                    title: "Control del Sistema",
                    text: "El comprobante Nº " + this.numero_factura + " con fecha " + fecha_hora + " esta en estado EN PROCESO, no se puede editar hasta obtener un resultado de autorización. Debe esperar máximo 24 Horas a partir de la fecha y hora del comprobante para poder comprobar su autorización",
                    icon: "info"
                  });
                }
                else
                {
                    this.mantenerEstados();
                    this.router.navigate(["/menugym/facturaplan", "actualizarregistro", 0, this.cod_factura_venta, cod_tipo_plan]);
                }
            }
            else
            {
                this.mantenerEstados();
                this.router.navigate(["/menugym/facturaplan", "actualizarregistro", 0, this.cod_factura_venta, cod_tipo_plan]);
            }
            /**/
          }
        } catch (err) {
          this.toastr.error(err.message || err, "INFORMACIÓN DEL SISTEMA");
        } finally {
          this.swalservice.close();
        }
      }
      else
      {
          this.mantenerEstados();
          this.router.navigate(["/menugym/facturaplan", "actualizarregistro", 0, this.cod_factura_venta, cod_tipo_plan]);
      } 
    }
    else
    {
      this.mantenerEstados();
      this.router.navigate(["/menugym/facturaplan", "actualizarregistro", 0, this.cod_factura_venta, cod_tipo_plan]);
    }
  }

  copiar()
  {
    this.mantenerEstados();
    this.router.navigate(["/menuventa/venta", "copiarregistro", this.cod_factura_venta]);
  }

  copiarConDescuento()
  {
    this.mantenerEstados();
    this.router.navigate(["/menuventa/ventadescuento", "copiarregistro", this.cod_factura_venta]);
  }

  mantenerEstados()
  {
    sessionStorage.setItem("tipo_formulario", "explorador_venta");//Restaurar datos
    sessionStorage.setItem("cod_sucursal", this.cod_sucursal);
    sessionStorage.setItem("cod_ruc", this.cod_ruc);
    sessionStorage.setItem("estado", this.estado);
    sessionStorage.setItem("cod_tipo_documento", this.cod_tipo_documento);
    sessionStorage.setItem("page", this.page);
    sessionStorage.setItem("fechadesde", this.fechadesde);
    sessionStorage.setItem("fechahasta", this.fechahasta);
  }

  opciones(item: any)
  {
    this.ruc = item.ruc_sucursal
    this.tipoambiente = item.tipo_ambiente;
    this.cod_factura_venta = item.cod_factura_venta;
    this.numero_factura = item.numero_factura;
    this.tipo_venta = item.tipo_venta;
    this.cliente = item.cliente;
    this.claveacceso = item.claveacceso;
    this.serieestab = item.serieestab;
    this.ptoemi = item.ptoemi;
    this.correo = item.correo;
    this.arr_factura_venta = {};
    this.estado_comprobante = item.estado;
    this.excluir_general = item.excluir_general;
    this.estado_recaudado = item.estado_recaudado;
    this.fecha_hora = item.fecha_hora;
    this.error_sri = item.error_sri;

    if(this.tipoformulario == "exploradorventagym") {
      this.plan = item.plan;
      this.id_membresia = item.id_membresia;
    }

    if(this.tipo_venta=="ELECTRONICA")
    {
      if(item.estado=="AUTORIZADO")
      {
        if(item.cedula=="9999999999999")
        {
          this.configurarBotones(false, false, true, false, false, false, false, false, false, true);
        }
        else
        {
          this.configurarBotones(false, false, true, false, false, false, false, false, false, false);
        }
      }
      else
      {
        if(item.estado=="ANULADA")
        {
          this.configurarBotones(true, true, true, true, false, false, false, false, false, true);
        }
        else//CREADA
        {
          this.configurarBotones(false, true, false, false, true, true, true, false, true, true);
        }
      }
    }
    else
    {
      if(item.estado=="CREADA" && item.tipo_venta=="PEDIDO RESERVADO")
      {
        this.configurarBotones(false, true, true, false, true, true, true, true, true, true);
      }
      else
      {
        this.configurarBotones(false, true, true, false, true, true, true, true, true, false);
      }
  
      if(item.estado=="ANULADA")
      {
        this.configurarBotones(true, true, true, true, true, true, true, true, true, true);
      }
    }
   
    $("#mymodalopcionesventas").modal("show");
  }

  configurarBotones(disabledbtneditar: boolean, disabledbtnenviarcorreo: boolean, disabledbtnenviarsri: boolean, disabledbtnanular: boolean, disabledbtndescargarride: boolean, disabledbtndescargarxml: boolean, disabledbtndescargardocumentos: boolean, disabledbtncomprobarsri: boolean, disabledbtncrearride: boolean, disabledbtnnotacredito: boolean) {
    this.disabledbtneditar = disabledbtneditar;
    this.disabledbtnenviarcorreo = disabledbtnenviarcorreo;
    this.disabledbtnenviarsri = disabledbtnenviarsri;
    this.disabledbtnanular = disabledbtnanular
    this.disabledbtndescargarride = disabledbtndescargarride;
    this.disabledbtndescargarxml = disabledbtndescargarxml;
    this.disabledbtndescargardocumentos = disabledbtndescargardocumentos;
    this.disabledbtncomprobarsri = disabledbtncomprobarsri;
    this.disabledbtncrearride = disabledbtncrearride;
    this.disabledbtnnotacredito = disabledbtnnotacredito;
  }

  formularioNormal()
  {
    this.tipo_venta = "";
    this.claveacceso = "";

    this.estado_comprobante = "";
   
    this.numero_factura = "";
    this.cod_factura_venta = "";

    this.plan = "";
  }

  clickAnular()
  {
    if(this.opcionesprivilegios.bloqueoanulacionventasrecaudacion==1)
    {
      if(this.recaudador == "1") {
        this.verificarRecaudacionFactura();
      } else {
        this.verificarNotaCreditoAnular();
      }
    }
    else
    {
      this.verificarNotaCreditoAnular();
    }
  }

  verificarRecaudacionFactura()
  {
    this.loadingmodal = true;
    this.ventaservice.verificarRecaudacionFactura(this.cod_factura_venta).subscribe( (data : any) =>
    {
      this.loadingmodal = false;
        if(data.estado_recaudado == 1) {
          this.toastr.warning("El comprobante de venta está recaudado, no se puede anular, no tiene los permisos", "INFORMACIÓN DEL SISTEMA");
        } else {
          this.verificarNotaCreditoAnular();
        }
    }, err => {
      this.loadingmodal = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  anularFacturaVenta = () =>{
     
    if(this.tipo_venta=="ELECTRONICA" && this.estado_comprobante == "AUTORIZADO")
    {
      this.comprobarSriAnular();
    }
    else
    {
      if(this.estado_comprobante == "CREADA")
      {
        if(this.tipoformulario == "exploradorventa") {
          this.guardarAnulacionFactura();
        }
  
        if(this.tipoformulario == "exploradorventagym") {
          this.guardarAnulacionFacturaGym();
        }
      }
      else
      {
        this.toastr.error("No se puede anular el comprobante, para anular debe estar en estdo Autorizado o Creada", "INFORMACIÓN DEL SISTEMA");
      }
    }
  }

  comprobarSriAnular(){
    let parametros = {
      'claveacceso' : this.claveacceso
    };
  
    this.loadingmodal = true;

    this.ventaservice.verificarComprobanteSri(parametros).subscribe( (data : any) =>
    {
        this.loadingmodal = false;
        if(data.estadomensaje=="0")
        {
          if(this.tipoformulario == "exploradorventa") {
            this.guardarAnulacionFactura();
          }
    
          if(this.tipoformulario == "exploradorventagym") {
            this.guardarAnulacionFacturaGym();
          }
        }
        else
        {
          this.toastr.error(data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
        }
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loadingmodal = false;
    });
  }

  guardarAnulacionFactura = () =>{

    this.loadingmodal = true;

    const parametros = {
      'cod_factura_venta' : this.cod_factura_venta,
      'claveacceso' : this.claveacceso,
      'kardex' : this.kardex
    };

    this.ventaservice.anularFacturaVenta(parametros).subscribe( (data : any) =>
    {
        this.loadingmodal = false;

        if (data.estado == true)
        {
          this.toastr.success("Factura Anulada Correctamente, se restablecieron valores del inventario", "INFORMACIÓN DEL SISTEMA");
          $("#mymodalopcionesventas").modal("hide");
          const parametrosenviar = {
            'cod_factura_venta' : this.cod_factura_venta,
            'estado' : 'ANULADA',
            'fecha_hora': this.fecha_hora,
            'error_sri': 0
          };
          this.datosenvioestado.emit(parametrosenviar);
        }
        else
        {
         this.toastr.error("No se pudo anular Factura de Venta, vuelva a intentar por favor", "INFORMACIÓN DEL SISTEMA");
        }
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loadingmodal = false;
    });
  }

  guardarAnulacionFacturaGym = () =>{

    this.loadingmodal = true;

    const parametros = {
      'cod_factura_venta' : this.cod_factura_venta,
      'monitor_actividades': this.monitor_actividades,
      'id_membresia': this.id_membresia
    };

    this.membresiaservice.anularFacturaVentaMembresia(parametros).subscribe( (data : any) =>
    {
        this.loadingmodal = false;

        if (data.estado == true)
        {
          this.toastr.success("Factura y Membresía Anulada Correctamente", "INFORMACIÓN DEL SISTEMA");
          const parametrosenviar = {
            'cod_factura_venta' : this.cod_factura_venta,
            'estado' : 'ANULADA',
            'fecha_hora': this.fecha_hora,
            'error_sri': 0
          };
          this.datosenvioestado.emit(parametrosenviar);
        }
        else
        {
         this.toastr.error("No se pudo anular Factura de Venta, vuelva a intentar por favor", "INFORMACIÓN DEL SISTEMA");
        }
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loadingmodal = false;
    });
  }

  revisarDocumentoError()
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/facturas/4_rechazados/" + this.cod_factura_venta + ".xml", "Documento", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }

  revisarDocumentoXml()
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/facturas/1_creados/" + this.cod_factura_venta + ".xml", "Documento", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }

  verificarNotaCredito()
  {
    this.loadingmodal = true;
    this.notacreditoservice.verificarNotaCredito(this.cod_factura_venta).subscribe( (data : any) =>
    {
      this.loadingmodal = false;
        if(data.cod_nota_credito == false) {
          this.mantenerEstados();
          this.router.navigate(["/menuventa/venta", "actualizarregistro", this.cod_factura_venta]);
        } else {
          this.toastr.warning("La venta no se puede editar porque se a originado una nota de crédito de venta, debe hacer la modificación o devolución en la nota de crédito", "INFORMACIÓN DEL SISTEMA");
        }
    }, err => {
      this.loadingmodal = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  async verificarNotaCreditoAnular()
  {
    try
    {

      this.loadingmodal = true;
      const data: any = await lastValueFrom(this.notacreditoservice.verificarNotaCredito(this.cod_factura_venta));

        this.loadingmodal = false;
          if(data.cod_nota_credito == false) {

            const ok = await this.swalservice.alertConfirmNoRequerido({
              title: "ANULAR FACTURA Nº "  + this.numero_factura + " - " + this.cliente,
              text: "Confirmar para anular el registro seleccionado",
              icon: "info",
              confirmText: "Si, Anular",
              cancelText: "No, Cerrar"
            });

            if (ok)
            {
              this.anularFacturaVenta();
            }
          } else {
            this.toastr.warning("La venta no se puede anular porque se a originado una nota de crédito de venta, debe hacer la devolución total en la nota de crédito", "INFORMACIÓN DEL SISTEMA");
          }
    
    } catch (err: any) {
      this.loadingmodal = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    }
  }

  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }


  async verificarRecaudacion()
  {
    if(this.estado_recaudado==1)
    {
      await this.iniciarProcesoFacturacion();
    }
    else
    {
        const ok = await this.swalservice.alertConfirmNoRequerido({
          title: "COMPROBANTE "  + this.numero_factura + " - " + this.cliente,
          text: "Este comprobante no está recaudado, si envía este comprobante no saldrá en los cierres de caja del cajero, ¿Está seguro de enviar el comprobante sin importar que no esté recaudado?",
          icon: "warning",
          confirmText: "Si, Enviar",
          cancelText: "No, Cerrar"
        });

        if (ok)
        {
          await this.iniciarProcesoFacturacion();
        }
    }
  }

  async iniciarProcesoFacturacion()
  {
    this.swalservice.iniciarLoading("Procesando con el SRI...");
    try
    {
      let facturaventa1: FacturaVentaDTO = new FacturaVentaDTO;
      facturaventa1.cod_factura_venta = this.cod_factura_venta;
      facturaventa1.claveacceso = this.claveacceso;
      facturaventa1.fecha_registro_hora = this.fecha_hora;
      facturaventa1.estado = this.estado_comprobante;
      facturaventa1.numero_factura = this.numero_factura;

      const cod_proyecto = this.cod_proyecto;
      const codigo_iva = this.codigo_iva;
      const error_sri = this.error_sri;

      const resultado = await this.sriventa.iniciarProcesoFacturacionComprobar(cod_proyecto, facturaventa1, codigo_iva, error_sri);

      if(resultado.estado_sri)//AUTORIZADOS, EN PROCESOS, DEVUELTA, NO AUTORIZADOS
      {
        await this.informacionActualizarEstado(true, resultado.estado, resultado.fecha_hora, resultado.mensaje, resultado.informacionadicional);
        
        if(resultado.envio== "SI")
        {
          this.toastr.success("Correo enviado satisfactoriamente al cliente", "INFORMACIÓN DEL SISTEMA");
          await this.informacionActualizarEstadoCorreo(this.cod_factura_venta);
        }

        if(resultado.confirmar_envio == "SI")
        {
          await this.confirmarEnvioComprobante();
        }
      }
      else
      {
        if(resultado.confirmar_envio == "SI")
        {
          await this.confirmarEnvioComprobante();
        }
        else
        {
          if(resultado.tiempo_espera_envio == "SI")
          {
              await this.swalservice.alertOkRequerido({
                title: "Control del Sistema",
                text: "El comprobante Nº " + this.numero_factura + " con fecha " + this.fecha_hora + " esta en estado EN PROCESO, no se puede obtener un resultado de autorización en estos momentos, intente más tarde. Debe esperar máximo 24 Horas a partir de la fecha y hora del comprobante para poder comprobar su autorización",
                icon: "info"
              });
          }
          else//Reenvio
          {
            if(resultado.confirmar_reenvio == "SI")
            {
              await this.confirmarReenvioComprobante();
            }
          }
        }
      }

    } catch (err) {
      this.toastr.error(err.message || err, "INFORMACIÓN DEL SISTEMA");
    } finally {
      this.swalservice.close();
    }
    
  }

  async confirmarEnvioComprobante()
  {
    const ok = await this.swalservice.alertConfirmNoRequerido({
      title: "Procesar comprobante",
      text: "¿Desea crear el comprobante nuevamente y enviarlo al SRI? El comprobante no fue enviado oportunamente",
      icon: "info",
      confirmText: "Sí, Crear y Enviar",
      cancelText: "Cancelar"
    });

    if (ok)
    {
      this.swalservice.iniciarLoading("Procesando con el SRI...");
      try
      {
          const cod_proyecto = this.cod_proyecto;
          await this.sriventa.actualizarFechaClaveAccesoActual(this.cod_factura_venta, this.numero_factura, this.ruc, this.tipoambiente, this.serieestab, this.ptoemi);

          const { cliente, rucempresa, facturaventa, formapago, datosdetalles } = await this.sriventa.buscarFactura(this.cod_factura_venta, this.codigo_iva);

          const resultado = await this.sriventa.iniciarProcesoFacturacion(cod_proyecto, cliente, rucempresa, facturaventa, formapago, datosdetalles, "envio");

          await this.informacionActualizarEstado(true, resultado.estado, resultado.fecha_hora, resultado.mensaje, resultado.informacionadicional);

          if(resultado.envio== "SI")
          {
            this.toastr.success("Correo enviado satisfactoriamente al cliente", "INFORMACIÓN DEL SISTEMA");
            await this.informacionActualizarEstadoCorreo(this.cod_factura_venta);
          }

      } catch (err) {
        this.toastr.error(err.message || err, "INFORMACIÓN DEL SISTEMA");
      } finally {
        this.swalservice.close();
      }
    }
  }



  async crearFirmaXml()
  {
    const cod_proyecto = this.cod_proyecto;
    const { cliente, rucempresa, facturaventa, formapago, datosdetalles } = await this.sriventa.buscarFactura(this.cod_factura_venta, this.codigo_iva);

    const resultado = await this.sriventa.crearFirmaXml(cod_proyecto, cliente, rucempresa, facturaventa, formapago, datosdetalles, "reenvio");
  }

  











  async confirmarReenvioComprobante()
  {
    const ok = await this.swalservice.alertConfirmNoRequerido({
      title: "Procesar comprobante",
      text: "¿Desea reenviar el comprobante al SRI? El comprobante no fue enviado oportunamente a recepción del SRI por fallos en sus servidores",
      icon: "info",
      confirmText: "Sí, Reenviar",
      cancelText: "Cancelar"
    });

    if (ok)
    {
      this.swalservice.iniciarLoading("Procesando con el SRI...");
      try
      {
          const cod_proyecto = this.cod_proyecto;
          const { cliente, rucempresa, facturaventa, formapago, datosdetalles } = await this.sriventa.buscarFactura(this.cod_factura_venta, this.codigo_iva);

          const resultado = await this.sriventa.iniciarProcesoFacturacion(cod_proyecto, cliente, rucempresa, facturaventa, formapago, datosdetalles, "reenvio");

          await this.informacionActualizarEstado(true, resultado.estado, resultado.fecha_hora, resultado.mensaje, resultado.informacionadicional);

          if(resultado.envio== "SI")
          {
            this.toastr.success("Correo enviado satisfactoriamente al cliente", "INFORMACIÓN DEL SISTEMA");
            await this.informacionActualizarEstadoCorreo(this.cod_factura_venta);
          }

      } catch (err) {
        this.toastr.error(err.message || err, "INFORMACIÓN DEL SISTEMA");
      } finally {
        this.swalservice.close();
      }
    }
  }

  async informacionActualizarEstado(estado: boolean, estadocomprobante: string, fecha_hora: string, mensaje: string, informacionadicional: string)
  {
    if (estado == true)
    {
      if(estadocomprobante=="CREADA")
      {
        this.disabledbtnenviarcorreo = false;
        const parametrosenviar = {
          'cod_factura_venta' : this.cod_factura_venta,
          'estado' : 'CREADA',
          'fecha_hora': fecha_hora,
          'error_sri': 1
        };
        this.datosenvioestado.emit(parametrosenviar);
      }

      if(estadocomprobante=="AUTORIZADO")
      {
        //this.toastr.success("Comprobante ya está Autorizado", "INFORMACIÓN DEL SISTEMA");
        this.disabledbtnenviarcorreo = false;
        const parametrosenviar = {
          'cod_factura_venta' : this.cod_factura_venta,
          'estado' : 'AUTORIZADO',
          'fecha_hora': fecha_hora,
          'error_sri': 0
        };
        this.datosenvioestado.emit(parametrosenviar);
      }

      if(estadocomprobante=="EN PROCESO")
      {
        //this.toastr.success("Comprobante ya está en Proceso de Comprobación " + mensaje, "INFORMACIÓN DEL SISTEMA");
        const parametrosenviar = {
          'cod_factura_venta' : this.cod_factura_venta,
          'estado' : 'EN PROCESO',
          'fecha_hora': fecha_hora,
          'error_sri': 0
        };
        this.datosenvioestado.emit(parametrosenviar);
      }

      if(estadocomprobante=="DEVUELTA")
      {
        //this.toastr.error("Comprobante Devuelta: " + mensaje + " " + informacionadicional, "INFORMACIÓN DEL SISTEMA");
        const parametrosenviar = {
          'cod_factura_venta' : this.cod_factura_venta,
          'estado' : 'DEVUELTA',
          'fecha_hora': fecha_hora,
          'error_sri': 0
        };
        this.datosenvioestado.emit(parametrosenviar);
      }

      if(estadocomprobante=="NO AUTORIZADO")
      {
        //this.toastr.error("Comprobante No Autorizado: " + mensaje + " " + informacionadicional, "INFORMACIÓN DEL SISTEMA");
        const parametrosenviar = {
          'cod_factura_venta' : this.cod_factura_venta,
          'estado' : 'NO AUTORIZADO',
          'fecha_hora': fecha_hora,
          'error_sri': 0
        };
        this.datosenvioestado.emit(parametrosenviar);
      }
    }
    else
    {
      this.toastr.error("El comprobante no se a enviado al SRI", "INFORMACIÓN DEL SISTEMA");
    }
  }

  async informacionActualizarEstadoCorreo(cod_factura_venta: string)
  {
    const parametrosenviar = {
      'cod_factura_venta' : cod_factura_venta,
      'envio' : 'ENVIADO'
    };
    this.datosenviocorreo.emit(parametrosenviar);
  }

  async comprobarSri()
  {
    try
    {
      this.swalservice.iniciarLoading("Procesando con el SRI...");
      let facturaventa1: FacturaVentaDTO = new FacturaVentaDTO;
      facturaventa1.claveacceso = this.claveacceso;

      const resultadocomprobacionsri = await this.sriventa.verificarComprobanteSri(facturaventa1);
      const data = resultadocomprobacionsri.data;
      if(resultadocomprobacionsri.estado)
      {
        if(data.estadomensaje=="AUTORIZADO")
          {
            this.toastr.success("Este comprobante esta autorizado", "INFORMACIÓN DEL SISTEMA");
          }

          if(data.estadomensaje=="EN PROCESO")
          {
            this.toastr.warning("Este comprobante esta en proceso " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
          }

          if(data.estadomensaje=="NO AUTORIZADO")
          {
            this.toastr.error("Este comprobante no está Autorizado: " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
          }

          if(data.estadomensaje=="DEVUELTA")
          {
            this.toastr.error("Este comprobante Devuelta: " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
          }
      }
      else
      {
        this.toastr.error(data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
      }
    } catch (err) {
      this.toastr.error(err.message || err, "INFORMACIÓN DEL SISTEMA");
    } finally {
      this.swalservice.close();
    }
  }

  async enviarCorreo()
  {
    try
    {
      this.swalservice.iniciarLoading("Procesando con el SRI...");
      let facturaventa: FacturaVentaDTO = new FacturaVentaDTO;
      let cliente: ClienteDTO = new ClienteDTO;
      let rucempresa: RucEmpresaDTO = new RucEmpresaDTO;

      facturaventa.cod_factura_venta = this.cod_factura_venta;
      rucempresa.nombre_comercial = this.nombre_comercial;
      facturaventa.numero_factura = this.padLeft(this.numero_factura, 9);
      cliente.correo = this.correo;
      cliente.cliente = this.cliente;
      rucempresa.serieestab = this.padLeft(this.serieestab, 3);
      rucempresa.ptoemi = this.padLeft(this.ptoemi, 3);

      const resultadoenviocorreo = await this.sriventa.enviarCorreo(this.cod_proyecto, facturaventa, cliente, rucempresa);
      if(resultadoenviocorreo)
      {
        this.toastr.success("Correo enviado satisfactoriamente al cliente", "INFORMACIÓN DEL SISTEMA");
        await this.sriventa.actualizarEstadoCorreo(facturaventa.cod_factura_venta);
        await this.informacionActualizarEstadoCorreo(facturaventa.cod_factura_venta);
      }
    } catch (err) {
      this.toastr.error(err.message || err, "INFORMACIÓN DEL SISTEMA");
    } finally {
      this.swalservice.close();
    }
  }

  async clickCrearRide()
  {
    try
    {
      this.swalservice.iniciarLoading("Procesando con el SRI...");
      const { cliente, rucempresa, facturaventa, formapago, datosdetalles } = await this.sriventa.buscarFactura(this.cod_factura_venta, this.codigo_iva);
      let arrfacturaventa = await this.sriventa.crearArregloFacturaVenta(this.cod_proyecto, cliente, rucempresa, facturaventa, formapago, datosdetalles);
      const resultadoride = await this.sriventa.crearRide(arrfacturaventa, cliente);
    } catch (err) {
      this.toastr.error(err.message || err, "INFORMACIÓN DEL SISTEMA");
    } finally {
      this.swalservice.close();
    }
  }
}