import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NotaCreditoService } from 'src/app/venta/services/nota-credito.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { ConfigService } from 'src/app/shared/services/config.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { SriNotaCreditoService } from 'src/app/shared/services/sri-nota-credito.service';
import { NotaCreditoDTO } from 'src/app/venta/models/nota-credito.dto';
import { ClienteDTO } from 'src/app/venta/models/cliente.dto';
import { RucEmpresaDTO } from 'src/app/usuario/models/rucempresa.dto';

@Component({
  selector: 'app-opciones-explorador-nota-credito',
  templateUrl: './opciones-explorador-nota-credito.component.html',
  styleUrls: ['./opciones-explorador-nota-credito.component.css']
})
export class OpcionesExploradorNotaCreditoComponent implements OnInit {
  @Input() tipoformulario: string = "";
  @Output() datosenvioestado: EventEmitter<any> = new EventEmitter<any>();
  @Output() datosenviocorreo: EventEmitter<any> = new EventEmitter<any>();
  @Output() datosenviomantenerestados: EventEmitter<any> = new EventEmitter<any>();

  opcionesprivilegios : any;

  electronico : string = "0";
  kardex : string = "";

  estado_comprobante : string = "";
 
  cod_proyecto : string = "";
  claveacceso : string = "";

  numero_nota_credito : string = "";
  cliente : string = "";
  cod_nota_credito : string = "";
  tipo_venta : string = "";
  ptoemi : string = "";
  correo : string = "";
  cod_factura_venta = "";
  fecha_hora: string = "";

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

  error_sri: number = 0;

  loading : boolean = false;
  loadinglistado : boolean = false;
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

  cod_sucursal : string = "";
  cod_ruc: string = "";
  cod_tipo_documento : string = "";
  fechadesde : string = "";
  fechahasta : string = "";
  estado : string = "";
  page : string = "";

  arr_nota_credito : any;

  codigo_iva: string;

  constructor(private router : Router, private notacreditoservice:NotaCreditoService, private toastr: ToastrService, private error:ErrorService, private usersession: UserSessionService, private srinotacredito: SriNotaCreditoService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.electronico = this.usersession.getConfiguracion("electronico");
    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
    this.kardex = this.usersession.getConfiguracion("kardex");
    this.codigo_iva = this.usersession.getConfiguracion("codigo_iva");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  descargarRide()
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/notascredito/0_ride/" + this.cod_nota_credito + ".pdf", "Ride", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }

  descargarXml()
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/notascredito/3_autorizados/" + this.cod_nota_credito + ".xml", "Documento", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }

  descargarDocumentos()
  {
	  window.open(this.configService.settings.baseUrlSri + "/api/notacredito/descargararchivonotacredito.php?cod_proyecto=" + this.cod_proyecto + "&cod_nota_credito=" + this.cod_nota_credito + "&numero_nota_credito=" + this.padLeft(this.numero_nota_credito, 9) + "&serieestab=" + this.serieestab + "&ptoemi=" + this.ptoemi + "&op=2");
  }

  descargarXmlAutorizado()
  {
	  window.open(this.configService.settings.baseUrlSri + "/api/notacredito/descargararchivonotacredito.php?cod_proyecto=" + this.cod_proyecto + "&cod_nota_credito=" + this.cod_nota_credito + "&numero_nota_credito=" + this.padLeft(this.numero_nota_credito, 9) + "&serieestab=" + this.serieestab + "&ptoemi=" + this.ptoemi + "&op=1");
  }

  async clickCrearRide()
  {
    try
    {
      this.iniciarLoading();
      const { cliente, rucempresa, notacredito, datosdetalles } = await this.srinotacredito.buscarNotaCredito(this.cod_nota_credito, this.codigo_iva);
      let arrnotacredito = await this.srinotacredito.crearArregloNotaCredito(this.cod_proyecto, cliente, rucempresa, notacredito, datosdetalles);
      const resultadoride = await this.srinotacredito.crearRide(arrnotacredito, cliente);
    } catch (err) {
      this.toastr.error(err.message || err, "INFORMACIÓN DEL SISTEMA");
    } finally {
      Swal.close();
    }
  }

  imprimir()
  {
     if(this.tipo_venta=="FACTURA" || this.tipo_venta=="ELECTRONICA")
      {
        let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/notacredito?codnotacredito=" + this.cod_nota_credito, "Nota de Credito", 'width=600,height=400,left=300,top=100');
        miVentana.focus();
      }
      
     if(this.tipo_venta=="RECIBO")
     {
       let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/devolucionrecibo?codnotacredito=" + this.cod_nota_credito, "Devolución Nota de Venta", 'width=600,height=400,left=300,top=100');
       miVentana.focus();
     }
  }

  async editar()
  {
    if(this.tipo_venta=="ELECTRONICA")
    {
      if(this.estado_comprobante != "AUTORIZADO")
      {
        try
        {
          this.iniciarLoading();
          let notacredito1: NotaCreditoDTO = new NotaCreditoDTO;
          notacredito1.claveacceso = this.claveacceso;

          const resultadocomprobacionsri = await this.srinotacredito.verificarComprobanteSri(notacredito1);
          const data = resultadocomprobacionsri.data;
          if(resultadocomprobacionsri.estado)
          {
              if(data.estadomensaje=="AUTORIZADO")
              {
                await Swal.fire({
                  title: "Control del Sistema",
                  text: "El comprobante Nº " + this.numero_nota_credito + " no se puede editar porque está en estado AUTORIZADA, precione el boton Enviar SRI para actualizar el estado",
                  icon: "info",
                  confirmButtonText: 'OK',
                  allowEscapeKey: false,
                  allowOutsideClick: false
                });
              }
              else
              {
                if(data.estadomensaje=="EN PROCESO")
                {
                  await Swal.fire({
                    title: "Control del Sistema",
                    text: "El comprobante Nº " + this.numero_nota_credito + " no se puede editar porque está en estado EN PROCESO, precione el boton Enviar SRI para actualizar el estado",
                    icon: "info",
                    confirmButtonText: 'OK',
                    allowEscapeKey: false,
                    allowOutsideClick: false
                  });
                }
                else
                {
                  this.mantenerEstados();
                  this.datosenviomantenerestados.emit();
                  this.router.navigate(["/menuventa/notacredito", "actualizarregistro", this.cod_nota_credito, this.cod_factura_venta]);
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
                    await Swal.fire({
                      title: "Control del Sistema",
                      text: "El comprobante Nº " + this.numero_nota_credito + " con fecha " + fecha_hora + " esta en estado EN PROCESO, no se puede editar hasta obtener un resultado de autorización. Debe esperar máximo 24 Horas a partir de la fecha y hora del comprobante para poder comprobar su autorización",
                      icon: "info",
                      confirmButtonText: 'OK',
                      allowEscapeKey: false,
                      allowOutsideClick: false
                    });
                }
                else
                {
                    this.mantenerEstados();
                    this.datosenviomantenerestados.emit();
                    this.router.navigate(["/menuventa/notacredito", "actualizarregistro", this.cod_nota_credito, this.cod_factura_venta]);
                }
            }
            else
            {
                this.mantenerEstados();
                this.datosenviomantenerestados.emit();
                this.router.navigate(["/menuventa/notacredito", "actualizarregistro", this.cod_nota_credito, this.cod_factura_venta]);
            }
            /**/
          }
        } catch (err) {
          this.toastr.error(err.message || err, "INFORMACIÓN DEL SISTEMA");
        } finally {
          Swal.close();
        }
      }
    }
    else
    {
      this.mantenerEstados();
      this.datosenviomantenerestados.emit();
	    this.router.navigate(["/menuventa/notacredito", "actualizarregistro", this.cod_nota_credito, this.cod_factura_venta]);
    }
  }

  opciones(item: any)
  {
    this.ruc = item.ruc_sucursal
    this.tipoambiente = item.tipo_ambiente;
    this.cod_nota_credito = item.cod_nota_credito;
    this.numero_nota_credito = item.numero_nota_credito;
    this.tipo_venta = item.tipo_venta;
    this.cliente = item.cliente;
    this.claveacceso = item.claveacceso;
    this.serieestab = item.serieestab;
    this.ptoemi = item.ptoemi;
    this.correo = item.correo;
    this.cod_factura_venta = item.cod_factura_venta;
    this.arr_nota_credito = {};
    this.estado_comprobante = item.estado;
    this.fecha_hora = item.fecha_hora;
    this.error_sri = item.error_sri;

    if(this.tipo_venta=="ELECTRONICA")
    {
      if(item.estado=="AUTORIZADO")
      {
        this.configurarBotones(true, false, true, false, false, false, false, false, false);
      }
      else
      {
        if(item.estado=="ANULADA")
        {
          this.configurarBotones(true, true, true, true, false, false, false, false, false);
        }
        else
        {
          this.configurarBotones(false, true, false, true, true, true, true, false, true);
        }
      }
    }
    else
    {
      if(item.estado=="CREADA")
      {
        this.configurarBotones(false, true, true, false, true, true, true, true, true);
      }
  
      if(item.estado=="ANULADA")
      {
        this.configurarBotones(true, true, true, true, true, true, true, true, true);
      }
    }
   
    $("#mymodalopcionesnotacredito").modal("show");
  }

  configurarBotones(disabledbtneditar: boolean, disabledbtnenviarcorreo: boolean, disabledbtnenviarsri: boolean, disabledbtnanular: boolean, disabledbtndescargarride: boolean, disabledbtndescargarxml: boolean, disabledbtndescargardocumentos: boolean, disabledbtncomprobarsri: boolean, disabledbtncrearride: boolean) {
    this.disabledbtneditar = disabledbtneditar;
    this.disabledbtnenviarcorreo = disabledbtnenviarcorreo;
    this.disabledbtnenviarsri = disabledbtnenviarsri;
    this.disabledbtnanular = disabledbtnanular
    this.disabledbtndescargarride = disabledbtndescargarride;
    this.disabledbtndescargarxml = disabledbtndescargarxml;
    this.disabledbtndescargardocumentos = disabledbtndescargardocumentos;
    this.disabledbtncomprobarsri = disabledbtncomprobarsri;
    this.disabledbtncrearride = disabledbtncrearride;
  }


  formularioNormal()
  {
    this.tipo_venta = "";
    this.claveacceso = "";

    this.estado_comprobante = "";
   
    this.numero_nota_credito = "";
    this.cod_nota_credito = "";
  }

  clickAnular()
  {
    Swal.fire({
      title: 'ANULAR NOTA CRÉDITO Nº '  + this.numero_nota_credito + ' - ' + this.cliente,
      text: 'Confirmar para anular el registro seleccionado',
      icon: 'info',//'warning'
      showCancelButton: true,
      confirmButtonText: 'Si, Anular',
      cancelButtonText: 'No, Anular'
    }).then((result) => {
      if (result.value) {
        this.anularNotaCredito();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }
  
  //La anulación de nota de crédito se hace por via sri
  anularNotaCredito = () =>{
    if(this.tipo_venta=="ELECTRONICA")
    {
      this.comprobarSriAnular();
    }
    else
    {
      this.guardarAnulacionNotaCredito();
    }
  }

  comprobarSriAnular(){
    let parametros = {
      'claveacceso' : this.claveacceso
    };
  
    this.loadingmodal = true;

    this.notacreditoservice.verificarComprobanteSri(parametros).subscribe( (data : any) =>
    {
        this.loadingmodal = false;
        if(data.estadomensaje=="0")
        {
            this.guardarAnulacionNotaCredito();
        }
        else
        {
          this.toastr.error("Se Origino un error " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
        }
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loadingmodal = false;
    });
  }

  guardarAnulacionNotaCredito = () =>{

    this.loadingmodal = true;

    const parametros = {
      'cod_nota_credito' : this.cod_nota_credito,
      'cod_factura_venta' : this.cod_factura_venta,
      'claveacceso' : this.claveacceso,
      'kardex' : this.kardex,
    };

    this.notacreditoservice.anularNotaCredito(parametros).subscribe( (data : any) =>
    {
        this.loadingmodal = false;

        if (data.estado == true)
        {
          //this.datos.find((x:any) => x.cod_nota_credito === this.cod_nota_credito).estado = 'ANULADA';
          const parametrosenviar = {
            'cod_nota_credito' : this.cod_nota_credito,
            'estado' : 'ANULADA',
            'fecha_hora': this.fecha_hora,
              'error_sri': 0
          };
          this.datosenvioestado.emit(parametrosenviar);
          this.toastr.success("Nota de Crédito Anulada Correctamente, se restablecieron valores del inventario", "INFORMACIÓN DEL SISTEMA");
        }
        else
        {
         this.toastr.error("No se pudo anular Nota de Crédito, vuelva a intentar por favor", "INFORMACIÓN DEL SISTEMA");
        }
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loadingmodal = false;
    });
  }

  revisarDocumentoError()
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/notascredito/4_rechazados/" + this.cod_nota_credito + ".xml", "Documento", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }

  revisarDocumentoXml()
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/notascredito/1_creados/" + this.cod_nota_credito + ".xml", "Documento", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }

  async comprobarSri()
  {
    try
    {
      this.iniciarLoading();
      let notacredito1: NotaCreditoDTO = new NotaCreditoDTO;
      notacredito1.claveacceso = this.claveacceso;

      const resultadocomprobacionsri = await this.srinotacredito.verificarComprobanteSri(notacredito1);
      const data = resultadocomprobacionsri.data;
      if(resultadocomprobacionsri.estado)
      {
        if(data.estadomensaje=="AUTORIZADO")
          {
            this.toastr.success("Este comprobante esta autorizado", "INFORMACIÓN DEL SISTEMA");
          }

          if(data.estadomensaje=="EN PROCESO")
          {
            this.toastr.success("Este comprobante esta en proceso " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
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
      Swal.close();
    }
  }

  async enviarCorreo()
  {
    try
    {
      this.iniciarLoading();
      let notacredito: NotaCreditoDTO = new NotaCreditoDTO;
      let cliente: ClienteDTO = new ClienteDTO;
      let rucempresa: RucEmpresaDTO = new RucEmpresaDTO;

      notacredito.cod_nota_credito = this.cod_nota_credito;
      rucempresa.nombre_comercial = this.nombre_comercial;
      notacredito.numero_factura = this.padLeft(this.numero_nota_credito, 9);
      cliente.correo = this.correo;
      cliente.cliente = this.cliente;
      rucempresa.serieestab = this.padLeft(this.serieestab, 3);
      rucempresa.ptoemi = this.padLeft(this.ptoemi, 3);

      const resultadoenviocorreo = await this.srinotacredito.enviarCorreo(this.cod_proyecto, notacredito, cliente, rucempresa);
      if(resultadoenviocorreo)
      {
        this.toastr.success("Correo enviado satisfactoriamente al cliente", "INFORMACIÓN DEL SISTEMA");
        await this.notacreditoservice.actualizarEstadoCorreo(notacredito.cod_nota_credito);
        await this.informacionActualizarEstadoCorreo(notacredito.cod_nota_credito);
      }
    } catch (err) {
      this.toastr.error(err.message || err, "INFORMACIÓN DEL SISTEMA");
    } finally {
      Swal.close();
    }
  }

 
  

  mantenerEstados()
  {
    sessionStorage.setItem("tipo_formulario", "explorador_nota_credito");//Restaurar datos
    sessionStorage.setItem("cod_sucursal", this.cod_sucursal);
    sessionStorage.setItem("cod_ruc", this.cod_ruc);
    sessionStorage.setItem("estado", this.estado);
    sessionStorage.setItem("cod_tipo_documento", this.cod_tipo_documento);
    sessionStorage.setItem("page", this.page);
    sessionStorage.setItem("fechadesde", this.fechadesde);
    sessionStorage.setItem("fechahasta", this.fechahasta);
  }

  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }

  async iniciarProcesoFacturacion()
  {
    this.iniciarLoading();
    try
    {
      let notacredito1: NotaCreditoDTO = new NotaCreditoDTO;
      notacredito1.cod_nota_credito = this.cod_nota_credito;
      notacredito1.claveacceso = this.claveacceso;

      const resultadocomprobacionsri = await this.srinotacredito.comprobarSriRapido(this.cod_proyecto, notacredito1);
      if(resultadocomprobacionsri.estado)
      {
        const data = resultadocomprobacionsri.data;
        if(data.estadomensaje=="AUTORIZADO")
        {
          this.toastr.success("Comprobante ya está Autorizado", "INFORMACIÓN DEL SISTEMA");
          const resultadoestado = await this.srinotacredito.actualizarEstado(notacredito1.cod_nota_credito, notacredito1.claveacceso, "", "", "AUTORIZADO", data.fechaautorizacion);
          await this.informacionActualizarEstado(resultadoestado, "AUTORIZADO", data.fechaautorizacion);

          const { cliente, rucempresa, notacredito, datosdetalles } = await this.srinotacredito.buscarNotaCredito(this.cod_nota_credito, this.codigo_iva);
          let arrnotacredito = await this.srinotacredito.crearArregloNotaCredito(this.cod_proyecto, cliente, rucempresa, notacredito, datosdetalles);
          const resultadoride = await this.srinotacredito.crearRide(arrnotacredito, cliente);
          if(resultadoride)
          {
            const resultadoenviocorreo = await this.srinotacredito.enviarCorreo(this.cod_proyecto, notacredito, cliente, rucempresa);
            if(resultadoenviocorreo)
            {
              this.toastr.success("Correo enviado satisfactoriamente al cliente", "INFORMACIÓN DEL SISTEMA");
              await this.srinotacredito.actualizarEstadoCorreo(notacredito.cod_nota_credito);
              await this.informacionActualizarEstadoCorreo(notacredito.cod_nota_credito);
            }
          }
        }

        if(data.estadomensaje=="EN PROCESO")
        {
          this.toastr.success("Comprobante ya está en Proceso de Comprobación " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
          const resultadoestado = await this.srinotacredito.actualizarEstado(notacredito1.cod_nota_credito, "0", data.mensaje, data.informacionadicional, "EN PROCESO", data.fechaautorizacion);
          await this.informacionActualizarEstado(resultadoestado, "EN PROCESO", data.fechaautorizacion);
        }

        if(data.estadomensaje=="DEVUELTA")
        {
          this.toastr.error("Comprobante Devuelta: " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
          const resultadoestado = await this.srinotacredito.actualizarEstado(notacredito1.cod_nota_credito, "0", data.mensaje, data.informacionadicional, "DEVUELTA", data.fechaautorizacion);
          await this.informacionActualizarEstado(resultadoestado, "EN PROCESO", data.fechaautorizacion);
          await this.confirmarEnvioComprobante();
        }

        if(data.estadomensaje=="NO AUTORIZADO")
        {
          this.toastr.error("Comprobante No Autorizado: " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
          const resultadoestado = await this.srinotacredito.actualizarEstado(notacredito1.cod_nota_credito, "0", data.mensaje, data.informacionadicional, "NO AUTORIZADO", data.fechaautorizacion);
          await this.informacionActualizarEstado(resultadoestado, "NO AUTORIZADO", data.fechaautorizacion);
          await this.confirmarEnvioComprobante();
        }
      }
      else
      {
          if(this.estado_comprobante=="EN PROCESO")
          {
            const fecha_hora_servidor =  resultadocomprobacionsri.data.fechahora;
            const fecha_hora = this.fecha_hora;
            const momentservidor = moment(fecha_hora_servidor);
            const momentfactura = moment(fecha_hora).add(1, 'days'); // Sumamos 24 horas
            
            if (momentfactura.isAfter(momentservidor))
            {
                await Swal.fire({
                  title: "Control del Sistema",
                  text: "El comprobante Nº " + this.numero_nota_credito + " con fecha " + fecha_hora + " esta en estado EN PROCESO, no se puede obtener un resultado de autorización en estos momentos, intente más tarde. Debe esperar máximo 24 Horas a partir de la fecha y hora del comprobante para poder comprobar su autorización",
                  icon: "info",
                  confirmButtonText: 'OK',
                  allowEscapeKey: false,
                  allowOutsideClick: false
                });
            }
            else
            {
                await this.confirmarEnvioComprobante();
            }
          }
          else
          {
            if(this.error_sri==1)//Hubo error en el SRI en recepción
            {
              const fecha_hora_servidor =  resultadocomprobacionsri.data.fechahora;
              const fecha_hora = this.fecha_hora;
              const momentservidor = moment(fecha_hora_servidor);
              const momentfactura = moment(fecha_hora).add(1, 'days'); // Sumamos 24 horas
              if (momentfactura.isAfter(momentservidor))//Si es mayor envia sin atualizar comprobante
              {
                await this.confirmarReenvioComprobante();
              }
              else
              {
                await this.confirmarEnvioComprobante();
              }
            }
            else
            {
              await this.confirmarEnvioComprobante();
            }
          }
      }

    } catch (err) {
      this.toastr.error(err.message || err, "INFORMACIÓN DEL SISTEMA");
    } finally {
      Swal.close();
    }
    
  }

  async confirmarEnvioComprobante()
  {
    await Swal.fire({
      title: "Procesar comprobante",
      text: "¿Desea crear el comprobante nuevamente y enviarlo al SRI? El comprobante no fue enviado oportunamente.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Sí, Crear y Enviar",
      cancelButtonText: "Cancelar",
      allowEscapeKey: false,
      allowOutsideClick: false
    }).then( async (result) => {
      if (result.isConfirmed) {
        this.iniciarLoading();
        try
        {
            await this.srinotacredito.actualizarFechaClaveAccesoActual(this.cod_nota_credito, this.numero_nota_credito, this.ruc, this.tipoambiente, this.serieestab, this.ptoemi);

            const { cliente, rucempresa, notacredito, datosdetalles } = await this.srinotacredito.buscarNotaCredito(this.cod_nota_credito, this.codigo_iva);

            let arrnotacredito = await this.srinotacredito.crearFirmarXml2(this.cod_proyecto, cliente, rucempresa, notacredito, datosdetalles);
            
            const resultado = await this.srinotacredito.enviarSri(this.cod_proyecto, notacredito);
            if (resultado.estado == "RECIBIDA")
            {
              const resultadocomprobacionsri = await this.srinotacredito.comprobarSri(this.cod_proyecto, notacredito);
              const data = resultadocomprobacionsri.data;
              
              if(resultadocomprobacionsri.estado)
              {
                if(data.estadomensaje=="AUTORIZADO")
                {
                  this.toastr.success("Comprobante Autorizado", "INFORMACIÓN DEL SISTEMA");
                  const resultadoestado = await this.srinotacredito.actualizarEstado(notacredito.cod_nota_credito, notacredito.claveacceso, "", "", "AUTORIZADO", data.fechaautorizacion);
                  
                  await this.informacionActualizarEstado(resultadoestado, "AUTORIZADO", notacredito.fecha_registro_hora);
                  arrnotacredito.fechaautorizacion = data.fechaautorizacion;
                  const resultadoride = await this.srinotacredito.crearRide(arrnotacredito, cliente);
                  if(resultadoride)
                  {
                    const resultadoenviocorreo = await this.srinotacredito.enviarCorreo(this.cod_proyecto, notacredito, cliente, rucempresa);
                    if(resultadoenviocorreo)
                    {
                      this.toastr.success("Correo enviado satisfactoriamente al cliente", "INFORMACIÓN DEL SISTEMA");
                      await this.srinotacredito.actualizarEstadoCorreo(notacredito.cod_nota_credito);
                      await this.informacionActualizarEstadoCorreo(notacredito.cod_nota_credito);
                    }
                  }
                }

                if(data.estadomensaje=="EN PROCESO")
                {
                  this.toastr.success("Comprobante en Proceso " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
                  const resultadoestado = await this.srinotacredito.actualizarEstado(notacredito.cod_nota_credito, "0", data.mensaje, data.informacionadicional, "EN PROCESO", data.fechaautorizacion);
                  await this.informacionActualizarEstado(resultadoestado, "EN PROCESO", notacredito.fecha_registro_hora);
                }

                if(data.estadomensaje=="NO AUTORIZADO")
                {
                  this.toastr.error("Comprobante No Autorizado: " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
                  const resultadoestado = await this.srinotacredito.actualizarEstado(notacredito.cod_nota_credito, "0", data.mensaje, data.informacionadicional, "NO AUTORIZADO", data.fechaautorizacion);
                  await this.informacionActualizarEstado(resultadoestado, "NO AUTORIZADO", notacredito.fecha_registro_hora);
                }
              }
              else
              {
                if(data.identificador=="0")
                {
                  this.toastr.warning("Comprobante en Proceso", "INFORMACIÓN DEL SISTEMA");
                  const resultadoestado = await this.srinotacredito.actualizarEstado(notacredito.cod_nota_credito, "0", resultado.data.mensaje, resultado.data.informacionadicional, "EN PROCESO", resultado.data.fechaautorizacion);
                await this.informacionActualizarEstado(resultadoestado, "EN PROCESO", notacredito.fecha_registro_hora);
                }
              }
            }
            else
            {
              if(resultado.estado=="EN PROCESO")//En procesamiento debe esperar 24 Horas
              {
                this.toastr.warning("Comprobante en Proceso " + resultado.data.mensaje, "INFORMACIÓN DEL SISTEMA");
                const resultadoestado = await this.srinotacredito.actualizarEstado(notacredito.cod_nota_credito, "0", resultado.data.mensaje, resultado.data.informacionadicional, "EN PROCESO", resultado.data.fechaautorizacion);
                await this.informacionActualizarEstado(resultadoestado, "EN PROCESO", notacredito.fecha_registro_hora);
              }
              else
              {
                if(resultado.estado=="DEVUELTA")
                {
                  this.toastr.error("Comprobante devuelto: " + resultado.data.mensaje + " " + resultado.data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
                  const resultadoestado = await this.srinotacredito.actualizarEstado(notacredito.cod_nota_credito, "0", resultado.data.mensaje, resultado.data.informacionadicional, "DEVUELTA", resultado.data.fechaautorizacion);
                  await this.informacionActualizarEstado(resultadoestado, "DEVUELTA", notacredito.fecha_registro_hora);
                }
                else//ERROR CONEXION
                {
                  this.toastr.error("Se Origino un error en el sistema de recepción de SRI: " + resultado.data.mensaje + " " + resultado.data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
                  const resultadoestado = await this.srinotacredito.actualizarEstadoError(notacredito.cod_nota_credito, resultado.data.identificador, resultado.data.mensaje, resultado.data.informacionadicional, "CREADA");
                  await this.informacionActualizarEstado(resultadoestado, "CREADA", notacredito.fecha_registro_hora);
                }
              }
            }

        } catch (err) {
          this.toastr.error(err.message || err, "INFORMACIÓN DEL SISTEMA");
        } finally {
          Swal.close();
        }


      } else if (result.isDismissed) {
        
      }

          

    });
  }

  async confirmarReenvioComprobante()
  {
    await Swal.fire({
          title: "Procesar comprobante",
          text: "¿Desea reenviar el comprobante al SRI? El comprobante no fue enviado oportunamente a recepción del SRI por fallos en sus servidores.",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Sí, Reenviar",
          cancelButtonText: "Cancelar",
          allowEscapeKey: false,
          allowOutsideClick: false
    }).then( async (result) => {
      if (result.isConfirmed) {
        this.iniciarLoading();
        try
        {
            const { cliente, rucempresa, notacredito, datosdetalles } = await this.srinotacredito.buscarNotaCredito(this.cod_nota_credito, this.codigo_iva);

            const resultado = await this.srinotacredito.enviarSri(this.cod_proyecto, notacredito);
            if (resultado.estado == "RECIBIDA")
            {
              const resultadocomprobacionsri = await this.srinotacredito.comprobarSri(this.cod_proyecto, notacredito);
              const data = resultadocomprobacionsri.data;
              
              if(resultadocomprobacionsri.estado)
              {
                if(data.estadomensaje=="AUTORIZADO")
                {
                  this.toastr.success("Comprobante Autorizado", "INFORMACIÓN DEL SISTEMA");
                  const resultadoestado = await this.srinotacredito.actualizarEstado(notacredito.cod_nota_credito, notacredito.claveacceso, "", "", "AUTORIZADO", data.fechaautorizacion);
                  let arrnotacredito = await this.srinotacredito.crearArregloNotaCredito(this.cod_proyecto, cliente, rucempresa, notacredito, datosdetalles);
                  await this.informacionActualizarEstado(resultadoestado, "AUTORIZADO", notacredito.fecha_registro_hora);
                  arrnotacredito.fechaautorizacion = data.fechaautorizacion;
                  const resultadoride = await this.srinotacredito.crearRide(arrnotacredito, cliente);
                  if(resultadoride)
                  {
                    const resultadoenviocorreo = await this.srinotacredito.enviarCorreo(this.cod_proyecto, notacredito, cliente, rucempresa);
                    if(resultadoenviocorreo)
                    {
                      this.toastr.success("Correo enviado satisfactoriamente al cliente", "INFORMACIÓN DEL SISTEMA");
                      await this.srinotacredito.actualizarEstadoCorreo(notacredito.cod_nota_credito);
                      await this.informacionActualizarEstadoCorreo(notacredito.cod_nota_credito);
                    }
                  }
                }

                if(data.estadomensaje=="EN PROCESO")
                {
                  this.toastr.success("Comprobante en Proceso " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
                  const resultadoestado = await this.srinotacredito.actualizarEstado(notacredito.cod_nota_credito, "0", data.mensaje, data.informacionadicional, "EN PROCESO", data.fechaautorizacion);
                  await this.informacionActualizarEstado(resultadoestado, "EN PROCESO", notacredito.fecha_registro_hora);
                }

                if(data.estadomensaje=="NO AUTORIZADO")
                {
                  this.toastr.error("Comprobante No Autorizado: " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
                  const resultadoestado = await this.srinotacredito.actualizarEstado(notacredito.cod_nota_credito, "0", data.mensaje, data.informacionadicional, "NO AUTORIZADO", data.fechaautorizacion);
                  await this.informacionActualizarEstado(resultadoestado, "NO AUTORIZADO", notacredito.fecha_registro_hora);
                }
              }
              else
              {
                if(data.identificador=="0")
                {
                  this.toastr.warning("Comprobante en Proceso", "INFORMACIÓN DEL SISTEMA");
                  const resultadoestado = await this.srinotacredito.actualizarEstado(notacredito.cod_nota_credito, "0", resultado.data.mensaje, resultado.data.informacionadicional, "EN PROCESO", resultado.data.fechaautorizacion);
                await this.informacionActualizarEstado(resultadoestado, "EN PROCESO", notacredito.fecha_registro_hora);
                }
              }
            }
            else
            {
              if(resultado.estado=="EN PROCESO")//En procesamiento debe esperar 24 Horas
              {
                this.toastr.warning("Comprobante en Proceso " + resultado.data.mensaje, "INFORMACIÓN DEL SISTEMA");
                const resultadoestado = await this.srinotacredito.actualizarEstado(notacredito.cod_nota_credito, "0", resultado.data.mensaje, resultado.data.informacionadicional, "EN PROCESO", resultado.data.fechaautorizacion);
                await this.informacionActualizarEstado(resultadoestado, "EN PROCESO", notacredito.fecha_registro_hora);
              }
              else
              {
                if(resultado.estado=="DEVUELTA")
                {
                  this.toastr.error("Comprobante devuelto: " + resultado.data.mensaje + " " + resultado.data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
                  const resultadoestado = await this.srinotacredito.actualizarEstado(notacredito.cod_nota_credito, "0", resultado.data.mensaje, resultado.data.informacionadicional, "DEVUELTA", resultado.data.fechaautorizacion);
                  await this.informacionActualizarEstado(resultadoestado, "DEVUELTA", notacredito.fecha_registro_hora);
                }
                else//ERROR CONEXION
                {
                  this.toastr.error("Se Origino un error en el sistema de recepción de SRI: " + resultado.data.mensaje + " " + resultado.data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
                  const resultadoestado = await this.srinotacredito.actualizarEstadoError(notacredito.cod_nota_credito, resultado.data.identificador, resultado.data.mensaje, resultado.data.informacionadicional, "CREADA");
                  await this.informacionActualizarEstado(resultadoestado, "CREADA", notacredito.fecha_registro_hora);
                }
              }
            }

        } catch (err) {
          this.toastr.error(err.message || err, "INFORMACIÓN DEL SISTEMA");
        } finally {
          Swal.close();
        }


      } else if (result.isDismissed) {
        
      }

          

    });
  }

  async informacionActualizarEstado(data: any, estado: string, fecha_hora: string)
  {
    if (data.estado == true)
    {
      if(estado=="CREADA")
      {
        this.disabledbtnenviarcorreo = false;
        const parametrosenviar = {
          'cod_nota_credito' : this.cod_nota_credito,
          'estado' : 'CREADA',
          'fecha_hora': fecha_hora,
          'error_sri': 1
        };
        this.datosenvioestado.emit(parametrosenviar);
      }

      if(estado=="AUTORIZADO")
      {
        this.disabledbtnenviarcorreo = false;
        const parametrosenviar = {
          'cod_nota_credito' : this.cod_nota_credito,
          'estado' : 'AUTORIZADO',
          'fecha_hora': fecha_hora,
          'error_sri': 0
        };
        this.datosenvioestado.emit(parametrosenviar);
      }

      if(estado=="EN PROCESO")
      {
        const parametrosenviar = {
          'cod_nota_credito' : this.cod_nota_credito,
          'estado' : 'EN PROCESO',
          'fecha_hora': fecha_hora,
          'error_sri': 0
        };
        this.datosenvioestado.emit(parametrosenviar);
      }

      if(estado=="DEVUELTA")
      {
        const parametrosenviar = {
          'cod_nota_credito' : this.cod_nota_credito,
          'estado' : 'DEVUELTA',
          'fecha_hora': fecha_hora,
          'error_sri': 0
        };
        this.datosenvioestado.emit(parametrosenviar);
      }

      if(estado=="NO AUTORIZADO")
      {
        const parametrosenviar = {
          'cod_nota_credito' : this.cod_nota_credito,
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

  iniciarLoading()
  {
    Swal.fire({
      title: 'Procesando con el SRI...',
      html: `<div class="spinner-border text-primary" style="width: 3rem; height: 3rem; margin-top: 1rem; margin-bottom: 1rem;"></div>`,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      backdrop: true,
      customClass: {
        popup: 'swal2-loading-popup'
      }
    });
  }

  async informacionActualizarEstadoCorreo(cod_nota_credito: string)
  {
    const parametrosenviar = {
      'cod_nota_credito' : cod_nota_credito,
      'envio' : 'ENVIADO'
    };
    this.datosenviocorreo.emit(parametrosenviar);
  }

}