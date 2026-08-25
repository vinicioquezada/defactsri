import { Component, OnInit, ViewChild } from '@angular/core';
import { CompraService } from 'src/app/compra/services/compra.service';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { RetencionService } from '../../services/retencion.service';
import { DatosSujetoRetenidoComponent } from './datos-sujeto-retenido/datos-sujeto-retenido.component';
import { DetalleRetencionComponent } from './detalle-retencion/detalle-retencion.component';
import { DatosVentasComponent } from './datos-ventas/datos-ventas.component';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { ConfigService } from 'src/app/shared/services/config.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-retencion',
  templateUrl: './retencion.component.html',
  styleUrls: ['./retencion.component.css']
})
export class RetencionComponent implements OnInit {
  cod_proyecto : string = "";
  multisucursal : string = "0";
  electronico : string = "0";
  tipo_retencion : string = "ELECTRONICA";
  numeracion_automatica : string = "1";

  tipo_formulario: string = "";

  @ViewChild(DatosSujetoRetenidoComponent) childdatossujetoretenido: any;
  @ViewChild(DetalleRetencionComponent) childdetalleretencionComponent: any;
  @ViewChild(DatosVentasComponent) childdatosventascomponent: any;

  disabledbtnnuevo : boolean = false;
  disabledbtnguardar : boolean = true;
  disabledbtnsrienviar : boolean = true;
  disabledbtnimprimir : boolean = true;

  arr_retencion : any;

  cod_retencion : string = "";
  cod_factura_compra_anterior : string = "";
  numero_retencion : string = "";
  claveacceso : string = "0";
  anio : string = "";
  mes : string = "";
  fecha_registro : string = "";
  observacion : string = "";
  datosanio : any = [];
  datosmes : any = [];

  colormensaje : string = "";
  textomensaje : string = "";
  estado : string = "";
  envio : string = "";
  cod_usuario: string = "";

  cod_sucursal : string = "";
  sucursal : string = "";
  datossucursal : any;

  serieestab : string = "";
  ptoemi : string = "";
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

  firmap12 : string = "";
  clavep12 : string = "";
  pk12 : number = 1;
  firmapublica : string = "";
  firmaprivada : string = "";
  certificado: string = "";

  retencionversion: string = "";

  cod_factura_compra: string = "";
  disabledbtn : boolean = true;
  disabledbtnmodificar : boolean = false;
  disabledbtnactualizar: boolean = true;

  loading : boolean = false;
  loadingalmacenar : boolean = false;

  constructor(private retencionservice: RetencionService, private sucursalesservice : SucursalesService, private toastr : ToastrService, private error : ErrorService, private router : Router, private rutaActiva: ActivatedRoute, private compraservice: CompraService, private location: Location, private bodyStyleService: BodyStyleService, private usersession: UserSessionService, private configService: ConfigService) { }

  ngOnInit(): void {
    const fechaactual = moment();
    const anio = fechaactual.format("YYYY");
    for(let c=0; c<5; c++) {
      this.datosanio.push( parseInt(anio) - c  );
    }
    this.anio = anio;
    
    this.mes = fechaactual.format("MM");

    for(let c=1; c<=12; c++) {
      this.datosmes.push(String(c).padStart(2, '0'));
    }

    this.tipo_formulario = this.rutaActiva.snapshot.paramMap.get("tipo_formulario")!;
    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.electronico = this.usersession.getConfiguracion("electronico");
    this.datossucursal = [];
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");

    if(this.tipo_formulario == "nuevoregistro")
    {
      this.listarSucursales();
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

  changeSucursal(event: any): void {
    const elemento = event.target.value;
    this.cod_sucursal = elemento;
    this.buscarSucursal();
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
    this.retencionservice.claveAccesoActualizar(this.numero_retencion, this.serieestab, this.ptoemi, this.fecha_registro, this.ruc, this.tipoambiente).subscribe( (data : any) =>
    {
      this.loading = false;
      this.claveacceso = data.claveacceso;
    }, err => {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  onChangeAnio(event: any): void {
    const elemento = event.target.value;
    this.anio = elemento;
  }

  onChangeMes(event: any): void {
    const elemento = event.target.value;
    this.mes = elemento;
  }

  clickDeshacer()
  {
    this.formularioNormal();
    this.deshabilitaCampos();
  }

  clickNuevo()
  {
    if(this.datossucursal.length>0)
    {
      this.loading = true;
          this.formularioNormal();
          this.habilitarFormulario();
          /*
          this.childdetalleventa.datosdetalles = [];
          let element = document.getElementById("box");
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          */
          this.verificarRegistro();
          /*
          this.datosproducto = this.childlistadoproductogeneral.datosproducto;
          this.datostarifasproducto = this.childlistadoproductogeneral.datostarifasproducto;
          this.loading = false;
          */
    }
    else
    {
      this.toastr.warning("Presiona F5 o Recarga la página, no se completó la conexión correctamente debido error de conectividad", "INFORMACIÓN DEL SISTEMA");
    }
  }

  clickModificar()
  {
    if(this.estado!="AUTORIZADO")
    {
        this.habilitarFormulario();
    }
  }

  formularioNormal()
  {
    if(this.tipo_formulario == "nuevoregistro")
    {
      this.disabledbtnnuevo = false;
      this.disabledbtnguardar = true;
      this.disabledbtnsrienviar = true;
      this.disabledbtnimprimir = true;
      this.disabledbtn = true;

      this.cod_retencion = "";

      this.childdatossujetoretenido.formularioNormal();
      this.childdetalleretencionComponent.formularioNormal();
      this.childdatosventascomponent.formularioNormal();

      this.cod_factura_compra_anterior = "";
      this.numero_retencion = "";
      this.claveacceso = "";
      //this.anio = "";
      //this.mes = "";
      this.fecha_registro = "";
      this.estado = "";
      this.envio = "";
      this.cod_usuario = "";
      this.colormensaje = "";
      this.textomensaje = "";
    }
    else
    {
      if(this.tipo_formulario == "actualizarregistro")
      {
        this.cod_retencion = this.rutaActiva.snapshot.paramMap.get("cod_retencion")!;
        this.cod_factura_compra = this.rutaActiva.snapshot.paramMap.get("cod_factura_compra")!;

        this.disabledbtnmodificar = false;
        this.disabledbtnactualizar = true;
        this.disabledbtnimprimir = true;
        this.disabledbtn = true;
        this.buscarRetencionCompra();
      }
    }
  }

  habilitarFormulario()
  {
    this.disabledbtnnuevo = true;
    this.disabledbtnguardar = false;
    this.disabledbtn = false;
    this.disabledbtnactualizar = false;

    this.childdatossujetoretenido.habilitarFormulario();
    this.childdetalleretencionComponent.habilitarFormulario();
    this.childdatosventascomponent.habilitarFormulario();
    this.disabledbtnnuevo = true;
    this.disabledbtnguardar = false;
    this.disabledbtnmodificar = true;
    this.disabledbtnactualizar = false;
  }

  deshabilitarFormulario()
  {
    this.disabledbtnguardar = true;
    this.disabledbtnactualizar = true;
    this.disabledbtn = true;
    this.childdatossujetoretenido.deshabilitarFormulario();
    this.childdetalleretencionComponent.deshabilitarFormulario();
    this.childdatosventascomponent.deshabilitarFormulario();
  }

  verificarRegistro()
  {
    this.loading = true;
    

    this.retencionservice.verificarRegistro().subscribe( (data : any) =>
    {
      
      if(data == null)
      {
        this.formularioNormal();
        this.deshabilitaCampos();
        this.toastr.error("Error al generar codigo de acceso, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.cod_retencion = moment().unix().toString() + data.codigo;
        this.numero_retencion = data.n_comprobante;
        this.claveacceso = data.claveacceso;
        this.fecha_registro = moment(data.fecha).format('YYYY-MM-DD');
        let numeracionautomatica = parseInt(this.numeracion_automatica);
        if(numeracionautomatica==0)
        {
          this.numero_retencion = "";
        }
      }
      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  listarSucursales()
  {
    this.loading = true;

    this.sucursalesservice.listarUsuarioSucursales().subscribe( (data : any) =>
    {
      this.datossucursal = data;
      this.loading = false;
      //this.childdetalleretencionComponent.listarTipoDocumentos();
      //this.childdetalleretencionComponent.listarCodigoRetencion();
      this.buscarSucursal();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  deshabilitaCampos()
  {
    this.childdatossujetoretenido.disabledbtn = true;
    this.childdatosventascomponent.disabledbtn = true;
    this.childdetalleretencionComponent.disabledbtn = true;
  }

  buscarSucursal()
  {
    const resultado = this.datossucursal.find( (valor : any) => valor.cod_sucursal == this.cod_sucursal );
    this.serieestab = resultado.serieestab;
    this.ruc = resultado.ruc_sucursal;
    this.tipoambiente = resultado.tipo_ambiente;
    this.razon_social = resultado.razonsocial;
    this.nombre_comercial = resultado.nombrecomercial;
    this.contabilidad = resultado.contabilidad;
    this.direccion_matriz = resultado.direccion_matriz;
    this.direccion_establecimiento = resultado.direccion_establecimiento;
    this.tipo_contribuyente = resultado.tipo_contribuyente;
    this.contribuyente = resultado.contribuyente;
    this.leyenda = resultado.leyenda;
    this.firmap12 = resultado.firmap12;
    this.clavep12 = resultado.clavep12;
    this.pk12 = resultado.pk12;
    this.firmapublica = resultado.firmapublica;
    this.firmaprivada = resultado.firmaprivada;
    this.certificado = resultado.certificado;
    this.retencionversion = resultado.retencionversion;
  }

  recibirDatosSujetoRetenido(datossujetoretenido: any)
  {
    this.childdetalleretencionComponent.codigo_tipo_documento = "01";
    this.childdetalleretencionComponent.numero_documento = datossujetoretenido[0].codigo;
    this.childdetalleretencionComponent.fecha_compra = datossujetoretenido[0].fecha_emision;
    this.childdetalleretencionComponent.datosdetalles = datossujetoretenido;
  }

  recibirDatosDetallesRetencion(datosrecibidosdetalleretencion: any)
  {
    this.childdatosventascomponent.agregarDetalle(datosrecibidosdetalleretencion);
  }

  clickVerificar()
  {
    if(this.fecha_registro.length == 0)
    {
      this.toastr.warning("Seleccione una fecha de registro para registrar", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      if (this.childdatosventascomponent.total_retenido == 0)
      {
        this.toastr.warning("No hay nada almacenar, realice la retención por favor", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {    
        if(this.tipo_formulario == "nuevoregistro")
          {
            Swal.fire({
              title: 'Guardar Registro de Retención de Compra',
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
                title: 'Actualizar Registro de Retención de Compra',
                text: '¿Estás seguro de actualizar registro?',
                icon: 'info',//'warning'
                showCancelButton: true,
                confirmButtonText: 'Si, Actualizar',
                cancelButtonText: 'No, Cerrar'
              }).then((result) => {
                if (result.value) {
                  this.crearFirmarXml();
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                  
                }
              });
            }
          }
        
      
      }
    }
  }

  guardar()
  {
    this.loadingalmacenar = true;

    let detalles = [];
      this.childdatosventascomponent.datosdetalles.forEach(item => {
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
        };
        detalles.push(detalle);
      });

      let retencion = {
        'cod_retencion' : this.cod_retencion,
        'cod_factura_compra' : this.childdatossujetoretenido.cod_factura_compra,
        'serieestab' : this.serieestab,
        'ptoemi' : this.ptoemi,
        'ruc' : this.ruc,
        'tipoambiente' : this.tipoambiente,
        'numero_retencion' : this.numero_retencion,
        "cod_proveedor" : this.childdatossujetoretenido.cod_proveedor,
        'fecha_hora' : this.fecha_registro,

        'periodo_fiscal_mes' : this.mes,
        'periodo_fiscal_ap' : this.anio,
        'total_retenido' : this.childdatosventascomponent.total_retenido,
    
        'cod_sucursal' : this.cod_sucursal,
        'tipo_retencion' : this.tipo_retencion,
        
        'detalles' : detalles
      };

      this.retencionservice.guardar(retencion).subscribe( (data : any) =>
      {
          this.loadingalmacenar = false;

          if (data.estado == true)
          {
            this.numero_retencion = data.n_retencion;
            this.claveacceso = data.claveacceso;
            this.serieestab = data.serieestab;//Se asigna con 001
            this.ptoemi = data.ptoemi;//Se asigna con 001
           
            this.disabledbtnnuevo = false;
            this.disabledbtnguardar = true;
            this.disabledbtnimprimir = false;
            
            this.deshabilitaCampos();
            
            this.colormensaje = "#00FF00";
            this.textomensaje = "CREADA";

            this.toastr.success("Factura de Venta registrada correctamente", "INFORMACIÓN DEL SISTEMA");

            this.crearFirmarXml();
            
          }
          else
          {
            this.toastr.error("Factura de Venta no se pudo registrar, error inesperado", "INFORMACIÓN DEL SISTEMA");
          }
        }, err => {
          this.loadingalmacenar = false;
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      });
  }

  actualizar()
  {
    this.loadingalmacenar = true;

    let detalles = [];
      this.childdatosventascomponent.datosdetalles.forEach(item => {
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
        };
        detalles.push(detalle);
      });
      let retencion = {
        'cod_retencion' : this.cod_retencion,
        'cod_factura_compra' : this.childdatossujetoretenido.cod_factura_compra,
        'cod_factura_compra_anterior' : this.cod_factura_compra_anterior,
        'claveacceso' : this.claveacceso,
        'serieestab' : this.serieestab,
        'ptoemi' : this.ptoemi,
        'ruc' : this.ruc,
        'tipoambiente' : this.tipoambiente,
        'numero_retencion' : this.numero_retencion,
        "cod_proveedor" : this.childdatossujetoretenido.cod_proveedor,
        'fecha_hora' : this.fecha_registro,

        'periodo_fiscal_mes' : this.mes,
        'periodo_fiscal_ap' : this.anio,
        'total_retenido' : this.childdatosventascomponent.total_retenido,
    
        'cod_sucursal' : this.cod_sucursal,
        'tipo_retencion' : this.tipo_retencion,

        'estado' : this.estado,
        'envio' : this.envio,
        
        'detalles' : detalles
      };

      this.retencionservice.actualizar(retencion).subscribe( (data : any) =>
      {
          this.loadingalmacenar = false;

          if (data.estado == true)
          {
            this.numero_retencion = data.n_retencion;
            this.claveacceso = data.claveacceso;
            this.serieestab = data.serieestab;//Se asigna con 001
            this.ptoemi = data.ptoemi;//Se asigna con 001
           
            this.disabledbtnimprimir = false;
            
            this.deshabilitaCampos();
            
            this.colormensaje = "#00FF00";
            this.textomensaje = "CREADA";

            this.toastr.success("Retención actualizada correctamente", "INFORMACIÓN DEL SISTEMA");

            this.deshabilitarFormulario();
            
          }
          else
          {
            this.toastr.error("Retención no se pudo registrar, error inesperado", "INFORMACIÓN DEL SISTEMA");
          }
        }, err => {
          this.loadingalmacenar = false;
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      });
  }

  visualizar()
  {	 
    let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/retenciones/retencion?codretencion=" + this.cod_retencion, "Retención", 'width=600,height=400,left=300,top=100');
    miVentana.focus();
  }

  buscarRetencionCompra()
  {
    this.loading = true;
    this.retencionservice.buscarRetencionCompra(this.cod_retencion).subscribe( (data : any) =>
    {
      this.childdetalleretencionComponent.codigo_tipo_documento = "01";
      this.cod_factura_compra = data[0].cod_factura_compra;
      this.cod_factura_compra_anterior = data[0].cod_factura_compra;
      this.cod_retencion = data[0].cod_retencion;

      this.numero_retencion = this.padLeft(data[0].numero_retencion, 9);
      this.fecha_registro = moment(data[0].fecha_hora).format('YYYY-MM-DD');
      this.mes = data[0].periodo_fiscal_mes;
      this.anio = data[0].periodo_fiscal_ap;
      this.claveacceso = data[0].claveacceso;
      this.estado = data[0].estado;
      this.envio = data[0].envio;
      this.cod_usuario = data[0].cod_usuario;
      this.colormensaje = "";
      this.textomensaje = "";

      this.childdatossujetoretenido.asignacionDatosSujeto(data[0].cod_identificacion, data[0].identificacion, data[0].cod_proveedor, data[0].proveedor, data[0].ruc, data[0].celular, data[0].correo, data[0].direccion, data[0].cod_factura_compra)
  
      this.cod_sucursal = data[0].cod_sucursal;
      this.sucursal = data[0].sucursal;
      this.serieestab = data[0].serieestab;
      this.ptoemi = data[0].ptoemi;
      this.ruc = data[0].ruc_sucursal;
      this.tipoambiente = data[0].tipo_ambiente;
      this.razon_social = data[0].razonsocial;
      this.nombre_comercial = data[0].nombrecomercial;
      this.direccion_matriz = data[0].direccion_matriz;
      this.direccion_establecimiento = data[0].direccion_establecimiento;
      this.tipo_contribuyente = data[0].tipo_contribuyente;
      this.contribuyente = data[0].contribuyente;
      this.contabilidad = data[0].contabilidad;
      this.leyenda = data[0].leyenda;
      
      this.firmap12 = data[0].firmap12;
      this.clavep12 = data[0].clavep12;
      this.pk12 = data[0].pk12;
      this.firmapublica = data[0].firmapublica;
      this.firmaprivada = data[0].firmaprivada;
      this.certificado = data[0].certificado;

      this.retencionversion = data[0].retencionversion;

      this.childdatosventascomponent.datosdetalles = [];

      data.forEach(element => {        
        let detalle = {
          'cod_codigo_retencion' : element.cod_codigo_retencion,
          'codigo_retencion' : element.codigo_retencion,
          'base_imponible' : redondeardecimales(element.base_imponible,6 ),
          'porcentaje_retencion' : element.porcentaje_retencion,
          'valor_retenido' : redondeardecimales(element.valor_retenido, 6),
          'cod_documento' : element.codigo_tipo_documento,
          'numero_documento' : element.numero_documento,
          'fecha_emision_documento' : element.fecha_documento,
          'codigo_tipo_impuesto' : element.codigo_tipo_impuesto,
          'tipo_impuesto' : element.tipo_impuesto
        }
        this.childdatosventascomponent.datosdetalles.push(detalle);
      });

      this.childdatosventascomponent.total_retenido = redondeardecimales(data[0].total_retenido, 6);
     this.buscarFacturaCompra();

      this.loading = false;
      
      this.deshabilitaCampos();
   
      $("#mymodal").modal("show");
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
    });
  }

  buscarFacturaCompra()
  {
    this.loading = true;
    this.compraservice.buscarFactura(this.cod_factura_compra).subscribe( (data : any) =>
    {
      this.loading = false;
      this.childdetalleretencionComponent.numero_documento = data[0].codigo;
      this.childdetalleretencionComponent.fecha_compra = data[0].fecha_emision;
      this.childdetalleretencionComponent.datosdetalles = data;
      this.childdetalleretencionComponent.disabledbtn = true;
    }, err => {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }

  /*SRI*/
  /*SRI*/
  /*SRI*/
  crearFirmarXml()
  {
    let detalles = [];
      this.childdatosventascomponent.datosdetalles.forEach(item => {
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
        'cod_retencion' : this.cod_retencion,
        'cod_sucursal' : this.cod_sucursal,
        'ambiente' : this.tipoambiente,
        'tipoemision' : '1',
        'razonsocial' : this.razon_social,
        'nombrecomercial' : this.nombre_comercial,
        'ruc' : this.ruc,
        'claveacceso' : this.claveacceso,
        'coddoc' : '07',
        'estab' : this.serieestab,
        'ptoemi' : this.ptoemi,
        'secuencial' : this.numero_retencion,
        'dirmatriz' : this.direccion_matriz,
        'tipocontribuyente': this.tipo_contribuyente,
        'contribuyente' : this.contribuyente,
        'leyenda' : this.leyenda,

        'retencionversion' : this.retencionversion,

        'firmap12' : this.firmap12,
        'clavep12' : this.clavep12,
        'pk12' : this.pk12,
        'firmapublica' : this.firmapublica,
        'firmaprivada' : this.firmaprivada,
        'certificado' : this.certificado,
        
        /*INFO RETENCIÓN*/
        'fechaemision' : this.fecha_registro,
        'direstablecimiento' : this.direccion_establecimiento,
        'obligadocontabilidad' : this.contabilidad,
        'cod_identificacion' : this.childdatossujetoretenido.cod_identificacion,
        'identificacionproveedor' : this.childdatossujetoretenido.numero_identificacion,
        'razonsocialproveedor' : this.childdatossujetoretenido.proveedor,
        'periodofiscalmes' : this.mes,
        'periodofiscalap' : this.anio,
        'direccion' : this.childdatossujetoretenido.direccion,
        'celular' : this.childdatossujetoretenido.celular,
        'correo' : this.childdatossujetoretenido.correo,
        'observacion' : this.observacion,
        'detalles' : detalles
      };
      
      this.loadingalmacenar = true;
      

      this.retencionservice.crearFirmarXml(this.arr_retencion).subscribe( (data : any) =>
      {
          this.loadingalmacenar = false; 

          if (data.estado == true)
          {
            if(this.tipo_formulario == "nuevoregistro")
            {
              Swal.fire({
                title: 'Su Retención se ha creado correctamente',
                text: 'Desea enviar al SRI el documento electrónico',
                icon: 'info',//'warning'
                showCancelButton: true,
                confirmButtonText: 'Si, Enviar',
                cancelButtonText: 'No, Enviar más tarde'
              }).then((result) => {
                if (result.value) {
                  this.disabledbtnsrienviar = true;
                  this.visualizar();
                  this.enviarSri();
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                  this.disabledbtnsrienviar = false;
                  this.visualizar();
                }
              });
            }
            else
            {
              if(this.tipo_formulario == "actualizarregistro")
              {
                this.actualizar();
              }
            }
          }
          else
          {
            this.toastr.error("No se pudo general el archivo XML por problema en la conexion, generelo desde el explorador", "INFORMACIÓN DEL SISTEMA");
          }
        }, err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loadingalmacenar = false;
          
      });
  }

  enviarSri()
  {
      let parametros = {
          'cod_proyecto' : this.cod_proyecto,
          'cod_retencion' : this.cod_retencion
        };
      
      this.loadingalmacenar = true;
      

      this.retencionservice.enviarSri(parametros).subscribe( (data : any) =>
      {
          this.loadingalmacenar = false;
          
          if (data.estado == true)
          {
            if(data.estadomensaje=="RECIBIDA")
            {
              this.comprobarSri();
            }
            else
            {
              this.toastr.error("Comprobante rechazado: " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");

              this.actualizarEstado(this.cod_retencion, "0", data.mensaje, data.informacionadicional, "DEVUELTA", data.fechaautorizacion);
            }
          }
          else
          {
            this.toastr.error("Se Origino un error " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
          }
          
        }, err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loadingalmacenar = false;
          
      });
  
  }

  comprobarSri()
  {
      let parametros = {
          'cod_proyecto' : this.cod_proyecto,
          'cod_retencion' : this.cod_retencion,
		      'claveacceso' : this.claveacceso
        };
      
      this.loadingalmacenar = true;
      

      this.retencionservice.comprobarSri(parametros).subscribe( (data : any) =>
      {
          this.loadingalmacenar = false;
          

          if (data.estado == true)
						{
							if(data.estadomensaje=="AUTORIZADO")
							{
								this.toastr.success("Comprobante Autorizado", "INFORMACIÓN DEL SISTEMA");
								this.actualizarEstado(this.cod_retencion, this.claveacceso, "", "", "AUTORIZADO", data.fechaautorizacion);
                this.arr_retencion.fechaautorizacion = data.fechaautorizacion;
								this.crearRide();
							}

							if(data.estadomensaje=="EN PROCESO")
							{
								this.toastr.success("Comprobante en Proceso " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
								this.actualizarEstado(this.cod_retencion, "0", data.mensaje, data.informacionadicional, "EN PROCESO", data.fechaautorizacion);
							}

							if(data.estadomensaje=="NO AUTORIZADO")
							{
								this.toastr.error("Comprobante No Autorizado: " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
								this.actualizarEstado(this.cod_retencion, "0", data.mensaje, data.informacionadicional, "NO AUTORIZADO", data.fechaautorizacion);
							}
						}
						else
						{
							this.toastr.error("Se Origino un error " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
						}
          
          
        }, err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loadingalmacenar = false;
          
      });
  
  }

  actualizarEstado(cod_retencion : string, n_autorizacion : string, mensaje_error : string, informacion_adicional : string, estado : string, fechaautorizacion: string)
  {
      let parametros = {
        'cod_retencion' : this.cod_retencion,
        'n_autorizacion' : n_autorizacion,
        'mensaje_error' : mensaje_error,
        'informacion_adicional' : informacion_adicional,
        'estado' : estado,
        'fechaautorizacion' : fechaautorizacion
      };
      
      this.loadingalmacenar = true;
      

      this.retencionservice.actualizarEstado(parametros).subscribe( (data : any) =>
      {
          this.loadingalmacenar = false;
          
          if (data.estado == true)
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
						else
						{
							this.toastr.error("Registro no se pudo Almacenar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
						}
        }, err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loadingalmacenar = false;
          
      });
  }

  crearRide()
  {	 
    this.loadingalmacenar = true;
    
    this.retencionservice.crearRide(this.arr_retencion).subscribe( (data : any) =>
    {
        this.loadingalmacenar = false;
        
        this.disabledbtnsrienviar = true;
        if(this.childdatossujetoretenido.correo=="")
        {
          this.toastr.warning("No tiene el cliente un correo para enviar", "INFORMACIÓN DEL SISTEMA");
        }
        else
        {
          this.enviarCorreo();
        }
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loadingalmacenar = false;
        
    });
  }

  enviarCorreo()
  {
      let parametros = {
        'cod_proyecto' : this.cod_proyecto,
        'cod_retencion' : this.cod_retencion,
        'nombre_comercial' : this.nombre_comercial,
        'numero_retencion' : this.numero_retencion,
        'correo' : this.childdatossujetoretenido.correo,
        'proveedor' : this.childdatossujetoretenido.proveedor,
        'serieestab' : this.serieestab,
        'ptoemi' : this.ptoemi
        };
      
      this.loadingalmacenar = true;
      

      this.retencionservice.enviarCorreoRetencion(parametros).subscribe( (data : any) =>
      {
          this.loadingalmacenar = false;
          

          if(data.estado == false)
          {
            this.toastr.error("Correo no se pudo enviar al cliente", "INFORMACIÓN DEL SISTEMA");
          }
          else
          {
            this.toastr.success("Correo enviado satisfactoriamente al cliente", "INFORMACIÓN DEL SISTEMA");
            this.actualizarEstadoCorreo();
          }
          
          
        }, err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loadingalmacenar = false;
          
      });
  }

  actualizarEstadoCorreo()
  {
      let parametros = {
        'cod_retencion' : this.cod_retencion
      };
      
      this.loadingalmacenar = true;
      

      this.retencionservice.actualizarEstadoCorreo(parametros).subscribe( (data : any) =>
      {
          this.loadingalmacenar = false;

          if (data.estado == false)
					{
            this.toastr.error("No se pudo actualizar estado de comprobante, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
          }      
          
        }, err => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          this.loadingalmacenar = false;
          
      });
  }
  /*SRI*/
  /*SRI*/
  /*SRI*/

  goBack(){
    this.location.back();
  }
}