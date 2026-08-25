import { Component, OnInit, ViewChild} from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { VentaService } from '../../services/venta.service';
import { GuiaRemisionService } from '../../services/guia-remision.service';
import { TipoIdentificacionService } from '../../services/tipo-identificacion.service';
import { ListadoProductoGeneralComponent } from 'src/app/shared/components/listado-producto/listado-producto-general/listado-producto-general.component';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { ConfigService } from 'src/app/shared/services/config.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ListadoTransportistaComponent } from 'src/app/shared/components/transportista/listado-transportista/listado-transportista.component';
import { PuntoTransportistaService } from '../../services/punto-transportista.service';
import { RutaService } from '../../services/ruta.service';
import { NuevoPuntoTransporteComponent } from 'src/app/shared/components/transportista/nuevo-punto-transporte/nuevo-punto-transporte.component';
import { NuevaRutaComponent } from 'src/app/shared/components/transportista/nueva-ruta/nueva-ruta.component';
import { NuevoVehiculoComponent } from 'src/app/shared/components/transportista/nuevo-vehiculo/nuevo-vehiculo.component';
import { VehiculoService } from '../../services/vehiculo.service';
import { Location } from '@angular/common';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';
import { RucEmpresaService } from 'src/app/usuario/services/ruc-empresa.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { RucEmpresaDTO } from 'src/app/usuario/models/rucempresa.dto';
import { GuiaRemisionDTO } from '../../models/guia-remision.dto';
import { TransportistaDTO } from '../../models/transportista.dto';
import { SriGuiaRemisionService } from 'src/app/shared/services/sri-guia-remision.service';
import { lastValueFrom } from 'rxjs';
import { DetalleVentaGuiaRemisionComponent } from 'src/app/shared/components/detalle-venta-guia-remision/detalle-venta-guia-remision.component';
import { TransportistaFormComponent } from '../transportista/transportista-form/transportista-form.component';

@Component({
  selector: 'app-guia-remision',
  templateUrl: './guia-remision.component.html',
  styleUrls: ['./guia-remision.component.css']
})
export class GuiaRemisionComponent implements OnInit {
  cod_proyecto : string = "";
  multisucursal : string = "0";
  @ViewChild(ListadoProductoGeneralComponent) childlistadoproductogeneral!: ListadoProductoGeneralComponent;
  @ViewChild(DetalleVentaGuiaRemisionComponent) childdetalleventa: DetalleVentaGuiaRemisionComponent;
   @ViewChild(TransportistaFormComponent) childnuevotransportista!: TransportistaFormComponent;
  @ViewChild(ListadoTransportistaComponent) childlistadotransportista: any;
  @ViewChild(NuevoPuntoTransporteComponent) childnuevopuntotransporte: any;
  @ViewChild(NuevaRutaComponent) childnuevaruta: any;
  @ViewChild(NuevoVehiculoComponent) childnuevovehiculo: any;

  datosidentificacion : any;
  datosrucempresa : any;

  banpuntopartida: number = 0;

  disabledbtnactualizar : boolean = true;
  disabledbtnguardar : boolean = true;
  disabledbtnsrienviar : boolean = true;
  disabledbtnimprimir : boolean = true;

  chkimpuesto : boolean = true;
  disabledchkimpuesto : boolean = true;
  disabledtxtcodigobarra : boolean = true;
  disabledbtnlistarproducto : boolean = true;
  disabledtxtobservacion : boolean = true;

  notacreditoexistente : string = "";
  codigo_barra = "";


  datospuntopartida : any;
  datosruta : any;
  datosvehiculo : any;

  flagidentificacion : boolean = false;
  flagnumero_identificacion : boolean = false;
  flagrazon_social : boolean = false;
  flagplaca : boolean = false;
  flagpunto_partida : boolean = false;
  flagfecha_inicio_transporte : boolean = false;
  flagfecha_fin_transporte : boolean = false;
  flagcorreo : boolean = false;
  flagmotivo_translado : boolean = false;
  flagdestino : boolean = false;
  flagidentificacion_destinatario : boolean = false;
  flagrazon_social_destinatario : boolean = false;
  flagdocumento_aduanero : boolean = false;
  flagcodigo_establecimiento_destino : boolean = false;
  flagruta : boolean = false;

  arr_guia_remision : any;

  disabledtxtfecha : boolean = true;

  colormensaje : string = "";
  textomensaje : string = "";

  loading : boolean = false;
  loadingalmacenar : boolean = false;

  tipo_formulario: string = "";

  cod_sucursal_estable: string = "";
  sucursal_estable: string = "";
  firmasruc: string = "";

  guiaremision: GuiaRemisionDTO = new GuiaRemisionDTO;
  transportista: TransportistaDTO = new TransportistaDTO;
  rucempresa: RucEmpresaDTO = new RucEmpresaDTO;

  constructor(private router : Router, private rutaActiva: ActivatedRoute, private guiaremisionservice : GuiaRemisionService, private toastr : ToastrService, private error : ErrorService, private rucempresaservice : RucEmpresaService, private ventaservice : VentaService, private tipoidentificacionservice : TipoIdentificacionService, private puntotransporteservice: PuntoTransportistaService, private rutaservice: RutaService, private vehiculoservice: VehiculoService, private location: Location, private bodyStyleService: BodyStyleService, private usersession: UserSessionService, private sriguiaremision: SriGuiaRemisionService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.tipo_formulario = this.rutaActiva.snapshot.paramMap.get("tipo_formulario")!;

    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.datosrucempresa = [];
    this.rucempresa.cod_ruc = this.usersession.getConfiguracion("cod_ruc");

    this.cod_sucursal_estable = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursal_estable = this.usersession.getConfiguracion("sucursal");
    this.firmasruc = this.usersession.getConfiguracion("firmasruc");

    if(this.tipo_formulario == "nuevoregistro")
    {
      this.listarRucEmpresas();
    }
    else
    {
      if(this.tipo_formulario == "actualizarregistro")
      {
        this.formularioNormal();
      }
    }
    this.bodyStyleService.resetBodyStyles();
  }

  changeFecha() {
    if(this.tipo_formulario == "actualizarregistro")
    {
      this.originarClaveAcceso();
    }
  }

  originarClaveAcceso()
  {    
    this.loading = true;
    this.guiaremisionservice.claveAccesoActualizar(this.guiaremision.n_guia_remision, this.padLeft(this.rucempresa.serieestab, 3), this.padLeft(this.rucempresa.ptoemi, 3), this.guiaremision.fecha_hora, this.rucempresa.ruc, this.rucempresa.tipoambiente).subscribe( (data : any) =>
    {
      this.loading = false;
      this.guiaremision.claveacceso = data.claveacceso;
    }, err => {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  changeIdentificacion(event: any): void {
    const elemento = event.target.value;
    this.transportista.cod_identificacion  = elemento;
  }

  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/
  /*
  changeChkImpuesto()
  {
    if(this.chkimpuesto==true){
      this.chkimpuesto = false;
      this.childlistadoproductogeneral.chkimpuesto = false;
    }else{
      this.chkimpuesto = true;
      this.childlistadoproductogeneral.chkimpuesto = true;
    }
  }
  */
 
  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/

  buscarRucEmpresa()
  {
    const resultado = this.datosrucempresa.find( (valor : any) => valor.cod_ruc == this.rucempresa.cod_ruc );
    this.rucempresa.empresa = resultado.empresa;
    this.rucempresa.serieestab = resultado.serieestab;
    this.rucempresa.ptoemi = resultado.ptoemi;
    this.rucempresa.ruc = resultado.ruc_sucursal;
    this.rucempresa.tipoambiente = resultado.tipo_ambiente;
    this.rucempresa.razon_social = resultado.razonsocial;
    this.rucempresa.nombre_comercial = resultado.nombrecomercial;
    this.rucempresa.contabilidad = resultado.contabilidad;
    this.rucempresa.direccion_matriz = resultado.direccion_matriz;
    this.rucempresa.direccion_establecimiento = resultado.direccion_establecimiento;
    this.rucempresa.tipo_contribuyente = resultado.tipo_contribuyente;
    this.rucempresa.contribuyente = resultado.contribuyente;
    this.rucempresa.leyenda = resultado.leyenda;
    this.rucempresa.firmap12 = resultado.firmap12;
    this.rucempresa.clavep12 = resultado.clavep12;
    this.rucempresa.pk12 = resultado.pk12;
    this.rucempresa.firmapublica = resultado.firmapublica;
    this.rucempresa.firmaprivada = resultado.firmaprivada;
    this.rucempresa.certificado = resultado.certificado;
    this.rucempresa.facturaversion = resultado.facturaversion;
  }

  clickVerificarDetalles()
  {
    let valor : Boolean = this.verificarCampos();
    if(valor)
    {
      this.toastr.warning("Algunos campos no estan llenos, son obligatorios", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      if(this.guiaremision.codigo_establecimiento_destino.length==3)
      {
        this.verificaDetalles();
      }
      else
      {
        this.flagcodigo_establecimiento_destino=true;
        this.toastr.warning("El código de establecimiento debe Tener 3 dígitos", "INFORMACIÓN DEL SISTEMA");
      }
    }
  }

  verificaDetalles()
  {
    let fila_error = false;
    for (let c = 0; c< this.childdetalleventa.datosdetalles.length; c++)
    {
      if(this.childdetalleventa.datosdetalles[c].fila_error == true)
      {
        fila_error = true;
        break;
      }
    }
    
    if(fila_error)
    {
      this.toastr.warning("Hay una o más filas pendientes de cualcular, no debe estar la fila de color rojo", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      if(this.tipo_formulario == "nuevoregistro")
      {
        Swal.fire({
          title: 'Guardar Registro de Guía de Remisión',
          text: '¿Estás seguro de almacenar registro?',
          icon: 'info',//'warning'
          showCancelButton: true,
          confirmButtonText: 'Si, Almacenar',
          cancelButtonText: 'No, Cerrar'
        }).then((result) => {
          if (result.value) {
            this.guardar();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            
          }
        });
      }
      else
      {
        if(this.tipo_formulario == "actualizarregistro")
        {
          Swal.fire({
            title: 'Actualizar Registro de Guía de Remisión',
            text: '¿Estás seguro de actualizar registro?',
            icon: 'info',//'warning'
            showCancelButton: true,
            confirmButtonText: 'Si, Actualizar',
            cancelButtonText: 'No, Cerrar'
          }).then((result) => {
            if (result.value) {
              this.actualizar();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              
            }
          });
        }
      }
    }
  }

  async guardar()
  {
    let detalles = [];
    
      this.childdetalleventa.datosdetalles.forEach(item => {
        let detalle = {
          'cod_producto' : item.cod_producto,
          'cantidad_comprar' : item.cantidad_comprar,
          'cantidad_tarifa' : item.cantidad_tarifa,
          'cantidad_unidad' : item.cantidad_unidad,
          'tarifa' : item.tarifa,
          'cod_tarifa' : item.cod_tarifa,
          'detalle' : item.descripcion,
        };
        detalles.push(detalle);
      });

      let guia_remision = {
        'cod_guia_remision' : this.guiaremision.cod_guia_remision,
        'numero_guia' : "",
        'serieestab' : this.rucempresa.serieestab,
        'ptoemi' : this.rucempresa.ptoemi,
    
        'ruc' : this.rucempresa.ruc,
        'tipoambiente' : this.rucempresa.tipoambiente,
    
        'fecha_hora' : this.guiaremision.fecha_hora,
        'cod_transportista' : this.transportista.cod_transportista,
        'cod_identificacion_transportista' : this.transportista.cod_identificacion,
        'razon_social_transportista' :  this.transportista.razon_social_transportista,
        'identificacion_transportista' : this.transportista.numero_identificacion,
        'correo' : this.transportista.correo,
        'placa' : this.guiaremision.placa,
        'punto_partida' : this.guiaremision.punto_partida,
        'fecha_inicio_transporte' : this.guiaremision.fecha_inicio_transporte,
        'fecha_fin_transporte' : this.guiaremision.fecha_fin_transporte,
        'comprobante' : this.guiaremision.comprobante,//FACTURA
        'numero_factura' : this.guiaremision.numero_factura,
        'fecha_emision_factura' : this.guiaremision.fecha_registro,
        'n_autorizacion_factura' : this.guiaremision.numero_autorizacion_factura,
        'motivo_traslado' : this.guiaremision.motivo_translado,
        'destino' : this.guiaremision.destino,
        'identificacion_destinatario' : this.guiaremision.identificacion_destinatario,
        'razon_social_destinatario' : this.guiaremision.razon_social_destinatario,
        'documento_aduanero' : this.guiaremision.documento_aduanero,
        'codigo_establecimiento_destino' : this.guiaremision.codigo_establecimiento_destino,
        'ruta' : this.guiaremision.ruta,
        'observacion' : this.guiaremision.observacion,
        'cod_sucursal' : this.cod_sucursal_estable,
        'cod_factura_venta' : this.guiaremision.cod_factura_venta,
        'cod_usuario' : this.guiaremision.cod_usuario,		
        'detalles' : detalles,
        'cod_ruc' : this.rucempresa.cod_ruc
      };

      
      this.loadingalmacenar = true;
      
      try
      {
        const data: any = await lastValueFrom(this.guiaremisionservice.guardar(guia_remision));

          this.loadingalmacenar = false;
          

          if (data.estado == true)
          {
            this.guiaremision.n_guia_remision = data.n_guia_remision;
            this.guiaremision.claveacceso = data.claveacceso;
            this.rucempresa.serieestab = data.serieestab;//Se asigna con 001
            this.rucempresa.ptoemi = data.ptoemi;//Se asigna con 001

            this.guiaremision.fecha_hora = moment(data.fecha_hora).format('YYYY-MM-DD');//data.fecha_hora

            this.disabledbtnguardar = true;
            this.disabledbtnimprimir = false;
            
            this.colormensaje = "#00FF00";
            this.textomensaje = "CREADA";

            this.toastr.success("Nota de Crédito registrada correctamente", "INFORMACIÓN DEL SISTEMA");
            this.deshabilitarFormulario();
            this.childdetalleventa.disabledtabladetalles = true;
            //this.childdetalleventa.deshabilitarFormulario();
            await this.iniciarProcesoFacturacion();
          }
          else
          {
            this.toastr.error("Nota de Crédito no se pudo registrar, error inesperado", "INFORMACIÓN DEL SISTEMA");
          }
      }
      catch (err) {
        this.loadingalmacenar = false;
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      }
  }

  async actualizar()
  {
    let detalles = [];
    
      this.childdetalleventa.datosdetalles.forEach(item => {
        let detalle = {
          'cod_producto' : item.cod_producto,
          'cantidad_comprar' : item.cantidad_comprar,
          'cantidad_tarifa' : item.cantidad_tarifa,
          'cantidad_unidad' : item.cantidad_unidad,
          'tarifa' : item.tarifa,
          'cod_tarifa' : item.cod_tarifa,
          'detalle' : item.descripcion,
        };
        detalles.push(detalle);
      });

      let guia_remision = {
        'cod_guia_remision' : this.guiaremision.cod_guia_remision,
        'numero_guia' : this.guiaremision.n_guia_remision,
        'claveacceso' : this.guiaremision.claveacceso,
        'serieestab' : this.rucempresa.serieestab,
        'ptoemi' : this.rucempresa.ptoemi,
    
        'ruc' : this.rucempresa.ruc,
        'tipoambiente' : this.rucempresa.tipoambiente,
    
        'fecha_hora' : this.guiaremision.fecha_hora,
        'cod_transportista' : this.transportista.cod_transportista,
        'cod_identificacion_transportista' : this.transportista.cod_identificacion,
        'razon_social_transportista' :  this.transportista.razon_social_transportista,
        'identificacion_transportista' : this.transportista.numero_identificacion,
        'correo' : this.transportista.correo,
        'placa' : this.guiaremision.placa,
        'punto_partida' : this.guiaremision.punto_partida,
        'fecha_inicio_transporte' : this.guiaremision.fecha_inicio_transporte,
        'fecha_fin_transporte' : this.guiaremision.fecha_fin_transporte,
        'comprobante' : this.guiaremision.comprobante,//FACTURA
        'numero_factura' : this.guiaremision.numero_factura,
        'fecha_emision_factura' : this.guiaremision.fecha_registro,
        'n_autorizacion_factura' : this.guiaremision.numero_autorizacion_factura,
        'motivo_traslado' : this.guiaremision.motivo_translado,
        'destino' : this.guiaremision.destino,
        'identificacion_destinatario' : this.guiaremision.identificacion_destinatario,
        'razon_social_destinatario' : this.guiaremision.razon_social_destinatario,
        'documento_aduanero' : this.guiaremision.documento_aduanero,
        'codigo_establecimiento_destino' : this.guiaremision.codigo_establecimiento_destino,
        'ruta' : this.guiaremision.ruta,
        'observacion' : this.guiaremision.observacion,
        'cod_sucursal' : this.guiaremision.cod_sucursal,
        'cod_factura_venta' : this.guiaremision.cod_factura_venta,
        'cod_usuario' : "",//El backend lo ubica
        'detalles' : detalles,
        'cod_ruc' : this.rucempresa.cod_ruc
      };

      
      this.loading = true;
      
      try
      {
        const data: any = await lastValueFrom(this.guiaremisionservice.actualizar(guia_remision));

          this.loading = false;
          

          if (data.estado == true)
          {
            this.guiaremision.n_guia_remision = data.n_guia_remision;
            this.guiaremision.claveacceso = data.claveacceso;
            this.rucempresa.serieestab = data.serieestab;//Se asigna con 001
            this.rucempresa.ptoemi = data.ptoemi;//Se asigna con 001

            this.guiaremision.fecha_hora = moment(data.fecha_hora).format('YYYY-MM-DD');//data.fecha_hora
            
            this.colormensaje = "#00FF00";
            this.textomensaje = "CREADA";

            this.toastr.success("Nota de Crédito registrada correctamente", "INFORMACIÓN DEL SISTEMA");
            this.deshabilitarFormulario();
            this.disabledbtnactualizar = true;
            this.disabledbtnimprimir = false;

            await this.iniciarProcesoFacturacion();


          }
          else
          {
            this.toastr.error("Nota de Crédito no se pudo registrar, error inesperado", "INFORMACIÓN DEL SISTEMA");
          }
      }
      catch (err) {
        this.loadingalmacenar = false;
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      }
  }

  visualizar()
  {	 
    let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/guiaremision?codguiaremision=" + this.guiaremision.cod_guia_remision, "", 'width=600,height=400,left=300,top=100');
     miVentana.focus();
  }

  verificarRegistro()
  {
    this.loading = true;
    

    this.guiaremisionservice.verificarRegistro().subscribe( (data : any) =>
    {
      
      if(data == null)
      {
        this.toastr.error("Error al generar codigo de acceso, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.guiaremision.cod_guia_remision = moment().unix().toString() + data.codigo;
        this.guiaremision.n_guia_remision = data.n_comprobante;
        this.guiaremision.claveacceso = data.claveacceso;
        this.guiaremision.fecha_hora = moment(data.fecha).format('YYYY-MM-DD');
      }

      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  formularioNormal()
  {
    this.notacreditoexistente = "";

    this.guiaremision.cod_guia_remision = "";
    this.guiaremision.n_guia_remision = "";
    this.guiaremision.claveacceso = "0";
    this.guiaremision.fecha_hora = moment().format('YYYY-MM-DD');
    this.guiaremision.observacion = "";

    this.colormensaje = "";
    this.textomensaje = "";

    this.loading = false;

    this.flagNormal();

    //this.datospuntopartida = [];
    //this.datosruta = [];
    //this.datosvehiculo  = [];
    this.listarPuntoPartida();
    this.listarRutas();
    this.listarVehiculos();

    this.arr_guia_remision = {};

    this.transportista.cod_identificacion = "0";
    this.transportista.identificacion = "";
    this.transportista.cod_transportista = "1";
    this.transportista.numero_identificacion = "";
    this.transportista.razon_social_transportista = "";
    this.transportista.celular = "";
    this.transportista.telefono = "";
    this.transportista.correo = "";
    this.transportista.direccion = "";

    if(this.tipo_formulario == "nuevoregistro")
    {
      this.buscarRucEmpresa();
      this.guiaremision.cod_factura_venta = this.rutaActiva.snapshot.paramMap.get("cod_factura_venta")!;
    }
    else
    {
      if(this.tipo_formulario == "actualizarregistro")
      {
        this.guiaremision.cod_guia_remision = this.rutaActiva.snapshot.paramMap.get("cod_guia_remision")!;
      }
    }
    this.listarIdentificacion();
  }

  listarIdentificacion()
  {
    this.loading = true;
    

    this.tipoidentificacionservice.listar().subscribe( (data : any) =>
    {
      this.datosidentificacion = data;
      this.loading = false;
      if(this.tipo_formulario == "nuevoregistro")
        {
          this.buscarFacturaVenta();
        }
        else
        {
          if(this.tipo_formulario == "actualizarregistro")
          {
            this.buscarFacturaGuiaRemision();
          }
        }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
    
  }

  buscarFacturaGuiaRemision()
  {
    this.loading = true;
    

    this.guiaremisionservice.buscarFacturaGuiaRemision(this.guiaremision.cod_guia_remision).subscribe( (data : any) =>
    {
        this.guiaremision.cod_guia_remision = data[0].cod_guia_remision;
        this.guiaremision.n_guia_remision = this.padLeft(data[0].numero_guia, 9);
        this.guiaremision.claveacceso = data[0].claveacceso;
        this.rucempresa.serieestab = data[0].serieestab;
        this.rucempresa.ptoemi = data[0].ptoemi;
        this.rucempresa.ruc = data[0].ruc_sucursal;
        this.rucempresa.tipoambiente = data[0].tipo_ambiente;

        this.rucempresa.cod_ruc = data[0].cod_ruc;
        this.rucempresa.empresa = data[0].empresa;

        this.rucempresa.razon_social = data[0].razonsocial;
        this.rucempresa.nombre_comercial = data[0].nombrecomercial;
        this.rucempresa.direccion_matriz = data[0].direccion_matriz;
        this.rucempresa.direccion_establecimiento = data[0].direccion_establecimiento;
        this.rucempresa.tipo_contribuyente = data[0].tipo_contribuyente;
        this.rucempresa.contribuyente = data[0].contribuyente;
        this.rucempresa.contabilidad = data[0].contabilidad;
        this.rucempresa.leyenda = data[0].leyenda;

        this.guiaremision.cod_sucursal = data[0].cod_sucursal;

        this.rucempresa.facturaversion = data[0].facturaversion;

        this.rucempresa.firmap12 = data[0].firmap12;
        this.rucempresa.clavep12 = data[0].clavep12;
        this.rucempresa.pk12 = data[0].pk12;
        this.rucempresa.firmapublica = data[0].firmapublica;
        this.rucempresa.firmaprivada = data[0].firmaprivada;
        this.rucempresa.certificado = data[0].certificado;
    
        this.guiaremision.fecha_hora = moment(data[0]["fecha_hora"]).format('YYYY-MM-DD');
        this.transportista.cod_identificacion = data[0].cod_identificacion_transportista;
        this.transportista.identificacion = data[0].identificacion;
        this.transportista.cod_transportista = data[0].cod_transportista;
        this.transportista.razon_social_transportista = data[0].razon_social_transportista;
        this.transportista.numero_identificacion = data[0].identificacion_transportista;
        this.transportista.correo = data[0].correo;
        this.guiaremision.placa = data[0].placa;
        this.guiaremision.punto_partida = data[0].punto_partida;
        this.guiaremision.fecha_inicio_transporte = data[0].fecha_inicio_transporte;
        this.guiaremision.fecha_fin_transporte = data[0].fecha_fin_transporte;
        this.guiaremision.comprobante = data[0].comprobante;//FACTURA
        this.guiaremision.numero_factura = data[0].numero_factura;
        this.guiaremision.fecha_registro = data[0].fecha_emision_factura;
        this.guiaremision.numero_autorizacion_factura = data[0].n_autorizacion_factura;
        this.guiaremision.motivo_translado = data[0].motivo_traslado;
        this.guiaremision.destino = data[0].destino;
        this.guiaremision.identificacion_destinatario = data[0].identificacion_destinatario;
        this.guiaremision.razon_social_destinatario = data[0].razon_social_destinatario;
        this.guiaremision.documento_aduanero = data[0].documento_aduanero;
        this.guiaremision.codigo_establecimiento_destino = data[0].codigo_establecimiento_destino
        this.guiaremision.ruta = data[0].ruta;
        this.guiaremision.observacion = data[0].observacion_guia_remision;
        this.childdetalleventa.observacion = data[0].observacion_factura_venta;
        this.guiaremision.cod_factura_venta = data[0].cod_factura_venta;


        this.childdetalleventa.datosdetalles = [];

        data.forEach(element => {
          let descripcion = element.detalle;
          let detalle = {
            fila_error : false,//Para marcar la fila editada con rojo
            cod_producto : element.cod_producto,
            inventario : element.inventario,
    
            cod_tarifa : element.cod_tarifa,
            cantidad_tarifa : element.cantidad_tarifa,
    
            porcentaje_ice : parseFloat(element.ice),
            porcentaje_iva : parseFloat(element.iva),
            
            precio_base_minimo : parseFloat(element.precio_base_minimo),
            precio_venta_minimo : parseFloat(element.precio_venta_minimo),
    
            incremento : 0,//Incremento de porcentaje
    
            cantidad_comprar : element.cantidad_comprar,
            tarifa : element.tarifa,
            descripcion : descripcion,
            cantidad_unidad : element.cantidad_unidad,
    
            precio_base : parseFloat(element.precio),
    
            checked : element.chkporcentaje,
            descuento : element.valorporcentaje,
            descuento_calculado : parseFloat(element.descuento),//Calculado
    
            total : redondeardecimales(element.total, 6),
            iva : redondeardecimales(element.total_iva, 2),
            ice : redondeardecimales(element.total_ice, 2),

            codigo_iva : element.codigo_iva,
    
            total_final : redondeardecimales(element.total_final, 2),
            unidades_denominacion : element.unidades_denominacion
            //cantidad_paquete : 1,
            //cantidad_ajuste : 0, 
          }
          this.childdetalleventa.datosdetalles.push(detalle);
        });
        
        this.childdetalleventa.subtotal12 = redondeardecimales(data[0].subtotalconimpuesto, 2);
        this.childdetalleventa.subtotal0 = redondeardecimales(data[0].subtotalsinimpuesto, 2);
        this.childdetalleventa.totalsinimpuestos = redondeardecimales(data[0].totalsinimpuestos, 2);
        this.childdetalleventa.totaldescuento = redondeardecimales(data[0].total_descuento, 2);
        this.childdetalleventa.totalconice = redondeardecimales(data[0].total_ice_general, 2);
        this.childdetalleventa.totalconimpuestos = redondeardecimales(data[0].total_iva_general, 2);
        this.childdetalleventa.importetotal = redondeardecimales(data[0].importetotal, 2);
  



        this.loading = false;
        

        this.habilitarFormulario();
        this.childdetalleventa.habilitarFormulario();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  verificarCampos()
  {
    let valor : Boolean = false;

    this.flagNormal();

    if(this.transportista.cod_identificacion=="0")
    {
      this.flagidentificacion=true;
      valor=true;
    }

    if(this.transportista.numero_identificacion.length==0)
    {
      this.flagnumero_identificacion=true;
      valor=true;
    }

    if(this.transportista.razon_social_transportista.length==0)
    {
      this.flagrazon_social=true;
      valor=true;
    }

    if(this.guiaremision.placa.length==0)
    {
      this.flagplaca=true;
      valor=true;
    }

    if(this.guiaremision.punto_partida.length==0)
    {
      this.flagpunto_partida=true;
      valor=true;
    }

    if(this.guiaremision.fecha_inicio_transporte.length==0)
    {
      this.flagfecha_inicio_transporte=true;
      valor=true;
    }

    if(this.guiaremision.fecha_fin_transporte.length==0)
    {
      this.flagfecha_fin_transporte=true;
      valor=true;
    }
    
    if(this.transportista.correo.length==0)
    {
      this.flagcorreo=true;
      valor=true;
    }

    if(this.guiaremision.motivo_translado.length==0)
    {
      this.flagmotivo_translado=true;
      valor=true;
    }

    if(this.guiaremision.destino.length==0)
    {
      this.flagdestino=true;
      valor=true;
    }

    if(this.guiaremision.identificacion_destinatario.length==0)
    {
      this.flagidentificacion_destinatario=true;
      valor=true;
    }

    if(this.guiaremision.razon_social_destinatario.length==0)
    {
      this.flagrazon_social_destinatario=true;
      valor=true;
    }

    if(this.guiaremision.documento_aduanero.length==0)
    {
      this.flagdocumento_aduanero=true;
      valor=true;
    }

    if(this.guiaremision.codigo_establecimiento_destino.length==0)
    {
      this.flagcodigo_establecimiento_destino=true;
      valor=true;
    }

    if(this.guiaremision.ruta.length==0)
    {
      this.flagruta=true;
      valor=true;
    }
  


    return valor;
  }

  flagNormal()
  {
    this.flagidentificacion=false;
    this.flagnumero_identificacion=false;
    this.flagrazon_social=false;
    this.flagplaca=false;
    this.flagpunto_partida=false;
    this.flagfecha_inicio_transporte=false;
    this.flagfecha_fin_transporte=false;
    this.flagcorreo=false;
    this.flagdestino=false;
    this.flagidentificacion_destinatario=false;
    this.flagrazon_social_destinatario=false;
    this.flagdocumento_aduanero=false;
    this.flagcodigo_establecimiento_destino=false;
    this.flagruta=false;
  }

  habilitarFormulario()
  {
    this.disabledbtnguardar = false;
    this.disabledbtnactualizar = false;
    this.disabledtxtfecha = false;
    this.chkimpuesto = false;
    this.disabledchkimpuesto = false;
    this.disabledtxtcodigobarra = false;
    this.disabledbtnlistarproducto = false;
    this.disabledtxtobservacion = false;
  }

  deshabilitarFormulario()
  {
    this.disabledbtnguardar = true;
    this.disabledbtnactualizar = false;
    this.disabledtxtfecha = true;
    this.chkimpuesto = true;
    this.disabledchkimpuesto = true;
    this.disabledtxtcodigobarra = true;
    this.disabledbtnlistarproducto = true;
    this.disabledtxtobservacion = true;
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }
  
  listarRucEmpresas()
  {    
    this.loading = true;
    

    this.rucempresaservice.listarRucEmpresas(this.cod_sucursal_estable).subscribe( (data : any) =>
    {
      this.loading = false;
      this.datosrucempresa = data;
      this.formularioNormal();
      this.childlistadotransportista.listarTransportistas();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  buscarFacturaVenta()
  {
    this.loading = true;
    

    this.ventaservice.buscarFactura(this.guiaremision.cod_factura_venta).subscribe( (data : any) =>
    {
      this.rucempresa.cod_ruc = data[0].cod_ruc;
      this.buscarRucEmpresa();

      this.guiaremision.numero_factura = this.padLeft(data[0].serieestab, 3) + "-" + this.padLeft(data[0].ptoemi, 3) + "-" + this.padLeft(data[0].numero_factura, 9);
  
      this.guiaremision.razon_social_destinatario = data[0].cliente;
      this.guiaremision.identificacion_destinatario = data[0].cedula;
      this.guiaremision.fecha_registro = data[0].fecha_hora;
      this.guiaremision.numero_autorizacion_factura = data[0].claveacceso;
      this.guiaremision.cod_sucursal = data[0].cod_sucursal;
      
      //this.childlistadoproductogeneral.listarProductosVentasPorSucursal(this.guiaremision.cod_sucursal_estable);
      this.childdetalleventa.datosdetalles = [];
      this.childdetalleventa.observacion = data[0].observacion;
      data.forEach(element => {
        let descripcion = element.detalle;
        let detalle = {
          fila_error : false,//Para marcar la fila editada con rojo
          cod_producto : element.cod_producto,
          inventario : element.inventario,
  
          cod_tarifa : element.cod_tarifa,
          cantidad_tarifa : element.cantidad_tarifa,
  
          porcentaje_ice : element.ice,
          porcentaje_iva : element.iva,
          
          precio_base_minimo : element.precio_base_minimo,
          precio_venta_minimo : element.precio_venta_minimo,
  
          incremento : 0,//Incremento de porcentaje
  
          cantidad_comprar : element.cantidad_comprar,
          tarifa : element.tarifa,
          descripcion : descripcion,
          cantidad_unidad : element.cantidad_unidad,
  
          precio_base : element.precio,
          precio_venta : element.precio_venta,
  
          checked : false,//Ckeked de descuento por porcentaje
          
          descuento : 0,//Editable
          descuento_calculado : element.descuento,//Calculado
  
          total : redondeardecimales(element.total, 6),
          iva : redondeardecimales(element.total_iva, 2),
          ice : redondeardecimales(element.total_ice, 2),

          codigo_iva : element.codigo_iva,
  
          total_final : redondeardecimales(element.total_final, 2),
          unidades_denominacion : element.unidades_denominacion
          //cantidad_paquete : 1,
          //cantidad_ajuste : 0, 
        }
        this.childdetalleventa.datosdetalles.push(detalle);
      });
      
      this.childdetalleventa.subtotal12 = redondeardecimales(data[0].subtotalconimpuesto, 2);
      this.childdetalleventa.subtotal0 = redondeardecimales(data[0].subtotalsinimpuesto, 2);
      this.childdetalleventa.totalsinimpuestos = redondeardecimales(data[0].totalsinimpuestos, 2);
      this.childdetalleventa.totaldescuento = redondeardecimales(data[0].total_descuento, 2);
      this.childdetalleventa.totalconice = redondeardecimales(data[0].total_ice_general, 2);
      this.childdetalleventa.totalconimpuestos = redondeardecimales(data[0].total_iva_general, 2);
      this.childdetalleventa.importetotal = redondeardecimales(data[0].importetotal, 2);

      this.loading = false;
      

      this.buscarGuiaRemisionPorFactura();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }

  buscarGuiaRemisionPorFactura()
  {
    this.loading = true;
    

    this.guiaremisionservice.buscarGuiaRemisionPorFactura(this.guiaremision.cod_factura_venta).subscribe( (data : any) =>
    {
      this.loading = false;
      

      if (data.cod_guia_remision == false)
      {
        this.notacreditoexistente = "0";
        this.verificarRegistro();
        this.habilitarFormulario();
        this.childdetalleventa.habilitarFormulario();
      }
      else
      {
        this.notacreditoexistente = "1";
        this.deshabilitarFormulario();
        this.childdetalleventa.disabledtabladetalles = true;
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  clickNuevo() {
    this.notacreditoexistente = "0";
    this.verificarRegistro();
    this.habilitarFormulario();
    this.childdetalleventa.habilitarFormulario();
  }

  clickNuevoTransportista()
  {
    this.childnuevotransportista.nombreformulario="AGREGAR";
    this.childnuevotransportista.formularioNormal();
    $("#mymodalformtransportista").modal("show");
  }

  clickListadoTransportista()
  {
    this.childlistadotransportista.page = 1;
    this.childlistadotransportista.filterpost="";
    $("#mymodallistartransportistas").modal("show");
  }

  actualizarListadoTransportista()
  {
    this.childlistadotransportista.page = 1;
    this.childlistadotransportista.filterpost="";
    this.childlistadotransportista.listarTransportistas();
    this.toastr.success("Listado de clientes actualizado exitosamente", "INFORMACIÓN DEL SISTEMA");
  }

  recibirDatosTransportista(datosrecibidostransportista: any)
  {
    this.transportista.cod_identificacion = datosrecibidostransportista.cod_identificacion;
    this.transportista.identificacion = datosrecibidostransportista.identificacion;
    this.transportista.cod_transportista = datosrecibidostransportista.cod_transportista;
    this.transportista.razon_social_transportista = datosrecibidostransportista.apellido + " " + datosrecibidostransportista.nombre;
    this.transportista.numero_identificacion = datosrecibidostransportista.cedula;
    this.transportista.celular = datosrecibidostransportista.celular;
    this.transportista.telefono = datosrecibidostransportista.telefono;
    this.transportista.correo = datosrecibidostransportista.correo;
    this.transportista.direccion = datosrecibidostransportista.direccion;

    $("#mymodallistartransportistas").modal("hide");
  }

  recibirDatosNuevoTransportista(datosrecibidostransportista: any)
  {
    this.transportista.cod_identificacion = datosrecibidostransportista.cod_identificacion;
    this.transportista.identificacion = datosrecibidostransportista.identificacion;
    this.transportista.cod_transportista = datosrecibidostransportista.cod_transportista;
    this.transportista.razon_social_transportista = datosrecibidostransportista.apellido + " " + datosrecibidostransportista.nombre;
    this.transportista.numero_identificacion = datosrecibidostransportista.cedula;
    this.transportista.celular = datosrecibidostransportista.celular;
    this.transportista.telefono = datosrecibidostransportista.telefono;
    this.transportista.correo = datosrecibidostransportista.correo;
    this.transportista.direccion = datosrecibidostransportista.direccion;

    $("#mymodalformtransportista").modal("hide");
  }

  listarPuntoPartida()
  {    
    this.loading = true;
    this.puntotransporteservice.listarPuntoTransportes().subscribe( (data : any) =>
    {
      this.datospuntopartida = data;
      this.loading = false;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
    });
  }

  listarRutas()
  {    
    this.loading = true;
    this.rutaservice.listarRutas().subscribe( (data : any) =>
    {
      this.datosruta = data;
      this.loading = false;  
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
    });
  }

  listarVehiculos()
  {    
    this.loading = true;
    this.vehiculoservice.listarVehiculos().subscribe( (data : any) =>
    {
      this.datosvehiculo = data;
      this.loading = false;  
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
    });
  }

  clickPuntoPartida() {
    this.banpuntopartida = 0;
    this.childnuevopuntotransporte.formularioNormal();
    $("#mymodalPuntoTransporte").modal("show");
  }

  recibirDatosPuntoTransporte(datosrecibidospuntotransporte: any)
  {
    this.datospuntopartida.push(datosrecibidospuntotransporte);
    if(this.banpuntopartida == 0) {
      this.guiaremision.punto_partida = datosrecibidospuntotransporte.punto_transporte;
    } else {
      this.guiaremision.destino = datosrecibidospuntotransporte.punto_transporte;
    }
  }

  clickPuntoRuta() {
    this.childnuevaruta.formularioNormal();
    $("#mymodalRuta").modal("show");
  }

  recibirDatosRuta(datosrecibidosruta: any)
  {
    this.datosruta.push(datosrecibidosruta);
    this.guiaremision.ruta = datosrecibidosruta.ruta;
  }

  clickPuntoDestino() {
    this.banpuntopartida = 1;
    this.childnuevopuntotransporte.formularioNormal();
    $("#mymodalPuntoTransporte").modal("show");
  }

  clickPlaca() {
    this.childnuevovehiculo.formularioNormal();
    $("#mymodalVehiculo").modal("show");
  }

  recibirDatosVehiculo(datosrecibidosvehiculo: any)
  {
    this.datosruta.push(datosrecibidosvehiculo);
    this.guiaremision.placa = datosrecibidosvehiculo.placa;
  }

  goBack(){
    this.location.back();
  }

  async iniciarProcesoFacturacion()
    {
        this.iniciarLoading();
        try
        {
          this.disabledbtnsrienviar = false;
          let arrguiaremision = await this.sriguiaremision.crearFirmarXml2(this.cod_proyecto, this.transportista, this.rucempresa, this.guiaremision, this.childdetalleventa.datosdetalles);

          const resultado = await this.sriguiaremision.enviarSri(this.cod_proyecto, this.guiaremision);
          if (resultado.estado == "RECIBIDA")
          {
            const resultadocomprobacionsri = await this.sriguiaremision.comprobarSri(this.cod_proyecto, this.guiaremision);
            const data = resultadocomprobacionsri.data;
            if(resultadocomprobacionsri.estado)
            {
              if(data.estadomensaje=="AUTORIZADO")
              {
                this.toastr.success("Comprobante Autorizado", "INFORMACIÓN DEL SISTEMA");
                const resultadoestado = await this.sriguiaremision.actualizarEstado(this.guiaremision.cod_guia_remision, this.guiaremision.claveacceso, "", "", "AUTORIZADO", data.fechaautorizacion);
                await this.informacionActualizarEstado(resultadoestado, "AUTORIZADO");
                arrguiaremision.fechaautorizacion = data.fechaautorizacion;
                const resultadoride = await this.sriguiaremision.crearRide(arrguiaremision, this.transportista);
                if(resultadoride)
                {
                  const resultadoenviocorreo = await this.sriguiaremision.enviarCorreo(this.cod_proyecto, this.guiaremision, this.transportista, this.rucempresa);
                  if(resultadoenviocorreo)
                  {
                    this.toastr.success("Correo enviado satisfactoriamente al cliente", "INFORMACIÓN DEL SISTEMA");
                    await this.sriguiaremision.actualizarEstadoCorreo(this.guiaremision.cod_guia_remision);
                  }
                }
              }
  
              if(data.estadomensaje=="EN PROCESO")
              {
                this.toastr.success("Comprobante en Proceso " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
                const resultadoestado = await this.sriguiaremision.actualizarEstado(this.guiaremision.cod_guia_remision, "0", data.mensaje, data.informacionadicional, "EN PROCESO", data.fechaautorizacion);
                await this.informacionActualizarEstado(resultadoestado, "EN PROCESO");
              }
  
              if(data.estadomensaje=="NO AUTORIZADO")
              {
                this.toastr.error("Comprobante No Autorizado: " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
                const resultadoestado = await this.sriguiaremision.actualizarEstado(this.guiaremision.cod_guia_remision, "0", data.mensaje, data.informacionadicional, "NO AUTORIZADO", data.fechaautorizacion);
                await this.informacionActualizarEstado(resultadoestado, "NO AUTORIZADO");
              }
            }
            else
            {
              if(data.identificador=="0")
              {
                this.toastr.warning("Comprobante en Proceso", "INFORMACIÓN DEL SISTEMA");
                const resultadoestado = await this.sriguiaremision.actualizarEstado(this.guiaremision.cod_guia_remision, "0", resultado.data.mensaje, resultado.data.informacionadicional, "EN PROCESO", resultado.data.fechaautorizacion);
                await this.informacionActualizarEstado(resultadoestado, "EN PROCESO");
              }
            }
          }
          else
          {
            if(resultado.estado=="EN PROCESO")//En procesamiento debe esperar 24 Horas
            {
              this.toastr.warning("Comprobante en Proceso " + resultado.data.mensaje, "INFORMACIÓN DEL SISTEMA");
              const resultadoestado = await this.sriguiaremision.actualizarEstado(this.guiaremision.cod_guia_remision, "0", resultado.data.mensaje, resultado.data.informacionadicional, "EN PROCESO", resultado.data.fechaautorizacion);
              await this.informacionActualizarEstado(resultadoestado, "EN PROCESO");
            }
            else
            {
              if(resultado.estado=="DEVUELTA")
              {
                this.toastr.error("Comprobante devuelto: " + resultado.data.mensaje + " " + resultado.data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
                const resultadoestado = await this.sriguiaremision.actualizarEstado(this.guiaremision.cod_guia_remision, "0", resultado.data.mensaje, resultado.data.informacionadicional, "DEVUELTA", resultado.data.fechaautorizacion);
                await this.informacionActualizarEstado(resultadoestado, "DEVUELTA");
              }
              else//ERROR CONEXION
              {
                this.toastr.error("Se Origino un error en el sistema de recepción de SRI: " + resultado.data.mensaje + " " + resultado.data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
                const resultadoestado = await this.sriguiaremision.actualizarEstadoError(this.guiaremision.cod_guia_remision, resultado.data.identificador, resultado.data.mensaje, resultado.data.informacionadicional, "CREADA");
              }
            }
          }
          
        } catch (err) {
          this.toastr.error(err.message || err, "INFORMACIÓN DEL SISTEMA");
        } finally {
          Swal.close();
        }
        
    }
  
    async informacionActualizarEstado(data: any, estado: string)
    {
        if(estado=="AUTORIZADO")
        {
            this.disabledbtnsrienviar = true;
            this.colormensaje = "#0000FF";
            this.textomensaje = "AUTORIZADO";
        }
  
        if(estado=="EN PROCESO")
        {
            this.disabledbtnsrienviar = true;
            this.colormensaje = "#ffc107";
            this.textomensaje = "EN PROCESO";    
        }
  
        if(estado=="DEVUELTA")
        {
            this.colormensaje = "#FF0000";
            this.textomensaje = "DEVUELTA";
        }
  
        if(estado=="NO AUTORIZADO")
        {
            this.colormensaje = "#FF0000";
            this.textomensaje = "NO AUTORIZADO";
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

}