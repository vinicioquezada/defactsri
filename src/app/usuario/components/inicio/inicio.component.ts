import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { SucursalesService } from '../../services/sucursales.service';
import { ToastrService } from 'ngx-toastr';
import { InicioService } from '../../services/inicio.service';
declare var $:any;
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { ErrorService } from 'src/app/shared/services/error.service';
import { VentaService } from 'src/app/venta/services/venta.service';
import * as moment from 'moment';
import { ProductoService } from 'src/app/almacen/services/producto.service';
import { OpcionesExploradorVentaComponent } from 'src/app/shared/components/venta/opciones-explorador-venta/opciones-explorador-venta.component';
import { NotaCreditoService } from 'src/app/venta/services/nota-credito.service';
import { GuiaRemisionService } from 'src/app/venta/services/guia-remision.service';
import { RetencionService } from 'src/app/retencion/services/retencion.service';
import { OpcionesExploradorNotaCreditoComponent } from 'src/app/shared/components/venta/opciones-explorador-nota-credito/opciones-explorador-nota-credito.component';
import { OpcionesExploradorGuiaRemisionComponent } from 'src/app/shared/components/venta/opciones-explorador-guia-remision/opciones-explorador-guia-remision.component';
import { OpcionesExploradorRetencionComponent } from 'src/app/shared/components/retencion/opciones-explorador-retencion/opciones-explorador-retencion.component';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { RucEmpresaService } from '../../services/ruc-empresa.service';
import { SriVentaService } from 'src/app/shared/services/sri-venta.service';
import { FacturaVentaDTO } from 'src/app/venta/models/factura-venta.dto';
import { SwalService } from 'src/app/shared/services/swal.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  @ViewChild(OpcionesExploradorVentaComponent) opcionesexploradorventacomponent: any;
  @ViewChild(OpcionesExploradorNotaCreditoComponent) opcionesexploradornotacreditocomponent: any;
  @ViewChild(OpcionesExploradorGuiaRemisionComponent) opcionesexploradorguiaremisioncomponent: any;
  @ViewChild(OpcionesExploradorRetencionComponent) opcionesexploradorretencioncomponent: any;
  tipoformularioventa: string = "exploradorventainicio";
  tipoformularionotacredito: string = "exploradornotacreditoinicio";
  tipoformularioguiaremision: string = "exploradorguiaremisioninicio";
  tipoformularioretencion: string = "exploradorretencioninicio";

  electronico : string = "0";
  multisucursal : string = "0";
  usuario : string = "";
  panel_usuario : string = "";
  panel_administrador : number = 0;
  panel_vendedor : number = 0;
  panel_comprobantes : number = 0;

  cantidad_productos_minimos : number = 0;
  cantidad_ventas : number = 0;
  cantidad_notas : number = 0;
  cantidad_guias : number = 0;
  cantidad_retenciones : number = 0;

  datos : any;
  datosproductosminimo : any = [];
  filterpost = "";
  filterpostproductos = "";

  loading : boolean = false;
  

  loadinglistado : boolean = false;
  

  cantidad_facturas : number = 0;
  facturas_anuladas : number = 0;
  facturas_autorizadas : number = 0;
  fact_sin_enviar_sri : number = 0;
  correos_enviados : number = 0;
  correos_no_enviados : number = 0;

  cantidad_productos : number = 0;
  cantidad_stock : number = 0;
  total_general_ventas_mes : number = 0;
  venta_mes : number = 0;
  venta_mes_directo : number = 0;
  abono_mes : number = 0;

  total_general_ventas_diaria : number = 0;
  venta_dia : number = 0;
  abono_dia : number = 0;
  total_general_ventas_diaria_usuario : number = 0;
  venta_dia_usuario : number = 0;
  abono_dia_usuario : number = 0;

  nota_credito_mes : number = 0;
  nota_credito_diaria : number = 0;
  nota_credito_diaria_usuario : number = 0;

  datossucursal : any;
  cod_sucursal : string = "";

  estado_comprobante : string = "";

  cod_proyecto : string = "";
  claveacceso : string = "";

  mensaje : string = "";
  activo : boolean = true;

  pageproductosminimo = 1;
  countproductosminimo = 0;
  pagesizeproductosminimo = 5;

  
  opcionesmenu : any;
  menuretencion : Boolean = false;
  
  opcionesprivilegios : any;

  urlproyecto: string = "";


  cantidad_notas_creditos : number = 0;
  notas_creditos_anuladas : number = 0;
  notas_creditos_autorizadas : number = 0;
  notas_creditos_sin_enviar_sri : number = 0;
  correos_enviados_notas_creditos : number = 0;
  correos_no_enviados_notas_creditos : number = 0;


  cantidad_guia_remision : number = 0;
  guia_remision_anuladas : number = 0;
  guia_remision_autorizadas : number = 0;
  guia_remision_sin_enviar_sri : number = 0;
  correos_enviados_guia_remision : number = 0;
  correos_no_enviados_guia_remision : number = 0;


  cantidad_retencion : number = 0;
  retencion_anuladas : number = 0;
  retencion_autorizadas : number = 0;
  retencion_sin_enviar_sri : number = 0;
  correos_enviados_retencion : number = 0;
  correos_no_enviados_retencion : number = 0;


  total_autorizados : number = 0;
  total_anulados : number = 0;
  total_comprobantes_pendientes : number = 0;
  total_correos_pendientes : number = 0;

  compra_mes_directo : number = 0;
  gasto_mes_directo : number = 0;

  pageventas = 1;
  countventas = 0;
  pagesizeventas = 5;

  pagenotascredito = 1;
  countnotascredito = 0;
  pagesizenotascredito = 5;

  pageguiaremision = 1;
  countguiaremision = 0;
  pagesizeguiaremision = 5;

  pageretencion = 1;
  countretencion = 0;
  pagesizeretencion = 5;


  single: any[] = [];
  
  view: [number, number] = [0, 300];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Totales';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Movimiento Mensual';

  colorScheme = {
    domain: ['#28a745', '#ffc107', '#dc3545']
  };

  firmasruc: string = "";

  recaudador: string = "";

  mensajefirma : string = "";
  cod_ruc: string = "";
  razonsocial: string = "";

  checktodos: boolean = false;

  codigo_iva: string;

  constructor(private loginservice:LoginService, private productoservice:ProductoService, private sucursalesservice : SucursalesService, private toastr : ToastrService, private error : ErrorService, private inicioservice : InicioService, private ventaservice : VentaService, private notacreditoservice: NotaCreditoService, private guiaremisionservice: GuiaRemisionService, private retencionservice: RetencionService, private usersession: UserSessionService, private rucempresaservice : RucEmpresaService, private sriventa: SriVentaService, private swalservice: SwalService){}

  ngOnInit(): void {
    this.recaudador = this.usersession.getConfiguracion("recaudador");
    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
    this.electronico = this.usersession.getConfiguracion("electronico");
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.usuario = this.usersession.getConfiguracion("usuario");
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.firmasruc = this.usersession.getConfiguracion("firmasruc");
    this.cod_ruc = this.usersession.getConfiguracion("cod_ruc");
    this.razonsocial = this.usersession.getConfiguracion("razonsocial");
    this.codigo_iva = this.usersession.getConfiguracion("codigo_iva");

    this.opcionesmenu = this.usersession.getAllMenu();
    
    //console.log(typeof this.opcionesmenu); // Te dirá "object"
    //console.log(Array.isArray(this.opcionesmenu)); // Te dirá false si no es un array
    if(this.opcionesmenu["codigoretencion"] == 1 || this.opcionesmenu["retencion"] == 1 || this.opcionesmenu["exploradorretencion"] == 1 || this.opcionesmenu["reporteretencion"] == 1)
    {
      this.menuretencion = true;
    }

    this.opcionesprivilegios = this.usersession.getAllPrivilegios();

    let panel_administrador = this.opcionesprivilegios.paneladministrador;

    this.panel_comprobantes = this.opcionesprivilegios.panelcomprobantes;
    
    if(panel_administrador == "1")
    {
      this.panel_comprobantes = 1;
      this.panel_usuario = "panel_administrador";
      this.panel_administrador = 1;
      let panel_vendedor = this.opcionesprivilegios.panelvendedor;
      if(panel_vendedor == "1")
      {
        this.panel_usuario = "panel_vendedor";
        this.panel_vendedor = 1;
      }
      else
      {
        this.panel_usuario = "panel_administrador";
        this.panel_vendedor = 0;
      }
    }
    else
    {
      this.panel_administrador = 0;
      let panel_vendedor = this.opcionesprivilegios.panelvendedor;
      if(panel_vendedor == "1")
      {
        this.panel_comprobantes = 1;
        this.panel_usuario = "panel_vendedor";
        this.panel_vendedor = 1;
      }
      else
      {
        if(this.panel_comprobantes==1)
        {
          this.panel_usuario = "panel_vendedor";
          this.panel_vendedor = 0;
        }
        else
        {
          this.panel_usuario = "0";
          this.panel_vendedor = 0;
        }
        
      }
    }
    this.revisarConfiguracion();
    this.listarSucursales();
    this.listarRucEmpresas();
  }

  async mensajeComprobantes()
  {
    const ok = await this.swalservice.alertOkRequerido({
      title: "COMPROBANTES PENDIENTES",
      text: "Existen comprobantes pendientes por revisar su estado de envío al SRI de dias anteriores, revisa la bandeja de comprobantes pendientes y actualiza su estado",
      icon: 'warning'
    });

    if (ok) {
      
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setView();
  }

  setView() {
    const width = document.querySelector('.chart-container')?.clientWidth || 0;
    this.view = [width, 400];
  }

  listarRucEmpresas()
  {    
    this.loading = true;
    
    this.rucempresaservice.listarRucEmpresas(this.cod_sucursal).subscribe( (data : any) =>
    {
      this.loading = false;
      const datosrucempresa = data;
      const resultado = datosrucempresa.find( (valor : any) => valor.cod_ruc == this.cod_ruc );

      const fecha_caducidad_firma = resultado.fecha_caducidad_firma;

      if(fecha_caducidad_firma!="2000-01-01 00:00:00")
      {
          const fechacaduca = moment(fecha_caducidad_firma, "YYYY-MM-DD HH:mm:ss");
          const fechaactual = moment();

          const sietediasantes = fechacaduca.clone().subtract(3, 'days');

          if (fechaactual.isBetween(sietediasantes, fechacaduca))
          {
            const diasrestantes = fechacaduca.diff(fechaactual, 'days');

            this.mensajefirma = "<div class='alert alert-warning alert-dismissible'>";
            this.mensajefirma += "<h4><i class='icon fas fa-exclamation-triangle'></i> Información del Sistema</h4>";
            this.mensajefirma += "<h5>La firma electrónica de <b>" + this.razonsocial + "</b> caduca en <b>" + (diasrestantes + 1) + " día(s)</b> hasta la fecha <b>" + fecha_caducidad_firma + "</b> Renueve la firma y contacte con el proveedor del sistema</h5>";
            this.mensajefirma +="</div>";
          }

          if (fechaactual.isAfter(fechacaduca))
          {
            this.mensajefirma = "<div class='alert alert-danger alert-dismissible'>";
            this.mensajefirma += "<h4><i class='icon fas fa-exclamation-triangle'></i> Firma Caducada</h4>";
            this.mensajefirma += "<h5>La firma electrónica de <b>" + this.razonsocial + "</b> ya se encuentra caducada, fecha de caducidad <b>" + fecha_caducidad_firma + "</b></h5>";
            this.mensajefirma +="</div>";
          }
      }
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  keyFiltradoProductosMinimos()
  {
    this.pageproductosminimo = 1;
  }

  keyFiltradoVentas()
  {
    this.pageventas = 1;
  }

  keyFiltradoNotasCredito()
  {
    this.pagenotascredito = 1;
  }

  keyFiltradoGuiaRemision()
  {
    this.pageguiaremision = 1;
  }

  keyFiltradoRetenciones()
  {
    this.pageretencion = 1;
  }

  changeSucursal(event: any): void {
    const elemento = event.target.value;
    this.cod_sucursal = elemento;
  }

  opciones(item: any)
  {
    this.opcionesexploradorventacomponent.opciones(item);
  }

  opcionesNotaCredito(item: any)
  {
    this.opcionesexploradornotacreditocomponent.opciones(item);
  }

  opcionesGuiaRemision(item: any)
  {
    this.opcionesexploradorguiaremisioncomponent.opciones(item);
  }

  opcionesRetencion(cod_retencion: string, numero_retencion: string, estado: string, proveedor : string, claveacceso : string, ptoemi : string, correo : string, cod_factura_compra : string)
  {
    this.opcionesexploradorretencioncomponent.opciones(cod_retencion, numero_retencion,estado, proveedor, claveacceso , ptoemi, correo, cod_factura_compra);
  }

  listarSucursales()
  {    
    this.loading = true;
    

    this.sucursalesservice.listarUsuarioSucursales().subscribe( (data : any) =>
    {
      this.datossucursal = data;
      this.loading = false;
      
      if(this.panel_administrador == 1 || this.panel_vendedor == 1 || this.panel_comprobantes == 1)
      {
        this.cargarescritorio();
      }
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  cargarescritorio()
  {    
    this.loading = true;
    

    this.inicioservice.cargarEscritorio(this.cod_sucursal, this.panel_usuario).subscribe( (data : any) =>
    {
      this.cantidad_productos = data["producto"].cantidad_productos;
      this.cantidad_stock = data["producto"].cantidad_stock;

      this.cantidad_facturas =data["factura_venta"].cantidad_facturas;
      this.facturas_anuladas =data["factura_venta"].facturas_anuladas;
      this.facturas_autorizadas =data["factura_venta"].facturas_autorizadas;
      this.fact_sin_enviar_sri =data["factura_venta"].fact_sin_enviar_sri;
      this.correos_enviados =data["factura_venta"].correos_enviados;
      this.correos_no_enviados =data["factura_venta"].correos_no_enviados;

      
      this.venta_mes =  redondeardecimales(data["factura_venta"].venta_mes, 2);
      this.venta_dia =  redondeardecimales(data["factura_venta"].venta_dia, 2);
      this.venta_dia_usuario =  redondeardecimales(data["factura_venta"].venta_dia_usuario, 2);


      this.abono_mes =  redondeardecimales(data["factura_venta_credito"].abono_mes, 2);
      this.abono_dia =  redondeardecimales(data["factura_venta_credito"].abono_dia, 2);
      this.abono_dia_usuario =  redondeardecimales(data["factura_venta_credito"].abono_dia_usuario, 2);


      this.nota_credito_mes = redondeardecimales(data["nota_credito"].nota_credito_mes, 2);
      this.nota_credito_diaria = redondeardecimales(data["nota_credito"].nota_credito_dia, 2);
      this.nota_credito_diaria_usuario = redondeardecimales(data["nota_credito"].nota_credito_dia_usuario, 2);
      this.cantidad_notas_creditos = data["nota_credito"].cantidad_notas_creditos;
      this.notas_creditos_anuladas = data["nota_credito"].notas_creditos_anuladas;
      this.notas_creditos_autorizadas = data["nota_credito"].notas_creditos_autorizadas;
      this.notas_creditos_sin_enviar_sri = data["nota_credito"].notas_creditos_sin_enviar_sri;
      this.correos_enviados_notas_creditos = data["nota_credito"].correos_enviados_notas_creditos;
      this.correos_no_enviados_notas_creditos = data["nota_credito"].correos_no_enviados_notas_creditos;


     
      this.cantidad_guia_remision = data["guia_remision"].cantidad_guia_remision;
      this.guia_remision_anuladas = data["guia_remision"].guia_remision_anuladas;
      this.guia_remision_autorizadas = data["guia_remision"].guia_remision_autorizadas;
      this.guia_remision_sin_enviar_sri = data["guia_remision"].guia_remision_sin_enviar_sri;
      this.correos_enviados_guia_remision = data["guia_remision"].correos_enviados_guia_remision;
      this.correos_no_enviados_guia_remision = data["guia_remision"].correos_no_enviados_guia_remision;


      this.cantidad_retencion = data["retencion"].cantidad_retencion;
      this.retencion_anuladas = data["retencion"].retencion_anuladas;
      this.retencion_autorizadas = data["retencion"].retencion_autorizadas;
      this.retencion_sin_enviar_sri = data["retencion"].retencion_sin_enviar_sri;
      this.correos_enviados_retencion = data["retencion"].correos_enviados_retencion;
      this.correos_no_enviados_retencion = data["retencion"].correos_no_enviados_retencion;
      

      this.total_general_ventas_mes =  redondeardecimales(data["resumen"].total_general_ventas_mes, 2);
      this.total_general_ventas_diaria =  redondeardecimales(data["resumen"].total_general_ventas_diaria, 2);
      this.total_general_ventas_diaria_usuario =  redondeardecimales(data["resumen"].total_general_ventas_diaria_usuario, 2);

      this.total_autorizados = this.facturas_autorizadas + this.notas_creditos_autorizadas + this.guia_remision_autorizadas + this.retencion_autorizadas;
      this.total_anulados = this.facturas_anuladas + this.notas_creditos_anuladas + this.guia_remision_anuladas + this.retencion_anuladas;
      this.total_comprobantes_pendientes = this.fact_sin_enviar_sri + this.notas_creditos_sin_enviar_sri + this.guia_remision_sin_enviar_sri + this.retencion_sin_enviar_sri;
      this.total_correos_pendientes = this.correos_no_enviados + this.correos_no_enviados_notas_creditos + this.correos_no_enviados_guia_remision + this.correos_no_enviados_retencion;

      this.venta_mes_directo =  redondeardecimales(data["factura_venta"].venta_mes_directo, 2);
      this.compra_mes_directo =  redondeardecimales(data["factura_compra"].compra_mes_directo, 2);
      this.gasto_mes_directo =  redondeardecimales(data["gasto"].gasto_mes_directo, 2);

      this.single= [
        {
          "name": "Ventas Generales",
          "value": this.venta_mes_directo
        },
        {
          "name": "Compras Generales",
          "value": this.compra_mes_directo
        },
        {
          "name": "Gastos Generales",
          "value": this.gasto_mes_directo
        }
      ];
  
      Object.assign(this, this.single );
  
      this.setView();

      if(data["factura_venta"].fact_sin_enviar_sri_antiguas>0 || data["nota_credito"].notas_creditos_sin_enviar_sri_antiguas>0 || data["guia_remision"].guia_remision_sin_enviar_sri_antiguas>0)
      {
        this.mensajeComprobantes();
      }
      
      
      this.loading= false;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  listarFacturas(op : number)
  {
    this.checktodos = false;
    this.pageventas = 0;
    this.datos = [];
    this.filterpost = "";

    let opcion="";

    if(op==1)
    {
        opcion = "electronica_creada";
    }
    
    if(op==2)
    {
        opcion = "electronica_envio";
    }

    $("#mymodallistarventas").modal("show");

    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth();
    let firstDay = new Date(y, m, 1);
    let lastDay = new Date(y, m + 1, 0);

    let fechadesde = moment(firstDay).format('YYYY-MM-DD');
    let fechahasta = moment(lastDay).format('YYYY-MM-DD');
 
    this.loadinglistado = true;
    

    this.ventaservice.listarFacturas(fechadesde, fechahasta, opcion, this.cod_sucursal, this.estado_comprobante, "", this.opcionesprivilegios.solomiscomprobantes, "0", "").subscribe( (data : any) =>
    {
      this.datos = data.map(obj => ({ ...obj, seleccion: false, fila_error: false, mensajesri: "" }));
      this.loadinglistado = false;
      this.cantidad_ventas = data.length;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  revisarConfiguracion()
  {    
    this.loading = true;
    this.sucursalesservice.revisarConfiguracion().subscribe( (data : any) =>
    {
      this.urlproyecto = data[0].urlproyecto;
      this.verificarplan();
    }, err => {
      this.toastr.error("Vuelva a intentarlo por Favor F5 :" + this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
    });
  }


  listarComprobantesPendientes()
  {
    $("#mymodalcomprobantespendientes").modal("show");
  }

  listarCorreosPendientes()
  {
    $("#mymodalcorreospendientes").modal("show");
  }
  
  listarproductosminimostock()
  {
    this.pageproductosminimo = 0;
    this.filterpostproductos = "";
    $("#mymodallistarproductos").modal("show");
    this.loadinglistado = true;
    

    let cantidad = "0";
    let cod_categoria="";
    let cod_subcategoria="";
    let inventario_minimo="1";

    this.productoservice.listarProductosStock(this.cod_sucursal, cantidad,  cod_categoria, cod_subcategoria, inventario_minimo).subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      this.datosproductosminimo = data;
      this.cantidad_productos_minimos = data.length;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
    });
  }

  verificarplan()
  {    
    this.loginservice.verificarPlan(this.urlproyecto).subscribe( (resultado : any) =>
    {
      let estado_valor = resultado[0].estado_valor;
			let dias_restantes = resultado[0].dias_restantes;
			let fecha_fin_plan =resultado[0].fecha_fin_plan;

			if(estado_valor==0)//No tiene un plan activo
			{
        this.activo = true;
			}
      else
      {
        if(estado_valor=="N")
        {
          this.mensaje = "<div class='alert alert-danger alert-dismissible'>";
          this.mensaje += "<h4><i class='icon fas fa-exclamation-triangle'></i> Información de Proyecto</h4>";
          this.mensaje += "<h5>Estimado usuario su proyecto no tiene registro de proyecto por lo que debe contactarse con el proveedor del sistema</h5>";
          this.mensaje +="</div>";
          this.activo = false;
        }
        else
        {
          if(estado_valor==1)//Caducado
          {
            if(dias_restantes<=2)
            {
              let fecha = this.formatearfecha(fecha_fin_plan);
  
              this.mensaje = "<div class='alert alert-danger alert-dismissible'>";
              this.mensaje += "<h4><i class='icon fas fa-exclamation-triangle'></i> Información de Plan</h4>";
              this.mensaje += "<h5>Estimado usuario su plan a terminado el <b>" + fecha + "</b>, debe renovar el plan para poder utilizar las funcionalidades de la aplicacion</h5>";
              this.mensaje +="</div>";
              this.activo = true;
            }
            else
            {
              let fecha = this.formatearfecha(fecha_fin_plan);
  
              this.mensaje = "<div class='alert alert-danger alert-dismissible'>";
              this.mensaje += "<h4><i class='icon fas fa-exclamation-triangle'></i> Información de Plan</h4>";
              this.mensaje += "<h5>Estimado usuario su plan a terminado el <b>" + fecha + "</b>, no cuenta con un plan activo actualmente</h5>";
              this.mensaje +="</div>";
              this.activo = false;
              localStorage.clear();
            }
          }
          else
          {
            if(dias_restantes<=2)
            {
              let fecha = this.formatearfecha(fecha_fin_plan);
              this.mensaje = "<div class='alert alert-warning alert-dismissible'>";
              this.mensaje += "<h4><i class='icon fas fa-exclamation-triangle'></i> Información de Plan</h4>";
              this.mensaje += "<h5>Estimado usuario su plan esta a punto de terminar, debe renovar el plan hasta el <b>" + fecha + "</b></h5>";
              this.mensaje +="</div>";
              this.activo = true;
            }
            else
            {
              if(dias_restantes<=7)
              {
                let fecha = this.formatearfecha(fecha_fin_plan);
                this.mensaje = "<div class='alert alert-info alert-dismissible'>";
                this.mensaje += "<h4><i class='icon fas fa-exclamation-triangle'></i> Información de Plan</h4>";
                this.mensaje += "<h5>Estimado usuario su plan esta por terminar, debe renovar el plan hasta el <b>" + fecha + "</b></h5>";
                this.mensaje +="</div>";
                this.activo = true;
              }
            }
            
          }
        }
      }
    }, err => {
      //this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  formatearfecha(fecha)
  {
    let arreglo = fecha.split("-");
    let fecha_actual = arreglo[0] + "/" + arreglo[1] + "/" + arreglo[2];

    let fecha_actual1 = new Date(fecha_actual);
    let dia_actual = fecha_actual1.getDate();
    let mes_nombre = Intl.DateTimeFormat('es-ES', { month: 'long'}).format(fecha_actual1);
    let anio_actual = fecha_actual1.getFullYear();
    return dia_actual + " de " + mes_nombre + " del " + anio_actual;
  }

  recibirDatosEstado(item: any): void {
    const factura = this.datos.find((x: any) => x.cod_factura_venta == item.cod_factura_venta);
    if (factura)
    {
      factura.estado = item.estado;
      factura.fecha_hora = item.fecha_hora;
      factura.error_sri = item.error_sri;
    }
  }

  recibirDatosCorreo(item: any): void {
    this.datos.find((x:any) => x.cod_factura_venta == item.cod_factura_venta).envio = item.envio;
  }

  handlePageChangeproductosminimo(event: number): void {
    this.pageproductosminimo = event;
  }

  handlePageChangeventas(event: number): void {
    this.pageventas = event;
  }

  handlePageChangeNotasCredito(event: number): void {
    this.pagenotascredito = event;
  }

  handlePageChangeGuiaRemision(event: number): void {
    this.pageguiaremision = event;
  }

  handlePageChangeRetencion(event: number): void {
    this.pageretencion = event;
  }


  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  listarNotasCredito(op : number)
  {
    this.pagenotascredito = 0;
    this.datos = [];
    this.filterpost = "";

    $("#mymodallistarnotascredito").modal("show");

    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth();
    let firstDay = new Date(y, m, 1);
    let lastDay = new Date(y, m + 1, 0);

    let fechadesde = moment(firstDay).format('YYYY-MM-DD');
    let fechahasta = moment(lastDay).format('YYYY-MM-DD');
    

    let opcion="";

    if(op==1)
    {
        opcion = "electronica_creada";
    }
    
    if(op==2)
    {
        opcion = "electronica_envio";
    }

    this.loadinglistado = true;

    this.notacreditoservice.listarNotasCreditos(fechadesde, fechahasta, opcion, this.cod_sucursal, "0", "0", "0", "0").subscribe( (data : any) =>
    {
      this.datos = data;
      this.loadinglistado = false;
      this.cantidad_notas = data.length;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
    });
  }

  listarGuiaRemision(op : number)
  {
    this.pageguiaremision = 0;
    this.datos = [];
    this.filterpost = "";

    $("#mymodallistarguiasremision").modal("show");

    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth();
    let firstDay = new Date(y, m, 1);
    let lastDay = new Date(y, m + 1, 0);

    let fechadesde = moment(firstDay).format('YYYY-MM-DD');
    let fechahasta = moment(lastDay).format('YYYY-MM-DD');
 
    this.loadinglistado = true;
    

    let opcion="";

    if(op==1)
    {
        opcion = "electronica_creada";
    }
    
    if(op==2)
    {
        opcion = "electronica_envio";
    }

    this.loadinglistado = true;
    this.guiaremisionservice.listarGuiasRemision(fechadesde, fechahasta, opcion, this.cod_sucursal, "0", "0", "0").subscribe( (data : any) =>
    {
      this.datos = data;
      this.loadinglistado = false;
      this.cantidad_guias = data.length;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
    });
  }

  listarRetenciones(op : number)
  {
    this.pageretencion = 0;
    this.datos = [];
    this.filterpost = "";
    
    $("#mymodallistarretenciones").modal("show");

    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth();
    let firstDay = new Date(y, m, 1);
    let lastDay = new Date(y, m + 1, 0);

    let fechadesde = moment(firstDay).format('YYYY-MM-DD');
    let fechahasta = moment(lastDay).format('YYYY-MM-DD');
 
    this.loadinglistado = true;
    
    let opcion="";

    if(op==1)
    {
        opcion = "electronica_creada";
    }
    
    if(op==2)
    {
        opcion = "electronica_envio";
    }

    this.retencionservice.listarRetencionesCompras(fechadesde, fechahasta, opcion, this.cod_sucursal, "0").subscribe( (data : any) =>
      {
        this.datos = data;
        this.loadinglistado = false;
        this.cantidad_retenciones = data.length;
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.loadinglistado = false;
      });
  }

  recibirDatosEstadoNotaCredito(item: any): void {
    const notacredito = this.datos.find((x: any) => x.cod_nota_credito == item.cod_nota_credito);
    if (notacredito)
    {
      notacredito.estado = item.estado;
      notacredito.fecha_hora = item.fecha_hora;
      notacredito.error_sri = item.error_sri;
    }
  }

  recibirDatosCorreoNotaCredito(item: any): void {
    this.datos.find((x:any) => x.cod_nota_credito === item.cod_nota_credito).envio = item.envio;
  }

  recibirDatosEstadoGuiaRemision(item: any): void {
    const guiaremision = this.datos.find((x: any) => x.cod_guia_remision == item.cod_guia_remision);
    if (guiaremision)
    {
      guiaremision.estado = item.estado;
      guiaremision.fecha_hora = item.fecha_hora;
      guiaremision.error_sri = item.error_sri;
    }
  }

  recibirDatosCorreoGuiaRemision(item: any): void {
    this.datos.find((x:any) => x.cod_guia_remision === item.cod_guia_remision).envio = item.envio;
  }

  recibirDatosEstadoRetencion(item: any): void {
    this.datos.find((x:any) => x.cod_retencion === item.cod_retencion).estado = item.estado;
  }

  recibirDatosCorreoRetencion(item: any): void {
    this.datos.find((x:any) => x.cod_retencion === item.cod_retencion).envio = item.envio;
  }

  changeCheckedTodos(event: any) {
    const isChecked = event.target.checked;

    const estadosPermitidos = ["CREADA", "EN PROCESO", "DEVUELTA", "NO AUTORIZADO"];

    this.datos = this.datos.map(item => ({
      ...item,
      seleccion: (estadosPermitidos.includes(item.estado) && item.estado_recaudado == 1) ? isChecked : item.seleccion
    }));
  }

  changeChecked(item: any) {
      item.seleccion = !item.seleccion;
  }

  async clickComprobarEstados()
  {
    const seleccionados = this.datos.some(item => item.seleccion == true);
    if(seleccionados)
    {
        const ok = await this.swalservice.alertConfirmNoRequerido({
          title: "Comprobación de Documentos",
          text: "Desea verificar y actualizar los estados de los comprobantes seleccionados",
          icon: "info",
          confirmText: "Si, Comprobar",
          cancelText: "No, Cerrar"
        });

        if (ok)
        {
          this.procesarComprobarEstados();
        }
    }
    else
    {
      this.presentarMensaje("Selecciona al menos un comprobante para verificar y actualizar los estados", "info");
    }
  }

  verificarProceso(item: any)
  {
    let valor = true;
    
    if(item.estado_recaudado==1)
    {
      valor = false;
    }
    
    return valor;
  }

  async procesarComprobarEstados(): Promise<void> {
    this.checktodos = false;
    this.datos = this.datos.map(obj => ({ ...obj, fila_error: false, mensajesri: "" }));
    this.swalservice.iniciarLoading("Procesando con el SRI...");
    for (const item of this.datos) {
      if (item.seleccion) {
        try
        {
          await this.iniciarVerificacionEstado(item, "comprobar");
        } catch (error) {
          item.fila_error = true;
        }
      }
    }
    this.swalservice.close();
    const error = this.datos.some(item => item.fila_error == true);
    if(error)
    {
      this.presentarMensaje("Se verificó y en algunos comprobantes no se creó el Ride o no se enviaron al correo electrónico por correo incorrecto, revise los comprobantes sus estados", "warning");
    }
    else
    {
      this.presentarMensaje("Se verificaron los estados de los comprobantes", "info");
    }
    this.datos = this.datos.map(obj => ({ ...obj, seleccion: false }));
  }

  presentarMensaje(texto: string, tipo: 'success' | 'error' | 'warning' | 'info' | 'question')
  {
    this.swalservice.alertOkSimple({
      title: "Control del Sistema",
      text: texto,
      icon: tipo
    });
  }

  async iniciarVerificacionEstado(item: any, proceso: string)
  {
      let facturaventa1: FacturaVentaDTO = new FacturaVentaDTO;
      facturaventa1.cod_factura_venta = item.cod_factura_venta;
      facturaventa1.claveacceso = item.claveacceso;
      facturaventa1.fecha_registro_hora = item.fecha_hora;
      facturaventa1.estado = item.estado;
      facturaventa1.numero_factura = item.numero_factura;

      const cod_proyecto = this.cod_proyecto;
      const codigo_iva = this.codigo_iva;
      const error_sri = item.error_sri;

      const resultado = await this.sriventa.iniciarProcesoFacturacionComprobar(cod_proyecto, facturaventa1, codigo_iva, error_sri);
      
      item.fila_error = resultado.error_proceso;

      if(resultado.estado_sri)//AUTORIZADOS, EN PROCESOS, DEVUELTA, NO AUTORIZADOS
      { 
        if(resultado.confirmar_envio == "SI")
        {
          if(proceso=="comprobar")
          {
            item.estado = resultado.estado;
            item.fecha_hora = resultado.fecha_hora;
            item.fila_error = true;
          }
          else
          {
            await this.confirmarEnvioComprobante(item);
          }
        }
        else
        {
          if(resultado.estado=="AUTORIZADO")
          {
            item.estado = resultado.estado;
            item.fila_error = false;
            if(resultado.envio== "SI")
            {
              this.toastr.success("Correo enviado satisfactoriamente al cliente", "INFORMACIÓN DEL SISTEMA");
              item.envio = 'ENVIADO';
            }
            else
            {
              item.mensajesri = "No se envió correo";
            }
            item.fecha_hora = resultado.fecha_hora;
          }
          else
          {
            item.estado = resultado.estado;
            item.fila_error = true;
          }
          
          
        }
      }
      else
      {
        if(proceso=="comprobar")
        {
          item.mensajesri = "No se ha enviado en el SRI";
        }
        else
        {
          if(resultado.confirmar_envio == "SI")
          {
            await this.confirmarEnvioComprobante(item);
          }
          else
          {
            if(resultado.tiempo_espera_envio == "SI")
            {
              item.mensajesri = "Debe esperar 24 Horas para enviar";
            }
            else//Reenvio
            {
              if(resultado.confirmar_reenvio == "SI")
              {
                await this.confirmarReenvioComprobante(item);
              }
            }
          }
        }
      }
  }

  async clickEnviarSri()
  {
    const seleccionados = this.datos.some(item => item.seleccion == true);
    if(seleccionados)
    {
        const ok = await this.swalservice.alertConfirmNoRequerido({
          title: "Comprobación de Documentos",
          text: "Desea enviar los comprobantes seleccionados",
          icon: "info",
          confirmText: "Si, Enviar",
          cancelText: "No, Cerrar"
        });

        if (ok)
        {
          this.procesarEnvioSri();
        }
    }
    else
    {
      this.presentarMensaje("Selecciona al menos un comprobante para verificar y actualizar los estados", "info");
    }
  }

  async procesarEnvioSri(): Promise<void> {
    this.checktodos = false;
    this.datos = this.datos.map(obj => ({ ...obj, fila_error: false, mensajesri: "" }));
    this.swalservice.iniciarLoading("Procesando con el SRI...");
    for (const item of this.datos) {
      if (item.seleccion) {
        try
        {
          await this.iniciarVerificacionEstado(item, "enviarsri");
        } catch (error) {
          item.fila_error = true;
        }
      }
    }
    this.swalservice.close();
    const error = this.datos.some(item => item.fila_error == true);
    if(error)
    {
      this.presentarMensaje("No se pudo actualizar o enviar algunos comprobantes al SRI, revisa para que puedas enviar de nuevo", "error");
    }
    else
    {
      this.presentarMensaje("Se finalizó el proceso de envío de los comprobantes", "info");
    }
    this.datos = this.datos.map(obj => ({ ...obj, seleccion: false }));
  }

  async confirmarEnvioComprobante(item: any)
  {
    const cod_proyecto = this.cod_proyecto;
    await this.sriventa.actualizarFechaClaveAccesoActual(item.cod_factura_venta, item.numero_factura, item.ruc_sucursal, item.tipo_ambiente, item.serieestab, item.ptoemi);

    const { cliente, rucempresa, facturaventa, formapago, datosdetalles } = await this.sriventa.buscarFactura(item.cod_factura_venta, this.codigo_iva);
    
    const resultado = await this.sriventa.iniciarProcesoFacturacion(cod_proyecto, cliente, rucempresa, facturaventa, formapago, datosdetalles, "envio");

    item.estado = resultado.estado;
    item.fecha_hora = resultado.fecha_hora;
    if(resultado.estado=="AUTORIZADO")
    {
      item.fila_error = false;
      if(resultado.envio== "SI")
      {
        this.toastr.success("Correo enviado satisfactoriamente al cliente", "INFORMACIÓN DEL SISTEMA");
        item.envio="ENVIADO";
      }
      else
      {
        item.mensajesri = resultado.mensaje;
      }
    }
    else
    {
      item.fila_error = true;
    }
    item.error_sri = resultado.error_sri;
  }

  async confirmarReenvioComprobante(item: any)
  {
    const cod_proyecto = this.cod_proyecto;
    const { cliente, rucempresa, facturaventa, formapago, datosdetalles } = await this.sriventa.buscarFactura(item.cod_factura_venta, this.codigo_iva);

    const resultado = await this.sriventa.iniciarProcesoFacturacion(cod_proyecto, cliente, rucempresa, facturaventa, formapago, datosdetalles, "reenvio");

    item.estado = resultado.estado;
    item.fecha_hora = resultado.fecha_hora;
    if(resultado.estado=="AUTORIZADO")
    {
      item.fila_error = false;
      if(resultado.envio== "SI")
      {
        this.toastr.success("Correo enviado satisfactoriamente al cliente", "INFORMACIÓN DEL SISTEMA");
        item.envio="ENVIADO";
      }
      else
      {
        item.mensajesri = "No se envió correo";
      }
    }
    else
    {
      item.fila_error = true;
    }
    item.error_sri = resultado.error_sri;
  }
}
