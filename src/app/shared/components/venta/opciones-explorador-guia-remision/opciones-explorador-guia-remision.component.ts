import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { GuiaRemisionService } from 'src/app/venta/services/guia-remision.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { ConfigService } from 'src/app/shared/services/config.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { SriGuiaRemisionService } from 'src/app/shared/services/sri-guia-remision.service';
import { GuiaRemisionDTO } from 'src/app/venta/models/guia-remision.dto';
import { TransportistaDTO } from 'src/app/venta/models/transportista.dto';
import { RucEmpresaDTO } from 'src/app/usuario/models/rucempresa.dto';

@Component({
  selector: 'app-opciones-explorador-guia-remision',
  templateUrl: './opciones-explorador-guia-remision.component.html',
  styleUrls: ['./opciones-explorador-guia-remision.component.css']
})
export class OpcionesExploradorGuiaRemisionComponent implements OnInit {
  @Input() tipoformulario: string = "";
  @Output() datosenvioestado: EventEmitter<any> = new EventEmitter<any>();
  @Output() datosenviocorreo: EventEmitter<any> = new EventEmitter<any>();
  @Output() datosenviomantenerestados: EventEmitter<any> = new EventEmitter<any>();
  electronico : string = "0";

  estado_comprobante : string = "";
 
  cod_proyecto : string = "";
  claveacceso : string = "";

  numero_guia : string = "";
  razon_social_transportista : string = "";
  cod_guia_remision : string = "";
  tipo_venta : string = "";
  ptoemi : string = "";
  correo : string = "";
  cod_factura_venta = "";
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

  arr_guia_remision : any;

  opcionesprivilegios : any;

  constructor(private router : Router, private guiaremisionservice:GuiaRemisionService, private toastr: ToastrService, private error:ErrorService, private usersession: UserSessionService, private sriguiaremision: SriGuiaRemisionService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.electronico = this.usersession.getConfiguracion("electronico");
    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  descargarRide()
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/guiasremision/0_ride/" + this.cod_guia_remision + ".pdf", "Ride", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }

  descargarXml()
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/guiasremision/3_autorizados/" + this.cod_guia_remision + ".xml", "Documento", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }

  descargarDocumentos()
  {
	  window.open(this.configService.settings.baseUrlSri + "/api/guiaremision/descargararchivoguiaremision.php?cod_proyecto=" + this.cod_proyecto + "&cod_guia_remision=" + this.cod_guia_remision + "&numero_guia=" + this.padLeft(this.numero_guia, 9) + "&serieestab=" + this.serieestab + "&ptoemi=" + this.ptoemi + "&op=2");
  }

  descargarXmlAutorizado()
  {
	  window.open(this.configService.settings.baseUrlSri + "/api/guiaremision/descargararchivoguiaremision.php?cod_proyecto=" + this.cod_proyecto + "&cod_guia_remision=" + this.cod_guia_remision + "&numero_guia=" + this.padLeft(this.numero_guia, 9) + "&serieestab=" + this.serieestab + "&ptoemi=" + this.ptoemi + "&op=1");
  }

  clickCrearRide()
  {
    this.buscarGuiaRemision();
  }

  visualizar()
  {
     let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/guiaremision?codguiaremision=" + this.cod_guia_remision + "&electronico=" + this.electronico, "Guia Remisión", 'width=600,height=400,left=300,top=100');
     miVentana.focus();
  }

  async editar()
  {
    if(this.estado_comprobante != "AUTORIZADO")
    {
      try
      {
        this.iniciarLoading();
        let guiaremision1: GuiaRemisionDTO = new GuiaRemisionDTO;
        guiaremision1.claveacceso = this.claveacceso;

        const resultadocomprobacionsri = await this.sriguiaremision.verificarComprobanteSri(guiaremision1);
        const data = resultadocomprobacionsri.data;
        if(resultadocomprobacionsri.estado)
        {
            if(data.estadomensaje=="AUTORIZADO")
            {
              await Swal.fire({
                title: "Control del Sistema",
                text: "El comprobante Nº " + this.numero_guia + " no se puede editar porque está en estado AUTORIZADA, precione el boton Enviar SRI para actualizar el estado",
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
                  text: "El comprobante Nº " + this.numero_guia + " no se puede editar porque está en estado EN PROCESO, precione el boton Enviar SRI para actualizar el estado",
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
                this.router.navigate(["/menuventa/guiaremision", "actualizarregistro", 0, this.cod_guia_remision]);
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
                    text: "El comprobante Nº " + this.numero_guia + " con fecha " + fecha_hora + " esta en estado EN PROCESO, no se puede editar hasta obtener un resultado de autorización. Debe esperar máximo 24 Horas a partir de la fecha y hora del comprobante para poder comprobar su autorización",
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
                  this.router.navigate(["/menuventa/guiaremision", "actualizarregistro", 0, this.cod_guia_remision]);
              }
          }
          else
          {
              this.mantenerEstados();
              this.datosenviomantenerestados.emit();
              this.router.navigate(["/menuventa/guiaremision", "actualizarregistro", 0, this.cod_guia_remision]);
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

  opciones(item: any)
  {
    this.ruc = item.ruc_sucursal
    this.tipoambiente = item.tipo_ambiente;
    this.cod_guia_remision = item.cod_guia_remision;
    this.numero_guia = item.numero_guia;
    this.razon_social_transportista = item.razon_social_transportista;
    this.claveacceso = item.claveacceso;
    this.serieestab = item.serieestab;
    this.ptoemi = item.ptoemi;
    this.correo = item.correo;
    this.cod_factura_venta = item.cod_factura_venta;
    this.arr_guia_remision = {};
    this.estado_comprobante = item.estado;
    this.fecha_hora = item.fecha_hora;
    this.error_sri = item.error_sri;

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
   
    $("#mymodalopcionesguiaremision").modal("show");
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
   
    this.numero_guia = "";
    this.cod_guia_remision = "";
  }

  clickAnular()
  {
    Swal.fire({
      title: 'ANULAR GUIA REMISIÓN Nº '  + this.numero_guia + " - " + this.razon_social_transportista,
      text: 'Confirmar para anular el registro seleccionado',
      icon: 'info',//'warning'
      showCancelButton: true,
      confirmButtonText: 'Si, Anular',
      cancelButtonText: 'No, Anular'
    }).then((result) => {
      if (result.value) {
        this.anularGuiaRemision();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }

  anularGuiaRemision = () =>{
      this.comprobarSriAnular();
  }

  comprobarSriAnular = () =>{

    
  }

  guardarAnulacionFactura = () =>{

    this.loadingmodal = true;

    const parametros = {
      'cod_guia_remision' : this.cod_guia_remision,
      'claveacceso' : this.claveacceso
    };

    this.guiaremisionservice.anularGuiaRemision(parametros).subscribe( (data : any) =>
    {
        this.loadingmodal = false;

        if (data.estado == true)
        {
          //this.datos.find((x:any) => x.cod_guia_remision === this.cod_guia_remision).estado = 'ANULADA';
          const parametrosenviar = {
            'cod_guia_remision' : this.cod_guia_remision,
            'estado' : 'ANULADA',
            'fecha_hora': this.fecha_hora,
            'error_sri': 0
          };
          this.datosenvioestado.emit(parametrosenviar);
          this.toastr.success("Guía de Remisión Anulada Correctamente, se restablecieron valores del inventario", "INFORMACIÓN DEL SISTEMA");
        }
        else
        {
         this.toastr.error("No se pudo anularGuía de Remisión, vuelva a intentar por favor", "INFORMACIÓN DEL SISTEMA");
        }
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loadingmodal = false;
    });
  }

  revisarDocumentoError()
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/guiasremision/4_rechazados/" + this.cod_guia_remision + ".xml", "Documento", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }

  revisarDocumentoXml()
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/guiasremision/1_creados/" + this.cod_guia_remision + ".xml", "Documento", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }

  async comprobarSri()
  {
    try
    {
      this.iniciarLoading();
      let guiaremision1: GuiaRemisionDTO = new GuiaRemisionDTO;
      guiaremision1.claveacceso = this.claveacceso;

      const resultadocomprobacionsri = await this.sriguiaremision.verificarComprobanteSri(guiaremision1);
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
      let guiaremision: GuiaRemisionDTO = new GuiaRemisionDTO;
      let transportista: TransportistaDTO = new TransportistaDTO;
      let rucempresa: RucEmpresaDTO = new RucEmpresaDTO;

      guiaremision.cod_guia_remision = this.cod_guia_remision;
      rucempresa.nombre_comercial = this.nombre_comercial;
      guiaremision.numero_factura = this.padLeft(this.numero_guia, 9);
      transportista.correo = this.correo;
      transportista.razon_social_transportista = this.razon_social_transportista;
      rucempresa.serieestab = this.padLeft(this.serieestab, 3);
      rucempresa.ptoemi = this.padLeft(this.ptoemi, 3);

      const resultadoenviocorreo = await this.sriguiaremision.enviarCorreo(this.cod_proyecto, guiaremision, transportista, rucempresa);
      if(resultadoenviocorreo)
      {
        this.toastr.success("Correo enviado satisfactoriamente al cliente", "INFORMACIÓN DEL SISTEMA");
        await this.guiaremisionservice.actualizarEstadoCorreo(guiaremision.cod_guia_remision);
        await this.informacionActualizarEstadoCorreo(guiaremision.cod_guia_remision);
      }
    } catch (err) {
      this.toastr.error(err.message || err, "INFORMACIÓN DEL SISTEMA");
    } finally {
      Swal.close();
    }
  }
 
  buscarGuiaRemision()
  {
    this.loadingmodal = true;

    this.guiaremisionservice.buscarGuiaRemision(this.cod_guia_remision).subscribe( (data : any) =>
    {
      //console.log(data);
      let detalles = [];
      data.forEach(item => {

        let descripcion="";
          if(item.tarifa=="NORMAL")
          {
            descripcion = item.detalle;
          }
          else
          {
            descripcion = item.tarifa + " - " + item.detalle;
          }

        let detalle = {
          'codigointerno' : item.cod_producto,
          'codigoadicional' : 'NA',
          'cantidad' : item.cantidad_comprar,
          'descripcion' : descripcion
        };
        detalles.push(detalle);
      });
      
      this.arr_guia_remision = {
        'cod_proyecto' : this.cod_proyecto,
        'cod_guia_remision' : data[0]["cod_guia_remision"],
        'cod_sucursal' : data[0]["cod_ruc"],
        'ambiente' : data[0]["tipo_ambiente"],
        'tipoemision' : '1',
        'razonsocial' : data[0]["razonsocial"],
        'nombrecomercial' : data[0]["nombrecomercial"],
        'ruc' : data[0]["ruc_sucursal"],
        'claveacceso' : data[0]["claveacceso"],
        'coddoc' : '06',//Guia Remisión
        'estab' : this.padLeft(data[0]["serieestab"], 3),
        'ptoemi' : this.padLeft(data[0]["ptoemi"], 3),
        'secuencial' : data[0]["numero_guia"],
        'dirmatriz' : data[0]["direccion_matriz"],
        'tipocontribuyente' : data[0]["tipo_contribuyente"],
        'contribuyente' : data[0]["contribuyente"],
        'leyenda' : data[0]["leyenda"],

        'firmap12' : data[0]["firmap12"],
        'clavep12' : data[0]["clavep12"],
        'pk12' : data[0]["pk12"],
        'firmapublica' : data[0]["firmapublica"],
        'firmaprivada' : data[0]["firmaprivada"],
        'certificado' : data[0]["certificado"],

        'direstablecimiento' : data[0]["direccion_establecimiento"],
        'obligadocontabilidad' : data[0]["contabilidad"],
        'fecha_hora' : data[0]["fecha_hora"],
        'fechaautorizacion' : data[0]["fechaautorizacion"],
        'cod_identificacion_transportista' : data[0]["cod_identificacion_transportista"],
        'razon_social_transportista' :  data[0]["razon_social_transportista"],
        'identificacion_transportista' : data[0]["identificacion_transportista"],
        'placa' : data[0]["placa"],
        'punto_partida' : data[0]["punto_partida"],
        'fecha_inicio_transporte' : data[0]["fecha_inicio_transporte"],
        'fecha_fin_transporte' : data[0]["fecha_fin_transporte"],
        'comprobante' : data[0]["comprobante"],
        'numero_factura' : data[0]["numero_factura"],
        'fecha_emision_factura' : data[0]["fecha_emision_factura"],
        'n_autorizacion_factura' : data[0]["n_autorizacion_factura"],
        'motivo_traslado' : data[0]["motivo_traslado"],
        'destino' : data[0]["destino"],
        'identificacion_destinatario' : data[0]["identificacion_destinatario"],
        'razon_social_destinatario' : data[0]["razon_social_destinatario"],
        'documento_aduanero' : data[0]["documento_aduanero"],
        'codigo_establecimiento_destino' : data[0]["codigo_establecimiento_destino"],
        'ruta' : data[0]["ruta"],
        'observacion' : data[0]["observacion"],
        'cod_factura_venta' : data[0]["cod_factura_venta"],
        'cod_usuario' : data[0]["cod_usuario"],
        'correo' : data[0]["correo"],	
        'detalles' : detalles,
        'facturaversion' : data[0]["facturaversion"]
      };

      this.crearRide();

     
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingmodal = false;
    });
  }

  crearRide()
  {	 
    this.loadingmodal = true;

    this.guiaremisionservice.crearRide(this.arr_guia_remision).subscribe( (data : any) =>
    {
        this.loadingmodal = false;
        this.toastr.info("Ride Creado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loadingmodal = false;
    });
  }

  mantenerEstados()
  {
    sessionStorage.setItem("tipo_formulario", "explorador_guia_remision");//Restaurar datos
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
        let guiaremision1: GuiaRemisionDTO = new GuiaRemisionDTO;
        guiaremision1.cod_guia_remision = this.cod_guia_remision;
        guiaremision1.claveacceso = this.claveacceso;
  
        const resultadocomprobacionsri = await this.sriguiaremision.comprobarSriRapido(this.cod_proyecto, guiaremision1);
        if(resultadocomprobacionsri.estado)
        {
          const data = resultadocomprobacionsri.data;
          if(data.estadomensaje=="AUTORIZADO")
          {
            this.toastr.success("Comprobante ya está Autorizado", "INFORMACIÓN DEL SISTEMA");
            const resultadoestado = await this.sriguiaremision.actualizarEstado(guiaremision1.cod_guia_remision, guiaremision1.claveacceso, "", "", "AUTORIZADO", data.fechaautorizacion);
            await this.informacionActualizarEstado(resultadoestado, "AUTORIZADO", data.fechaautorizacion);
  
            const { transportista, rucempresa, guiaremision, datosdetalles } = await this.sriguiaremision.buscarGuiaRemision(this.cod_guia_remision);
            let arrguiaremision = await this.sriguiaremision.crearArregloGuiaRemision(this.cod_proyecto, transportista, rucempresa, guiaremision, datosdetalles);
            const resultadoride = await this.sriguiaremision.crearRide(arrguiaremision, transportista);
            if(resultadoride)
            {
              const resultadoenviocorreo = await this.sriguiaremision.enviarCorreo(this.cod_proyecto, guiaremision, transportista, rucempresa);
              if(resultadoenviocorreo)
              {
                this.toastr.success("Correo enviado satisfactoriamente al cliente", "INFORMACIÓN DEL SISTEMA");
                await this.sriguiaremision.actualizarEstadoCorreo(guiaremision.cod_guia_remision);
                await this.informacionActualizarEstadoCorreo(guiaremision.cod_guia_remision);
              }
            }
          }
  
          if(data.estadomensaje=="EN PROCESO")
          {
            this.toastr.success("Comprobante ya está en Proceso de Comprobación " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
            const resultadoestado = await this.sriguiaremision.actualizarEstado(guiaremision1.cod_guia_remision, "0", data.mensaje, data.informacionadicional, "EN PROCESO", data.fechaautorizacion);
            await this.informacionActualizarEstado(resultadoestado, "EN PROCESO", data.fechaautorizacion);
          }
  
          if(data.estadomensaje=="DEVUELTA")
          {
            this.toastr.error("Comprobante Devuelta: " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
            const resultadoestado = await this.sriguiaremision.actualizarEstado(guiaremision1.cod_guia_remision, "0", data.mensaje, data.informacionadicional, "DEVUELTA", data.fechaautorizacion);
            await this.informacionActualizarEstado(resultadoestado, "EN PROCESO", data.fechaautorizacion);
            await this.confirmarEnvioComprobante();
          }
  
          if(data.estadomensaje=="NO AUTORIZADO")
          {
            this.toastr.error("Comprobante No Autorizado: " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
            const resultadoestado = await this.sriguiaremision.actualizarEstado(guiaremision1.cod_guia_remision, "0", data.mensaje, data.informacionadicional, "NO AUTORIZADO", data.fechaautorizacion);
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
                    text: "El comprobante Nº " + this.numero_guia + " con fecha " + fecha_hora + " esta en estado EN PROCESO, no se puede obtener un resultado de autorización en estos momentos, intente más tarde. Debe esperar máximo 24 Horas a partir de la fecha y hora del comprobante para poder comprobar su autorización",
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
              await this.sriguiaremision.actualizarFechaClaveAccesoActual(this.cod_guia_remision, this.numero_guia, this.ruc, this.tipoambiente, this.serieestab, this.ptoemi);
  
              const { transportista, rucempresa, guiaremision, datosdetalles } = await this.sriguiaremision.buscarGuiaRemision(this.cod_guia_remision);
              let arrguiaremision = await this.sriguiaremision.crearFirmarXml2(this.cod_proyecto, transportista, rucempresa, guiaremision, datosdetalles);
              
              const resultado = await this.sriguiaremision.enviarSri(this.cod_proyecto, guiaremision);
              if (resultado.estado == "RECIBIDA")
              {
                const resultadocomprobacionsri = await this.sriguiaremision.comprobarSri(this.cod_proyecto, guiaremision);
                const data = resultadocomprobacionsri.data;
                
                if(resultadocomprobacionsri.estado)
                {
                  if(data.estadomensaje=="AUTORIZADO")
                  {
                    this.toastr.success("Comprobante Autorizado", "INFORMACIÓN DEL SISTEMA");
                    const resultadoestado = await this.sriguiaremision.actualizarEstado(guiaremision.cod_guia_remision, guiaremision.claveacceso, "", "", "AUTORIZADO", data.fechaautorizacion);
                    
                    await this.informacionActualizarEstado(resultadoestado, "AUTORIZADO", guiaremision.fecha_registro_hora);
                    arrguiaremision.fechaautorizacion = data.fechaautorizacion;
                    const resultadoride = await this.sriguiaremision.crearRide(arrguiaremision, transportista);
                    if(resultadoride)
                    {
                      const resultadoenviocorreo = await this.sriguiaremision.enviarCorreo(this.cod_proyecto, guiaremision, transportista, rucempresa);
                      if(resultadoenviocorreo)
                      {
                        this.toastr.success("Correo enviado satisfactoriamente al cliente", "INFORMACIÓN DEL SISTEMA");
                        await this.sriguiaremision.actualizarEstadoCorreo(guiaremision.cod_guia_remision);
                        await this.informacionActualizarEstadoCorreo(guiaremision.cod_guia_remision);
                      }
                    }
                  }
  
                  if(data.estadomensaje=="EN PROCESO")
                  {
                    this.toastr.success("Comprobante en Proceso " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
                    const resultadoestado = await this.sriguiaremision.actualizarEstado(guiaremision.cod_guia_remision, "0", data.mensaje, data.informacionadicional, "EN PROCESO", data.fechaautorizacion);
                    await this.informacionActualizarEstado(resultadoestado, "EN PROCESO", guiaremision.fecha_registro_hora);
                  }
  
                  if(data.estadomensaje=="NO AUTORIZADO")
                  {
                    this.toastr.error("Comprobante No Autorizado: " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
                    const resultadoestado = await this.sriguiaremision.actualizarEstado(guiaremision.cod_guia_remision, "0", data.mensaje, data.informacionadicional, "NO AUTORIZADO", data.fechaautorizacion);
                    await this.informacionActualizarEstado(resultadoestado, "NO AUTORIZADO", guiaremision.fecha_registro_hora);
                  }
                }
                else
                {
                  if(data.identificador=="0")
                  {
                    this.toastr.warning("Comprobante en Proceso", "INFORMACIÓN DEL SISTEMA");
                    const resultadoestado = await this.sriguiaremision.actualizarEstado(guiaremision.cod_guia_remision, "0", resultado.data.mensaje, resultado.data.informacionadicional, "EN PROCESO", resultado.data.fechaautorizacion);
                    await this.informacionActualizarEstado(resultadoestado, "EN PROCESO", guiaremision.fecha_registro_hora);
                  }
                }
              }
              else
              {
                if(resultado.estado=="EN PROCESO")//En procesamiento debe esperar 24 Horas
                {
                  this.toastr.warning("Comprobante en Proceso " + resultado.data.mensaje, "INFORMACIÓN DEL SISTEMA");
                  const resultadoestado = await this.sriguiaremision.actualizarEstado(guiaremision.cod_guia_remision, "0", resultado.data.mensaje, resultado.data.informacionadicional, "EN PROCESO", resultado.data.fechaautorizacion);
                  await this.informacionActualizarEstado(resultadoestado, "EN PROCESO", guiaremision.fecha_registro_hora);
                }
                else
                {
                  if(resultado.estado=="DEVUELTA")
                  {
                    this.toastr.error("Comprobante devuelto: " + resultado.data.mensaje + " " + resultado.data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
                    const resultadoestado = await this.sriguiaremision.actualizarEstado(guiaremision.cod_guia_remision, "0", resultado.data.mensaje, resultado.data.informacionadicional, "DEVUELTA", resultado.data.fechaautorizacion);
                    await this.informacionActualizarEstado(resultadoestado, "DEVUELTA", guiaremision.fecha_registro_hora);
                  }
                  else//ERROR CONEXION
                  {
                    this.toastr.error("Se Origino un error en el sistema de recepción de SRI: " + resultado.data.mensaje + " " + resultado.data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
                    const resultadoestado = await this.sriguiaremision.actualizarEstadoError(guiaremision.cod_guia_remision, resultado.data.identificador, resultado.data.mensaje, resultado.data.informacionadicional, "CREADA");
                    await this.informacionActualizarEstado(resultadoestado, "CREADA", guiaremision.fecha_registro_hora);
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
              const { transportista, rucempresa, guiaremision, datosdetalles } = await this.sriguiaremision.buscarGuiaRemision(this.cod_guia_remision);

              const resultado = await this.sriguiaremision.enviarSri(this.cod_proyecto, guiaremision);
              if (resultado.estado == "RECIBIDA")
              {
                const resultadocomprobacionsri = await this.sriguiaremision.comprobarSri(this.cod_proyecto, guiaremision);
                const data = resultadocomprobacionsri.data;
                
                if(resultadocomprobacionsri.estado)
                {
                  if(data.estadomensaje=="AUTORIZADO")
                  {
                    this.toastr.success("Comprobante Autorizado", "INFORMACIÓN DEL SISTEMA");
                    const resultadoestado = await this.sriguiaremision.actualizarEstado(guiaremision.cod_guia_remision, guiaremision.claveacceso, "", "", "AUTORIZADO", data.fechaautorizacion);
                    let arrguiaremision = await this.sriguiaremision.crearArregloGuiaRemision(this.cod_proyecto, transportista, rucempresa, guiaremision, datosdetalles);
                    await this.informacionActualizarEstado(resultadoestado, "AUTORIZADO", guiaremision.fecha_registro_hora);
                    arrguiaremision.fechaautorizacion = data.fechaautorizacion;
                    const resultadoride = await this.sriguiaremision.crearRide(arrguiaremision, transportista);
                    if(resultadoride)
                    {
                      const resultadoenviocorreo = await this.sriguiaremision.enviarCorreo(this.cod_proyecto, guiaremision, transportista, rucempresa);
                      if(resultadoenviocorreo)
                      {
                        this.toastr.success("Correo enviado satisfactoriamente al cliente", "INFORMACIÓN DEL SISTEMA");
                        await this.sriguiaremision.actualizarEstadoCorreo(guiaremision.cod_guia_remision);
                        await this.informacionActualizarEstadoCorreo(guiaremision.cod_guia_remision);
                      }
                    }
                  }
  
                  if(data.estadomensaje=="EN PROCESO")
                  {
                    this.toastr.success("Comprobante en Proceso " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
                    const resultadoestado = await this.sriguiaremision.actualizarEstado(guiaremision.cod_guia_remision, "0", data.mensaje, data.informacionadicional, "EN PROCESO", data.fechaautorizacion);
                    await this.informacionActualizarEstado(resultadoestado, "EN PROCESO", guiaremision.fecha_registro_hora);
                  }
  
                  if(data.estadomensaje=="NO AUTORIZADO")
                  {
                    this.toastr.error("Comprobante No Autorizado: " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
                    const resultadoestado = await this.sriguiaremision.actualizarEstado(guiaremision.cod_guia_remision, "0", data.mensaje, data.informacionadicional, "NO AUTORIZADO", data.fechaautorizacion);
                    await this.informacionActualizarEstado(resultadoestado, "NO AUTORIZADO", guiaremision.fecha_registro_hora);
                  }
                }
                else
                {
                  if(data.identificador=="0")
                  {
                    this.toastr.warning("Comprobante en Proceso", "INFORMACIÓN DEL SISTEMA");
                    const resultadoestado = await this.sriguiaremision.actualizarEstado(guiaremision.cod_guia_remision, "0", resultado.data.mensaje, resultado.data.informacionadicional, "EN PROCESO", resultado.data.fechaautorizacion);
                    await this.informacionActualizarEstado(resultadoestado, "EN PROCESO", guiaremision.fecha_registro_hora);
                  }
                }
              }
              else
              {
                if(resultado.estado=="EN PROCESO")//En procesamiento debe esperar 24 Horas
                {
                  this.toastr.warning("Comprobante en Proceso " + resultado.data.mensaje, "INFORMACIÓN DEL SISTEMA");
                  const resultadoestado = await this.sriguiaremision.actualizarEstado(guiaremision.cod_guia_remision, "0", resultado.data.mensaje, resultado.data.informacionadicional, "EN PROCESO", resultado.data.fechaautorizacion);
                  await this.informacionActualizarEstado(resultadoestado, "EN PROCESO", guiaremision.fecha_registro_hora);
                }
                else
                {
                  if(resultado.estado=="DEVUELTA")
                  {
                    this.toastr.error("Comprobante devuelto: " + resultado.data.mensaje + " " + resultado.data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
                    const resultadoestado = await this.sriguiaremision.actualizarEstado(guiaremision.cod_guia_remision, "0", resultado.data.mensaje, resultado.data.informacionadicional, "DEVUELTA", resultado.data.fechaautorizacion);
                    await this.informacionActualizarEstado(resultadoestado, "DEVUELTA", guiaremision.fecha_registro_hora);
                  }
                  else//ERROR CONEXION
                  {
                    this.toastr.error("Se Origino un error en el sistema de recepción de SRI: " + resultado.data.mensaje + " " + resultado.data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
                    const resultadoestado = await this.sriguiaremision.actualizarEstadoError(guiaremision.cod_guia_remision, resultado.data.identificador, resultado.data.mensaje, resultado.data.informacionadicional, "CREADA");
                    await this.informacionActualizarEstado(resultadoestado, "CREADA", guiaremision.fecha_registro_hora);
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
            'cod_guia_remision' : this.cod_guia_remision,
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
            'cod_guia_remision' : this.cod_guia_remision,
            'estado' : 'AUTORIZADO',
            'fecha_hora': fecha_hora,
            'error_sri': 0
          };
          this.datosenvioestado.emit(parametrosenviar);
        }
  
        if(estado=="EN PROCESO")
        {
          const parametrosenviar = {
            'cod_guia_remision' : this.cod_guia_remision,
            'estado' : 'EN PROCESO',
            'fecha_hora': fecha_hora,
            'error_sri': 0
          };
          this.datosenvioestado.emit(parametrosenviar);
        }
  
        if(estado=="DEVUELTA")
        {
          const parametrosenviar = {
            'cod_guia_remision' : this.cod_guia_remision,
            'estado' : 'DEVUELTA',
            'fecha_hora': fecha_hora,
            'error_sri': 0
          };
          this.datosenvioestado.emit(parametrosenviar);
        }
  
        if(estado=="NO AUTORIZADO")
        {
          const parametrosenviar = {
            'cod_guia_remision' : this.cod_guia_remision,
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

  async informacionActualizarEstadoCorreo(cod_guia_remision: string)
  {
    const parametrosenviar = {
      'cod_guia_remision' : cod_guia_remision,
      'envio' : 'ENVIADO'
    };
    this.datosenviocorreo.emit(parametrosenviar);
  }

  async crearFirmaXml()
  {
    const { transportista, rucempresa, guiaremision, datosdetalles } = await this.sriguiaremision.buscarGuiaRemision(this.cod_guia_remision);
    let arrguiaremision = await this.sriguiaremision.crearFirmarXml2(this.cod_proyecto, transportista, rucempresa, guiaremision, datosdetalles);
  }
}