import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { RetencionService } from 'src/app/retencion/services/retencion.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ConfigService } from 'src/app/shared/services/config.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-opciones-explorador-retencion',
  templateUrl: './opciones-explorador-retencion.component.html',
  styleUrls: ['./opciones-explorador-retencion.component.css']
})
export class OpcionesExploradorRetencionComponent implements OnInit {
  @Input() tipoformulario: string = "";
  @Output() datosenvioestado: EventEmitter<any> = new EventEmitter<any>();
  @Output() datosenviocorreo: EventEmitter<any> = new EventEmitter<any>();
  @Output() datosenviomantenerestados: EventEmitter<any> = new EventEmitter<any>();

  estado_comprobante : string = "";
 
  cod_proyecto : string = "";
  claveacceso : string = "";

  numero_retencion : string = "";
  proveedor : string = "";
  cod_retencion : string = "";
  ptoemi : string = "";
  correo : string = "";

  cod_factura_compra = "";

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

  arr_retencion : any;

  constructor(private router : Router, private retencionservice: RetencionService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private usersession: UserSessionService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  descargarRide()
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/retenciones/0_ride/" + this.cod_retencion + ".pdf", "Ride", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }

  descargarXml()
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/retenciones/3_autorizados/" + this.cod_retencion + ".xml", "Documento", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }

  descargarDocumentos()
  {
	  window.open(this.configService.settings.baseUrlSri + "/ride/descargararchivoretencion?cod_proyecto=" + this.cod_proyecto + "&cod_retencion=" + this.cod_retencion + "&op=2");
  }

  clickCrearRide()
  {
    this.buscarRetencionCompra();
  }

  visualizar()
  {
    let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/retenciones/retencion?codretencion=" + this.cod_retencion, "Retención", 'width=600,height=400,left=300,top=100');
    miVentana.focus();
  }

  editar()
  {
    //this.mantenerEstados();
    this.datosenviomantenerestados.emit();
	  this.router.navigate(["/menuretencion/retencion", "actualizarregistro", this.cod_retencion, this.cod_factura_compra]);
  }

  opciones(cod_retencion: string, numero_retencion: string, estado: string, proveedor : string, claveacceso : string, ptoemi : string, correo : string, cod_factura_compra : string)
  {
    this.cod_retencion = cod_retencion;
    this.numero_retencion = numero_retencion;
    this.proveedor = proveedor;
    this.claveacceso = claveacceso;
    this.ptoemi = ptoemi;
    this.correo = correo;
    this.cod_factura_compra = cod_factura_compra;
    this.arr_retencion = {};
    this.estado_comprobante = estado;
    if(estado=="AUTORIZADO")
    {
      this.configurarBotones(true, false, true, false, false, false, false, false, false);
    }
    else
    {
      if(estado=="ANULADA")
      {
        this.configurarBotones(true, true, true, true, false, false, false, false, false);
      }
      else
      {
        this.configurarBotones(false, true, false, true, true, true, true, true, true);
      }
    }
    $("#mymodalopcionesretencion").modal("show");
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
    this.claveacceso = "";

    this.estado_comprobante = "";
   
    this.numero_retencion = "";
    this.cod_retencion = "";
  }
 
  clickAnular()
  {
    Swal.fire({
      title: 'ANULAR RETENCIÓN Nº '  + this.numero_retencion + ' - ' + this.proveedor,
      text: 'Confirmar para anular el registro seleccionado',
      icon: 'info',//'warning'
      showCancelButton: true,
      confirmButtonText: 'Si, Anular',
      cancelButtonText: 'No, Anular'
    }).then((result) => {
      if (result.value) {
        this.anularFacturaVenta();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }
  
  //La anulación de nota de crédito se hace por via sri
  anularFacturaVenta = () =>{
    this.comprobarSriAnular();
  }

  comprobarSriAnular(){
    let parametros = {
      'cod_proyecto' : this.cod_proyecto,
      'cod_retencion' : this.cod_retencion,
      'claveacceso' : this.claveacceso
    };
  
    this.loadingmodal = true;

    this.retencionservice.verificarComprobanteSri(parametros).subscribe( (data : any) =>
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
      'cod_retencion' : this.cod_retencion,
      'claveacceso' : this.claveacceso
    };

    this.retencionservice.anularRetencionCompra(parametros).subscribe( (data : any) =>
    {
        this.loadingmodal = false;

        if (data.estado == true)
        {
          //this.datos.find((x:any) => x.cod_retencion === this.cod_retencion).estado = 'ANULADA';
          const parametrosenviar = {
            'cod_retencion' : this.cod_retencion,
            'estado' : 'ANULADA'
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
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/retenciones/4_rechazados/" + this.cod_retencion + ".xml", "Documento", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }

  revisarDocumentoXml()
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/retenciones/1_creados/" + this.cod_retencion + ".xml", "Documento", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }

  comprobarSriEnvio()
  {
      let parametros = {
          'cod_proyecto' : this.cod_proyecto,
          'cod_retencion' : this.cod_retencion,
		      'claveacceso' : this.claveacceso
        };
      
      this.loadingmodal = true;

      this.retencionservice.comprobarSri(parametros).subscribe( (data : any) =>
      {
          this.loadingmodal = false;

          if (data.estado == true)
						{
							if(data.estadomensaje=="AUTORIZADO")
							{
								this.actualizarEstado(this.cod_retencion, this.claveacceso, "", "", "AUTORIZADO", data.fechaautorizacion);
							}

							if(data.estadomensaje=="EN PROCESO")
							{		
								this.actualizarEstado(this.cod_retencion, "0", data.mensaje, data.informacionadicional, "EN PROCESO", data.fechaautorizacion);
							}

              if(data.estadomensaje=="DEVUELTA")
							{
								this.enviarSriEnvio();
							}

							if(data.estadomensaje=="NO AUTORIZADO")
							{
                this.enviarSriEnvio();
							}
						}
						else
						{
							if(data.estadomensaje=="0")
							{
								this.enviarSriEnvio();
							}
							else
							{
								this.toastr.error("Se Origino un error " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
							}
						}
        }, err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loadingmodal = false;
      });
  }

  enviarSriEnvio()
  {
      let parametros = {
          'cod_proyecto' : this.cod_proyecto,
          'cod_retencion' : this.cod_retencion
        };
      
      this.loadingmodal = true;

      this.retencionservice.enviarSri(parametros).subscribe( (data : any) =>
      {
          this.loadingmodal = false;
          if (data.estado == true)
          {
            if(data.estadomensaje=="RECIBIDA")
            {
              this.comprobarSriEnvio2();
            }
            else
            {
              //this.toastr.error("Comprobante rechazado: " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");

              this.actualizarEstado(this.cod_retencion, "0", data.mensaje, data.informacionadicional, "DEVUELTA", data.fechaautorizacion);
            }
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

  comprobarSriEnvio2()
  {
      let parametros = {
          'cod_proyecto' : this.cod_proyecto,
          'cod_retencion' : this.cod_retencion,
		      'claveacceso' : this.claveacceso
        };
      
      this.loadingmodal = true;

      this.retencionservice.comprobarSri(parametros).subscribe( (data : any) =>
      {
          this.loadingmodal = false;

          if (data.estado == true)
						{
							if(data.estadomensaje=="AUTORIZADO")
							{
								this.actualizarEstado(this.cod_retencion, this.claveacceso, "", "", "AUTORIZADO", data.fechaautorizacion);
							}

							if(data.estadomensaje=="EN PROCESO")
							{		
								this.actualizarEstado(this.cod_retencion, "0", data.mensaje, data.informacionadicional, "EN PROCESO", data.fechaautorizacion);
							}

              if(data.estadomensaje=="DEVUELTA")
							{
								this.actualizarEstado(this.cod_retencion, "0", data.mensaje, data.informacionadicional, "DEVUELTA", data.fechaautorizacion);
							}

							if(data.estadomensaje=="NO AUTORIZADO")
							{
                this.actualizarEstado(this.cod_retencion, "0", data.mensaje, data.informacionadicional, "NO AUTORIZADO", data.fechaautorizacion);
							}
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

  actualizarEstado(cod_retencion : string, n_autorizacion : string, mensaje_error : string, informacion_adicional : string, estado : string, fechaautorizacion: string)
  {
      let parametros = {
        'cod_retencion' : cod_retencion,
        'n_autorizacion' : n_autorizacion,
        'mensaje_error' : mensaje_error,
        'informacion_adicional' : informacion_adicional,
        'estado' : estado,
        'fechaautorizacion' : fechaautorizacion
      };
      
      this.loadingmodal = true;

      this.retencionservice.actualizarEstado(parametros).subscribe( (data : any) =>
      {
          this.loadingmodal = false;
          if (data.estado == true)
						{
							if(estado=="AUTORIZADO")
							{
                this.toastr.success("Comprobante Autorizado", "INFORMACIÓN DEL SISTEMA");
                //this.datos.find((x:any) => x.cod_retencion === this.cod_retencion).estado = 'AUTORIZADO';
                const parametrosenviar = {
                  'cod_retencion' : this.cod_retencion,
                  'estado' : 'AUTORIZADO'
                };
                this.datosenvioestado.emit(parametrosenviar);
                this.buscarRetencionCompra();
							}

							if(estado=="EN PROCESO")
							{
                this.toastr.success("Comprobante en Proceso " + mensaje_error, "INFORMACIÓN DEL SISTEMA");
								//this.datos.find((x:any) => x.cod_retencion === this.cod_retencion).estado = 'EN PROCESO';
                const parametrosenviar = {
                  'cod_retencion' : this.cod_retencion,
                  'estado' : 'EN PROCESO'
                };
                this.datosenvioestado.emit(parametrosenviar);
							}

							if(estado=="DEVUELTA")
							{
                this.toastr.error("Comprobante Devuelto " + mensaje_error + " " + informacion_adicional, "INFORMACIÓN DEL SISTEMA");
                //this.datos.find((x:any) => x.cod_retencion === this.cod_retencion).estado = 'DEVUELTA';
                const parametrosenviar = {
                  'cod_retencion' : this.cod_retencion,
                  'estado' : 'DEVUELTA'
                };
                this.datosenvioestado.emit(parametrosenviar);
							}

							if(estado=="NO AUTORIZADO")
							{
                this.toastr.error("Comprobante No Autorizado " + mensaje_error + " " + informacion_adicional, "INFORMACIÓN DEL SISTEMA");
                //this.datos.find((x:any) => x.cod_retencion === this.cod_retencion).estado = 'NO AUTORIZADO';
                const parametrosenviar = {
                  'cod_retencion' : this.cod_retencion,
                  'estado' : 'ANULADA'
                };
                this.datosenvioestado.emit(parametrosenviar);
							}
							
						}
						else
						{
							this.toastr.error("Registro no se pudo Almacenar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
						}
        }, err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loadingmodal = false;
      });
  }

  comprobarSri()
  {
      let parametros = {
          'cod_proyecto' : this.cod_proyecto,
          'cod_retencion' : this.cod_retencion,
		      'claveacceso' : this.claveacceso
        };
      
      this.loadingmodal = true;

      this.retencionservice.verificarComprobanteSri(parametros).subscribe( (data : any) =>
      {
          this.loadingmodal = false;

          if (data.estado == true)
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
								this.toastr.error("Este comprobante no Autorizado: " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
							}
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

  enviarCorreo()
  {
      let parametros = {
        
        'cod_proyecto' : this.cod_proyecto,
        'cod_retencion' : this.cod_retencion,
        'nombre_comercial' : this.nombre_comercial,
        'numero_retencion' : this.padLeft(this.numero_retencion, 9),
        'correo' : this.correo,
        'proveedor' : this.proveedor,
        'serieestab' : this.padLeft(this.serieestab, 3),
        'ptoemi' : this.padLeft(this.ptoemi, 3)
        
        };
      
      this.loadingmodal = true;

      this.retencionservice.enviarCorreoRetencion(parametros).subscribe( (data : any) =>
      {
          this.loadingmodal = false;

          if(data.estado == false)
          {
            this.toastr.error("Correo no se pudo enviar al proveedor", "INFORMACIÓN DEL SISTEMA");
          }
          else
          {
            this.toastr.success("Correo enviado satisfactoriamente al proveedor", "INFORMACIÓN DEL SISTEMA");
            this.actualizarEstadoCorreo();
          }
          
          
        }, err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loadingmodal = false;
      });
  }

  actualizarEstadoCorreo()
  {
      let parametros = {
        'cod_retencion' : this.cod_retencion
      };
      
      this.loadingmodal = true;

      this.retencionservice.actualizarEstadoCorreo(parametros).subscribe( (data : any) =>
      {
          this.loadingmodal = false;

          if (data.estado == false)
					{
            this.toastr.error("No se pudo actualizar estado de comprobante, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
          }
          else
          {
            //this.datos.find((x:any) => x.cod_retencion === this.cod_retencion).envio = 'ENVIADO';
            const parametrosenviar = {
              'cod_retencion' : this.cod_retencion,
              'envio' : 'ENVIADO'
            };
            this.datosenviocorreo.emit(parametrosenviar);
          }
          
        }, err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loadingmodal = false;
      });
  }
 
  buscarRetencionCompra()
  {
    this.loadingmodal = true;

    this.retencionservice.buscarRetencionCompra(this.cod_retencion).subscribe( (data : any) =>
    {
      //console.log(data);
      let detalles = [];
      data.forEach(item => {
        
        let detalle = {
          'cod_codigo_retencion' : item.cod_codigo_retencion,
          'codigo_retencion' : item.codigo_retencion,
          'base_imponible' : item.base_imponible,
          'porcentaje_retencion' : item.porcentaje_retencion,
          'valor_retenido' : item.valor_retenido,
          'codigo_tipo_documento' : item.cod_documento,
          'numero_documento' : item.numero_documento,
          'fecha_documento' : item.fecha_emision_documento,
          'codigo_tipo_impuesto' : item.codigo_tipo_impuesto,
          'tipo_impuesto' : item.tipo_impuesto
        };
        detalles.push(detalle);

      });

      this.arr_retencion = {
        'cod_proyecto' : this.cod_proyecto,
        'cod_retencion' : data[0]["cod_retencion"],
        'cod_sucursal' : data[0]["cod_ruc"],
        'ambiente' : data[0]["tipo_ambiente"],
        'tipoemision' : '1',
        'razonsocial' : data[0]["razonsocial"],
        'nombrecomercial' : data[0]["nombrecomercial"],
        'ruc' : data[0]["ruc_sucursal"],
        'claveacceso' : data[0]["claveacceso"],
        'coddoc' : '07',
        'estab' : data[0]["serieestab"],
        'ptoemi' : data[0]["ptoemi"],
        'secuencial' : data[0]["numero_retencion"],
        'dirmatriz' : data[0]["direccion_matriz"],
        'tipocontribuyente' : data[0]["tipo_contribuyente"],
        'contribuyente' : data[0]["contribuyente"],
        'leyenda' : data[0]["leyenda"],

        'retencionversion' : data[0]["retencionversion"],

        'firmap12' : data[0]["firmap12"],
        'clavep12' : data[0]["clavep12"],
        'pk12' : data[0]["pk12"],
        'firmapublica' : data[0]["firmapublica"],
        'firmaprivada' : data[0]["firmaprivada"],
        'certificado' : data[0]["certificado"],
        
        /*INFO RETENCIÓN*/
        'fechaemision' : data[0]["fecha_hora"],
        'fechaautorizacion' : data[0]["fechaautorizacion"],
        'direstablecimiento' : data[0]["direccion_establecimiento"],
        'obligadocontabilidad' : data[0]["contabilidad"],
        'cod_identificacion' : data[0]["cod_identificacion"],
        'identificacionproveedor' : data[0]["ruc"],
        'razonsocialproveedor' : data[0]["proveedor"],
        'periodofiscalmes' : data[0]["periodo_fiscal_mes"],
        'periodofiscalap' : data[0]["periodo_fiscal_ap"],
        'direccion' : data[0]["direccion"],
        'celular' : data[0]["celular"],
        'correo' : data[0]["correo"],
        'totalretenido' : data[0]["total_retenido"],
        //'observacion' : data[0]["observacion"],
        'detalles' : detalles
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
    this.retencionservice.crearRide(this.arr_retencion).subscribe( (data : any) =>
    {
        this.loadingmodal = false;
        this.toastr.info("Ride Creado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loadingmodal = false;
    });
  }

  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }
}