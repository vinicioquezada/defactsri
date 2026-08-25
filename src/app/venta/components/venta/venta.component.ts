import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { VentaService } from '../../services/venta.service';
import { EmpleadoService } from 'src/app/administrar/services/empleado.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ListadoProductoVentasComponent } from 'src/app/shared/components/listado-producto/listado-producto-ventas/listado-producto-ventas.component';
import { ListadoClienteVentaComponent } from 'src/app/shared/components/venta/listado-cliente-venta/listado-cliente-venta.component';
import { ClienteFormComponent } from '../cliente/cliente-form/cliente-form.component';
declare var $:any;
import { DetalleVentaComponent } from 'src/app/shared/components/detalle-venta/detalle-venta.component';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { ConfigService } from 'src/app/shared/services/config.service';
import { ClienteService } from '../../services/cliente.service';
import { FacturaVentaDTO } from '../../models/factura-venta.dto';
import { ClienteDTO } from '../../models/cliente.dto';
import { RegistroAbonoVentaComponent } from 'src/app/shared/components/registro-abono-venta/registro-abono-venta.component';
import { RecargoFacturaComponent } from 'src/app/shared/components/recargo-factura/recargo-factura.component';
import { FormaPagoComponent } from 'src/app/shared/components/forma-pago/forma-pago.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { UsuarioService } from 'src/app/administrar/services/usuario.service';
import { CajeroService } from '../../services/cajero.service';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';
import { NotaCreditoService } from 'src/app/venta/services/nota-credito.service';
import { TransaccionesBancoComponent } from 'src/app/shared/components/venta/transacciones-banco/transacciones-banco.component';
import { RucEmpresaDTO } from 'src/app/usuario/models/rucempresa.dto';
import { RucEmpresaService } from 'src/app/usuario/services/ruc-empresa.service';
import { CompensacionComponent } from 'src/app/shared/components/compensacion/compensacion.component';
import { SaldoNotaCreditoService } from '../../services/saldo-nota-credito.service';
import { FirmaUsuarioService } from 'src/app/usuario/services/firma-usuario.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { lastValueFrom } from 'rxjs';
import { SriVentaService } from 'src/app/shared/services/sri-venta.service';
import { ImpresionService } from 'src/app/shared/services/impresion.service';
import { SwalService } from 'src/app/shared/services/swal.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {
  
  opcionesprivilegios : any;
  cod_proyecto : string = "";
  multisucursal : string = "0";
  electronico : string = "0";
  defecto_venta : string = "";
  numeracion_automatica : string = "";
  comision_venta : string = "";
  kardex : string = "";
  afiliacion_cliente : string = "0";
  modificacion_supervisor : string = "";
  control_estricto_cajero : string = "";

  @ViewChild(ListadoClienteVentaComponent) childlistadocliente!: ListadoClienteVentaComponent;
  @ViewChild(ListadoProductoVentasComponent) childlistadoproductoventas!: ListadoProductoVentasComponent;
  @ViewChild(ClienteFormComponent) clienteformcomponent: any;
  @ViewChild(DetalleVentaComponent) childdetalleventa: any;
  @ViewChild(RegistroAbonoVentaComponent) childregistroabonoventa: any;
  @ViewChild(RecargoFacturaComponent) childrecargofactura: any;
  @ViewChild(FormaPagoComponent) childformapago: any;
  @ViewChild(TransaccionesBancoComponent) childtransaccionbanco: any;
  @ViewChild(CompensacionComponent) childcompensacion: any;

  @ViewChild("txtcodigobarra") txtcodigobarra: ElementRef;

  datosrucempresa : any;
  datosempleados : any;

  datostipoventa : any;

  disabledbtnnuevo : boolean = true;
  disabledbtncambio : boolean = true;
  disabledbtnguardar: boolean = true;
  disabledbtnimprimir : boolean = true;

  disabledbtnlistarcliente : boolean = true;
  disabledbtnagregarcliente : boolean = true;

  chkimpuesto : boolean = true;
  disabledchkimpuesto : boolean = true;
  disabledtxtcodigobarra : boolean = true;
  disabledbtnlistarproducto : boolean = true;

  disabledcmbtipoventa : boolean = true;
  disabledtxtnfactura : boolean = true;
  disabledtxtfecha : boolean = true;
  disabledcmbrecargo : boolean = true;
  disabledformapago : boolean = true;
  disabledtransaccionbanco : boolean = true;
  chkcontado : boolean = true;
  disabledchkcontado : boolean = true;
  disabledbtncalcular : boolean = true;
  
  facturaventa: FacturaVentaDTO = new FacturaVentaDTO;

  colormensaje : string = "";
  textomensaje : string = "";

  cliente: ClienteDTO = new ClienteDTO;
  rucempresa: RucEmpresaDTO = new RucEmpresaDTO;

  codigo_barra : string = "";

  //formapago: FormaPagoDTO = new FormaPagoDTO;
  //recargo: RecargoDTO = new RecargoDTO;

  flagformapago : boolean = false;

  loading : boolean = false;
  loadingprincipal : boolean = false;

  disabledcmbempleado : boolean = true;
  flagempleado : boolean = false;

  arr_factura_venta : any;

  datosproducto : any = [];
  datostarifasproducto : any = [];

  flagtextoafiliar: boolean = false;
  flagbotonafiliar: boolean = false;
  ocultartransaccionesbanco: boolean = true;
  cantidad_compras : number = 0;

  tipo_formulario: string = "";

  disabledbtnmodificar : boolean = true;
  disabledbtnactualizar: boolean = true;
  disabledbtnsrienviar: boolean = true;
  detallesactualizar : any = [];

  estado_pedido : number = 0;
  cod_pedido : any = [];
  excluir : number = 0;

  recaudador: string = "";
  estado_recaudado: string = "1";

  tipo_venta_anterior: string = "0"

  excluir_general: number = 0;

  notacreditoexistente : string = "0";

  numerofacturatemporal = "";

  estado_recaudado_anterior: string = "";
  fecha_registro_anterior: string = "";

  firmasruc: string = "";
  cod_sucursal_estable: string = "";
  sucursal_estable: string = "";
  rucusuario: string = "";

  datosenvio: any[] = [];

  impresiondirecta: string = "";

  constructor(private location: Location, private ventaservice : VentaService, private cajeroservice: CajeroService, private toastr : ToastrService, private error : ErrorService, private rucempresaservice : RucEmpresaService, private empleadoservice : EmpleadoService, private usuarioservice: UsuarioService, private clienteservice:ClienteService, private rutaActiva: ActivatedRoute, private bodyStyleService: BodyStyleService, private notacreditoservice: NotaCreditoService, private saldonotacreditoservice: SaldoNotaCreditoService, private firmausuarioservice: FirmaUsuarioService, private usersession: UserSessionService, private router: Router, private sriventa: SriVentaService, private impresionservice: ImpresionService, private configService: ConfigService, private swalservice: SwalService)
  {
    const navigation = this.router.getCurrentNavigation();
    this.datosenvio = navigation?.extras?.state?.['datosenvio'] || [];
  }

  ngOnInit(): void {
    this.tipo_formulario = this.rutaActiva.snapshot.paramMap.get("tipo_formulario")!;

    const formulariosValidos = [
      "finalizarvariospedidosreservados",
      "finalizarvariospedidosconsalida",
      "finalizarvariospedidosacumulativos"
    ];
    
    if (!this.datosenvio?.length && formulariosValidos.includes(this.tipo_formulario)) {
      this.goBack();
    }

    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.electronico = this.usersession.getConfiguracion("electronico");
    this.defecto_venta = this.usersession.getConfiguracion("defecto_venta");
    this.facturaventa.tipo_venta = this.defecto_venta;
    this.numeracion_automatica = this.usersession.getConfiguracion("numeracion_automatica");
    this.comision_venta = this.usersession.getConfiguracion("comision_venta");
    this.datosrucempresa = [];
    this.rucempresa.cod_ruc = this.usersession.getConfiguracion("cod_ruc");
    this.kardex = this.usersession.getConfiguracion("kardex");
    this.afiliacion_cliente = this.usersession.getConfiguracion("afiliacion_cliente");
    this.facturaventa.iva = Number(this.usersession.getConfiguracion("iva"));
    this.facturaventa.codigo_iva = Number(this.usersession.getConfiguracion("codigo_iva"));
    this.modificacion_supervisor = this.usersession.getConfiguracion("modificacion_supervisor");
    this.control_estricto_cajero = this.opcionesprivilegios["controlestrictocajero"];
    this.recaudador = this.usersession.getConfiguracion("recaudador");
    this.firmasruc = this.usersession.getConfiguracion("firmasruc");
    this.cod_sucursal_estable = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursal_estable = this.usersession.getConfiguracion("sucursal");
    this.rucusuario = this.usersession.getConfiguracion("ruc_usuario");
    this.impresiondirecta = this.opcionesprivilegios["activarimpresiondirecta"];
    
    this.datostipoventa = [];

    if(this.tipo_formulario == "nuevoregistro")
    {
      if(this.control_estricto_cajero == "1")
      {
        if(this.recaudador == "1")
        {
          this.estado_recaudado = "0";
          this.verificarCajaAbiertaUsuarioRecaudador();
        }
        else
        {
          this.estado_recaudado = "1";
          this.verificarCajaAbiertaUsuario();
        }
       
      }
      else
      {
        this.cargaInicioVenta();
      }
    }
    else
    {
      if(this.recaudador == "1")
      {
        this.estado_recaudado = "0";
      }
      else
      {
        this.estado_recaudado = "1";
      }
      this.cargaInicioVenta();
    }

    this.bodyStyleService.resetBodyStyles();
  }

  ngAfterViewInit(): void {
    //this.childformapago.formularioNormal();
  }

 async verificarCajaAbiertaUsuario()
 {
    try
    {
    this.loading = true;
    const data: any = await lastValueFrom(this.cajeroservice.verificarCajaAbiertaUsuario(this.cod_sucursal_estable));
    
      this.loading = false;
      if(data.cod_cajero==false)
      {
        const ok = await this.swalservice.alertOkRequerido({
          title: "Control del Sistema",
          text: 'Debe aperturar caja primero antes de realizar venta'
        });

        if (ok) {
          this.location.back();
        }
      }
      else
      {
        this.cargaInicioVenta();
      }

    } catch (err: any) {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    }
  }

  async verificarCajaAbiertaUsuarioRecaudador()
  {
    try
    {
    this.loading = true;
    const data: any = await lastValueFrom(this.cajeroservice.verificarCajaAbiertaUsuarioRecaudador(this.cod_sucursal_estable));
    
      this.loading = false;
      if(data.cod_cajero==false)
      {
        const ok = await this.swalservice.alertOkRequerido({
          title: "Control del Sistema",
          text: 'Debe aperturar caja primero antes de realizar venta'
        });

        if (ok) {
          this.location.back();
        }
      }
      else
      {
        this.cargaInicioVenta();
      }
    } catch (err: any) {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    }
  }

  cargaInicioVenta()
  {
    if(this.electronico == '1')
      {
        let tipoventa = {
          "cod_tipo_venta" : "ELECTRONICA",
          "tipo_venta" : "ELECTRONICA"
        };
        this.datostipoventa.push(tipoventa);
      }
      else
      {
        let tipoventa = {
          "cod_tipo_venta" : "FACTURA",
          "tipo_venta" : "FACTURA"
        };
        this.datostipoventa.push(tipoventa);
      }
      
      let tipoventa = {
        "cod_tipo_venta" : "RECIBO",
        "tipo_venta" : "RECIBO"
      };
      this.datostipoventa.push(tipoventa);
  
      if(this.tipo_formulario == "nuevoregistro" || this.tipo_formulario == "actualizarregistro" || this.tipo_formulario == "copiarregistro")
      {
        /*
        if(this.tipo_formulario != "actualizarregistro")
        {
          let tipoventa = {
            "cod_tipo_venta" : "PROFORMA",
            "tipo_venta" : "PROFORMA"
          };
          this.datostipoventa.push(tipoventa);
        }
        */
       let tipoventa = {
          "cod_tipo_venta" : "PROFORMA",
          "tipo_venta" : "PROFORMA"
        };
        this.datostipoventa.push(tipoventa);

        this.estado_pedido = 0;
        this.cod_pedido = "";
        this.excluir = 0;
      }
      else
      {
        if(this.tipo_formulario == "finalizarpedidoreservado" || this.tipo_formulario == "finalizarvariospedidosreservados")
        {
          let cod_pedido = this.rutaActiva.snapshot.paramMap.get("cod_factura_venta")!;
          this.estado_pedido = 1;
          this.cod_pedido = [{ cod_factura_venta: cod_pedido }];
          this.excluir = 1;
        }

        if(this.tipo_formulario == "finalizarpedidoconsalida" || this.tipo_formulario == "finalizarvariospedidosconsalida")
        {
          let cod_pedido = this.rutaActiva.snapshot.paramMap.get("cod_factura_venta")!;
          this.estado_pedido = 1;
          this.cod_pedido = [{ cod_factura_venta: cod_pedido }];
          this.excluir = 2;
        }

        if(this.tipo_formulario == "finalizarpedidoacumulativo" || this.tipo_formulario == "finalizarvariospedidosacumulativos")
        {
          let cod_pedido = this.rutaActiva.snapshot.paramMap.get("cod_factura_venta")!;
          this.estado_pedido = 1;
          this.cod_pedido = [{ cod_factura_venta: cod_pedido }];
          this.excluir = 3;
        }

        if(this.tipo_formulario == "finalizarpedidopanaderia")
        {
          let cod_pedido = this.rutaActiva.snapshot.paramMap.get("cod_factura_venta")!;
          this.estado_pedido = 1;
          this.cod_pedido = [{ cod_factura_venta: cod_pedido }];
          this.excluir = 4;
        }

        if(this.datosenvio && this.datosenvio.length > 0)
        {
          this.cod_pedido = this.datosenvio;
        }

      }
    
      if(this.tipo_formulario == "nuevoregistro")
      {
        this.listarRucEmpresas();
        if(this.comision_venta=='1')
        {
          this.listarEmpleados();
        }
      }
      else
      {
        if(this.tipo_formulario == "actualizarregistro")
        {
          if(this.comision_venta=='1')
          {
            this.listarEmpleados();
          }
          this.formularioNormal();
        }
        else
        {
          if(this.tipo_formulario == "copiarregistro" || this.tipo_formulario == "finalizarpedidoreservado" || this.tipo_formulario == "finalizarvariospedidosreservados" || this.tipo_formulario == "finalizarpedidoconsalida" || this.tipo_formulario == "finalizarvariospedidosconsalida" || this.tipo_formulario == "finalizarpedidoacumulativo" || this.tipo_formulario == "finalizarvariospedidosacumulativos" || this.tipo_formulario == "finalizarpedidopanaderia")
          {
            this.listarRucEmpresas();
            if(this.comision_venta=='1')
            {
              this.listarEmpleados();
            }
            this.formularioNormal();
          }
        }
      }
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
    this.ventaservice.claveAccesoActualizar(this.facturaventa.numero_factura, this.rucempresa.serieestab, this.rucempresa.ptoemi, this.facturaventa.fecha_registro, this.rucempresa.ruc, this.rucempresa.tipoambiente).subscribe( (data : any) =>
    {
      this.loading = false;
      this.facturaventa.claveacceso = data.claveacceso;
    }, err => {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  clickNuevo()
  {
    if(this.datosrucempresa.length>0)
    {
      this.disabledbtnnuevo = true;
      this.loading = true;
      
      
        const result = this.childlistadoproductoventas.listarProductosVentasPorSucursal(this.cod_sucursal_estable, this.rucempresa.tipo_ruc).then();
        result.then(() => { 
          this.formularioNormal();
          this.habilitarFormulario();
  
          this.childdetalleventa.datosdetalles = [];
          this.verificarRegistro();
         
          this.datosproducto = this.childlistadoproductoventas.datosproducto;
          this.datostarifasproducto = this.childlistadoproductoventas.datostarifasproducto;
          this.loading = false;
          
        }).catch(() => {
          this.loading = false;
          this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
        });
    }
    else
    {
      this.toastr.warning("Presiona F5 o Recarga la página, no se completó la conexión correctamente debido error de conectividad", "INFORMACIÓN DEL SISTEMA");
    }
  }

  async clickModificar()
  {
    this.disabledbtnmodificar = true;
    if(this.modificacion_supervisor == '1')
    {
      const password = await this.swalservice.alertPasswordRequerido({
        title: 'Supervisión de Edición',
        text: 'Ingrese contraseña de supervisor'
      });

      if (password) {
        this.revisarPasswordSupervisor(password);
      }
    }
    else
    {
      if(this.opcionesprivilegios.bloqueoedicionventasrecaudacion==1)
      {
        if(this.recaudador == "1") {
          this.verificarRecaudacionFactura();
        } else {
          this.modificar();
        }
      }
      else
      {
        this.modificar();
      }
    }
  }

  verificarRecaudacionFactura()
  {
    this.loading = true;
    this.ventaservice.verificarRecaudacionFactura(this.facturaventa.cod_factura_venta).subscribe( (data : any) =>
    {
      this.loading = false;
        if(data.estado_recaudado == 1) {
          this.toastr.warning("El comprobante de venta está recaudado, no se puede modificar, no tiene los permisos", "INFORMACIÓN DEL SISTEMA");
        } else {
          this.modificar();
          
        }
    }, err => {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  revisarPasswordSupervisor(password_supervisor: string)
  {
    this.loading = true;
    this.usuarioservice.revisarPasswordSupervisor(password_supervisor).subscribe( (data : any) =>
    {
      this.loading = false;
      if(data.cod_usuario==false)
      {
        this.toastr.error("Contraseña de Supervisión es Incorrecta", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.modificar();
      }
    }, err => {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  modificar()
  {
    this.loading = true;
    if(this.facturaventa.estado!="AUTORIZADO")
    {
      const result = this.childlistadoproductoventas.listarProductosVentasPorSucursal(this.cod_sucursal_estable, this.rucempresa.tipo_ruc).then();
      result.then(() => { 
        
        this.habilitarFormulario();

        
        if(this.facturaventa.tipo_venta=="PROFORMA") {
          this.disabledchkcontado = true;
          this.disabledcmbtipoventa = true;
          this.disabledformapago = true;
        } else {
          
          if(this.childrecargofactura.recargo.cod_transaccion_tarjeta==0)
          {
            this.disabledchkcontado = false;
            this.disabledbtncalcular = false;
          }
          else
          {
            this.disabledchkcontado = true;
            this.disabledbtncalcular = true;
          }

        }
        

        this.childlistadocliente.listarClientes();
        
        this.datosproducto = this.childlistadoproductoventas.datosproducto;
        this.datostarifasproducto = this.childlistadoproductoventas.datostarifasproducto;
        this.loading = false;
        
      }).catch(() => {
        this.loading = false;
        this.disabledbtnmodificar = false;
        this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
      });
    }
    else
    {
      this.loading = false;
      this.disabledchkcontado = false;
      this.disabledbtnmodificar = true;
      this.disabledbtnactualizar = false;
      this.disabledtransaccionbanco = false;
      this.disabledformapago = false;
    }
  }

  clickHabilitar()
  {
    if(this.datosrucempresa.length>0)
    {
      this.disabledbtnmodificar = true;
      this.loading = true;
      
      
        const result = this.childlistadoproductoventas.listarProductosVentasPorSucursal(this.cod_sucursal_estable, this.rucempresa.tipo_ruc).then();
        result.then(() => { 
          //this.formularioNormal();
          this.habilitarFormulario();
  
          //this.childdetalleventa.datosdetalles = [];
          //let element = document.getElementById("box");
          //element.scrollIntoView({ behavior: "smooth", block: "start" });
          this.verificarRegistro();
         
          this.datosproducto = this.childlistadoproductoventas.datosproducto;
          this.datostarifasproducto = this.childlistadoproductoventas.datostarifasproducto;
          this.loading = false;
          
        }).catch(() => {
          this.loading = false;
          
          this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
        });
    }
    else
    {
      this.toastr.warning("Presiona F5 o Recarga la página, no se completó la conexión correctamente debido error de conectividad", "INFORMACIÓN DEL SISTEMA");
    }
  }
  
  changeEmpleado(event: any): void {
    const elemento = event.target.value;
    this.facturaventa.cod_empleado = elemento;
  }

  async changeEmpresa(event: any) {
    const elemento = event.target.value;
    if(this.tipo_formulario == "nuevoregistro")
    { 
      const ok = await this.swalservice.alertConfirmRequerido({
        title: "Información del Sistema",
        text: '¿Estás seguro de cambiar la firma del documento?',
        icon: "info",
        confirmText: "Sí, Continuar",
        cancelText: "No, Cerrar"
      });

      if (ok) {
        this.rucempresa.cod_ruc = elemento;
        this.buscarRuc();
        //this.clickNuevo();
      } else {
        event.target.value = this.rucempresa.cod_ruc;
      }
    }
    else
    {
      if(this.tipo_formulario == "copiarregistro" || this.tipo_formulario == "finalizarpedidoreservado" || this.tipo_formulario == "finalizarvariospedidosreservados" || this.tipo_formulario == "finalizarpedidoconsalida" || this.tipo_formulario == "finalizarvariospedidosconsalida" || this.tipo_formulario == "finalizarpedidoacumulativo" || this.tipo_formulario == "finalizarvariospedidosacumulativos" || this.tipo_formulario == "finalizarpedidopanaderia")
      {
        const ok = await this.swalservice.alertConfirmRequerido({
          title: "Información del Sistema",
          text: '¿Estás seguro de cambiar la firma del documento?',
          icon: "warning",
          confirmText: "Sí, Continuar",
          cancelText: "No, Cerrar"
        });

        if (ok) {
          this.rucempresa.cod_ruc = elemento;
          this.buscarRuc();
        } else {
          event.target.value = this.rucempresa.cod_ruc;
        }

      }
    }
  }

  buscarRuc()
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
    this.rucempresa.tipo_ruc = resultado.tipo_ruc;
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

    const fecha_caducidad_firma = resultado.fecha_caducidad_firma;

    if(fecha_caducidad_firma!="2000-01-01 00:00:00")
    {
        const fechacaduca = moment(fecha_caducidad_firma, "YYYY-MM-DD HH:mm:ss");
        const fechaactual = moment();

        const sietediasantes = fechacaduca.clone().subtract(3, 'days');

        if (fechaactual.isBetween(sietediasantes, fechacaduca))
        {
            const diasrestantes = fechacaduca.diff(fechaactual, 'days');

            this.swalservice.alertOkSimple({
              title: "Información del Sistema",
              text: `La firma electrónica de ${this.rucempresa.razon_social} caduca en ${diasrestantes + 1} día(s) ${fecha_caducidad_firma} 
                      Renueve la firma y contacte con el proveedor del sistema.`,
              icon: "warning"
            });
        }

        if (fechaactual.isAfter(fechacaduca))
        {
            this.swalservice.alertOkSimple({
              title: "Firma Caducada",
              text: `La firma electrónica ${this.rucempresa.razon_social} ya se encuentra caducada, fecha de caducidad ${fecha_caducidad_firma}`,
              icon: "error"
            });
        }
    }

    this.disabledbtnnuevo = false;
  }

  sendChangeRecargo(valor: any) {
    this.facturaventa.deudor = 0;
    this.chkcontado = true;
   
    this.childdetalleventa.reiniciarPorcentajeTarifa();
    this.facturaventa.diferencia = "";
    this.facturaventa.diferenciavalor="";
    this.facturaventa.recibido = "";
    this.facturaventa.recibidoabono = "0";
    if(this.tipo_formulario == "finalizarpedidoreservado" || this.tipo_formulario == "finalizarvariospedidosreservados" || this.tipo_formulario == "finalizarpedidoconsalida" || this.tipo_formulario == "finalizarvariospedidosconsalida" || this.tipo_formulario == "finalizarpedidoacumulativo" || this.tipo_formulario == "finalizarvariospedidosacumulativos" || this.tipo_formulario == "finalizarpedidopanaderia")
    {
      this.disabledchkcontado = true;
      this.disabledbtncalcular = true;
    }
    else
    {
      this.disabledchkcontado = valor.disabledchkcontado;
      this.disabledbtncalcular = valor.disabledbtncalcular;
    }
    //this.formapago = valor.formapago;
  }

  sendChangeTarjetaTarifa(tarifa_recargo: number) {
    this.childdetalleventa.reiniciarPorcentajeTarifa();
    //this.formapago = formapago;
    this.childdetalleventa.aplicarPorcentajeTarifa(tarifa_recargo);
  }

  sendChangeFormaPago() {
    const existe = this.childformapago.datosformapagoseleccion.some(formapago => formapago.id_forma_pago == "20");
    if (existe) {
      this.ocultartransaccionesbanco = false;
    } else {
      this.childtransaccionbanco.datostransaccionbanco = [];
      this.ocultartransaccionesbanco = true;
    }
  }
  
  /*
  changeChkImpuesto()
  {
    if(this.chkimpuesto==true){
      this.chkimpuesto = false;
      this.childlistadoproductoventas.chkimpuesto = false;
    }else{
      this.chkimpuesto = true;
      this.childlistadoproductoventas.chkimpuesto = true;
    }
  }
  */

  changeChkContado()
  {
    if(this.chkcontado==true){
      this.chkcontado = false;
      this.facturaventa.deudor=1;
      this.facturaventa.tipo_credito=1;
      this.facturaventa.diferencia="";
      this.facturaventa.diferenciavalor="";
      this.facturaventa.recibido="";
      this.facturaventa.recibidoabono="0";
      this.toastr.warning("Se registrara como cuenta por cobrar el documento.", "INFORMACIÓN DEL SISTEMA");
      this.childdetalleventa.observacion = "VENTA A CREDITO";
      this.disabledbtncalcular = true;
      this.childformapago.ubicarFormaPagoDeudor();
      this.childcompensacion.formularioNormal();
    }else{
      this.childdetalleventa.observacion = "";
      this.chkcontado = true;
      this.facturaventa.deudor=0;
      this.facturaventa.tipo_credito=0;
      this.facturaventa.diferencia="";
      this.facturaventa.diferenciavalor="";
      this.facturaventa.recibido="";
      this.facturaventa.recibidoabono="0";
      this.disabledbtncalcular = false;
    }
  }
  
  clickVerificar()
  {
    if(this.facturaventa.fecha_registro.length == 0)
    {
      this.toastr.warning("Seleccione una fecha de registro para registrar", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      if (this.facturaventa.importetotal == 0)
      {
        this.toastr.warning("El total a cobrar está en 0, no se puede guardar o actualizar comprobantes en valores 0", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        let importesumadoformapago = redondeardecimales(this.childformapago.datosformapagoseleccion.reduce((suma, item) => suma + parseFloat(item.valor), 0), 2);
         if(importesumadoformapago == this.facturaventa.importetotal)
         {
          if(this.facturaventa.tipo_venta == "ELECTRONICA" || this.facturaventa.tipo_venta == "RECIBO" || this.facturaventa.tipo_venta == "PROFORMA")
            {
              this.verificaDetalles();
            }
            else
            {
              let numeracionautomatica = parseInt( this.numeracion_automatica );
              if(numeracionautomatica==1)
              {
                this.verificaDetalles();
              }
              else
              {
                if (this.facturaventa.numero_factura.length == 0)
                {
                  this.toastr.warning("Ingrese Numero de Factura por favor.", "INFORMACIÓN DEL SISTEMA");
                }
                else
                {
                  if(this.tipo_formulario == "actualizarregistro")
                  {
                    if(this.facturaventa.numero_factura == this.numerofacturatemporal)
                    {
                      this.verificaDetalles();
                    }
                    else
                    {
                      this.buscarNFactura();
                    }
                  }
                  else
                  {
                    this.buscarNFactura();
                  }
                }
              }
            }
         }
         else
         {
          this.toastr.warning("Los valores de la forma pago deben surmarse y ser igual al importe total", "INFORMACIÓN DEL SISTEMA");
         }    
      }
    }
  }

  changeTipoVenta(event: any): void {
    const elemento = event.target.value;
    this.facturaventa.tipo_venta = elemento;

    if(this.facturaventa.tipo_venta=="PROFORMA") {
      this.childlistadoproductoventas.page = 1;
      this.childlistadoproductoventas.filterpost="";
      this.childlistadoproductoventas.listarProductosPorSucursalSinInventario(this.cod_sucursal_estable, this.rucempresa.tipo_ruc);
      this.toastr.success("Listado de productos sin control de inventario actualizado exitosamente", "INFORMACIÓN DEL SISTEMA");
    }

    if(this.facturaventa.tipo_venta=="PROFORMA") {
      this.disabledcmbrecargo = false;
      this.disabledchkcontado = true;
      this.facturaventa.pedido = 0;
      this.childdetalleventa.observacion = "";
      this.chkcontado = true;
      this.facturaventa.deudor=0;
      this.facturaventa.tipo_credito=0;
      this.facturaventa.diferencia="";
      this.facturaventa.diferenciavalor="";
      this.facturaventa.recibido="";
      this.facturaventa.recibidoabono="0";
      this.disabledbtncalcular = true;
      this.disabledchkcontado = true;
      this.disabledformapago = true;
      this.childcompensacion.formularioNormal();
    }
    else
    {
      this.disabledcmbrecargo = false;
      this.disabledchkcontado = false;
      this.facturaventa.pedido = 0;
      this.childdetalleventa.observacion = "";

      if(this.tipo_formulario == "nuevoregistro" || this.tipo_formulario == "copiarregistro")
      {
        this.chkcontado = true;
        this.facturaventa.deudor=0;
      }
      

      this.facturaventa.tipo_credito=0;
      this.facturaventa.diferencia="";
      this.facturaventa.diferenciavalor="";
      this.facturaventa.recibido="";
      this.facturaventa.recibidoabono="0";
      this.disabledbtncalcular = false;
    }
    
  }

  buscarNFactura()
  {
    this.loading = true;
    

    this.ventaservice.buscarNumeroFactura(this.facturaventa.numero_factura).subscribe( (data : any) =>
    {
      if (data.estado == true)
      {
        this.toastr.warning("El Numero de Factura Ingresado ya existe, cambiar el número por favor", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.verificaDetalles();
      }

      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
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
      if(parseFloat(this.facturaventa.recibidoabono) < this.facturaventa.importetotal)
      {
        let item = this.childformapago.datosformapagoseleccion.find( (valor : any) => valor.id_forma_pago == "01" );
        if(item)
        {
          let { saldo_ocupado } = this.childcompensacion.datospagarnotacredito.reduce(
            (acc, item) => {
              const saldo = parseFloat(item.saldo_ocupado) || 0;
              if (item.id_forma_pago == '01') {
                acc.saldo_ocupado += saldo;
              }
              return acc;
            },
            { saldo_ocupado: 0 }
          );

          let importeefectivo  = parseFloat(item.valor) - saldo_ocupado;

          if(importeefectivo<0)
          {
            this.toastr.error("Los valores no coinciden entre la forma de pago con las notas de creditos aplicadas en forma de pago, revise que los valores de pagos sean coherentes", "INFORMACIÓN DEL SISTEMA");
          }
          else
          {
            this.modalGuardar();
          }
        }
        else
        {
          this.modalGuardar();
        }
      }
      else
      {
        this.toastr.error("El abono debe ser menor al valor del importe total", "INFORMACIÓN DEL SISTEMA");
      }
    }


  }

  async modalGuardar()
  {
    if(this.tipo_formulario == "nuevoregistro" || this.tipo_formulario == "copiarregistro" || this.tipo_formulario == "finalizarpedidoreservado" || this.tipo_formulario == "finalizarvariospedidosreservados" || this.tipo_formulario == "finalizarpedidoconsalida" || this.tipo_formulario == "finalizarvariospedidosconsalida" || this.tipo_formulario == "finalizarpedidoacumulativo" || this.tipo_formulario == "finalizarvariospedidosacumulativos" || this.tipo_formulario == "finalizarpedidopanaderia")
    {
      const ok = await this.swalservice.alertConfirmRequerido({
        title: "Guardar Registro de Factura de Venta",
        text: "¿Estás seguro de almacenar registro?",
        icon: "info",
        confirmText: "Sí, Almacenar",
        cancelText: "No, Cerrar"
      });

      if (ok) {
        await this.guardar();
      }
    }
    else
    {
      if(this.tipo_formulario == "actualizarregistro")
      {
        const ok = await this.swalservice.alertConfirmRequerido({
          title: "Actualizar Registro de Factura de Venta",
          text: "¿Estás seguro de actualizar registro?",
          icon: "info",
          confirmText: "Sí, Actualizar",
          cancelText: "No, Cerrar"
        });

        if (ok) {
          await this.actualizar();
        }
      }
    }
  }

  async guardar()
  {
    this.swalservice.iniciarLoading("Almacenando...");

    let detalles = [];
    //console.log(this.childdetalleventa.datosdetalles);
      this.childdetalleventa.datosdetalles.forEach(item => {
        let detalle = {
          'cod_producto' : item.cod_producto,
          'ice' : item.porcentaje_ice,
          'codigo_iva' : item.codigo_iva,
          'iva' : item.porcentaje_iva,
          'cantidad_comprar' : item.cantidad_comprar,
          'cantidad_tarifa' : item.cantidad_tarifa,
          'cantidad_unidad' : item.cantidad_unidad,
          'cantidad_unidad_pedido' : item.cantidad_unidad_pedido,
          'tarifa' : item.tarifa,
          'cod_tarifa' : item.cod_tarifa,
          'detalle' : item.descripcion,
          'precio' : item.precio_base,
          'precio_venta' : item.precio_venta,
          'chkporcentaje' : item.checked,
          'valorporcentaje' : item.descuento,
          'descuento' : item.descuento_calculado,
          'total' : item.total,
          'total_ice' : item.ice,
          'total_iva' : item.iva,
          'total_final' : item.total_final,
          'unidades_denominacion' : item.unidades_denominacion,
          'inventario' : item.inventario
        };
        detalles.push(detalle);
      });

      let pedidopanaderia = {};

      let factura_venta = {
        'cod_factura_venta' : this.facturaventa.cod_factura_venta,
        'n_factura_venta' : this.facturaventa.numero_factura,
        'serieestab' : this.rucempresa.serieestab,
        'ptoemi' : this.rucempresa.ptoemi,
        "numeracion_automatica" : this.numeracion_automatica,
        "cod_empleado" : this.facturaventa.cod_empleado,
    
        'ruc' : this.rucempresa.ruc,
        'tipoambiente' : this.rucempresa.tipoambiente,
    
        'fecha_hora' : this.facturaventa.fecha_registro,
        'cod_cliente' : this.cliente.cod_cliente,
        'cod_transaccion_tarjeta' :  this.childrecargofactura.recargo.cod_transaccion_tarjeta,
        'subtotalconimpuesto' : this.childdetalleventa.subtotal12,
        'subtotalsinimpuesto' : this.childdetalleventa.subtotal0,
        'totalsinimpuestos' : this.childdetalleventa.totalsinimpuestos,
        'total_descuento' : this.childdetalleventa.totaldescuento,
        'total_iva' : this.childdetalleventa.totalconimpuestos,
        'total_ice' : this.childdetalleventa.totalconice,
        'importetotal' : this.childdetalleventa.importetotal,
        'recibido' : this.facturaventa.recibido,
        'diferencia' : this.facturaventa.diferenciavalor,
    
        'cod_sucursal' : this.cod_sucursal_estable,
        'tipo_venta' : this.facturaventa.tipo_venta,
        'deudor' : this.facturaventa.deudor,
        'tipo_credito' : this.facturaventa.tipo_credito,
        'abono' : this.facturaventa.recibidoabono,
        'id_forma_pago_abono' :  this.facturaventa.id_forma_pago_abono,
    
        'porcentaje_tarjeta' : this.childrecargofactura.recargo.tarifa_recargo,
        'observacion' : this.childdetalleventa.observacion,
        'kardex' : this.kardex,
        'estado_pedido' : this.estado_pedido,
        'cod_pedido' : this.cod_pedido,
        'excluir' : this.excluir,
        'controlestrictoventas' : this.opcionesprivilegios['controlestrictoventas'],
        'pedidopanaderia' : pedidopanaderia,
        'estado_recaudado' : this.estado_recaudado,
        'detalles' : detalles,
        'formapago' : this.childformapago.datosformapagoseleccion,
        'pagonotacredito' : this.childcompensacion.datospagarnotacredito,
        'transaccionbanco' : this.childtransaccionbanco.datostransaccionbanco,
        'excluir_general' : 0,
        'cod_venta_real' : '',
        'cod_ruc' : this.rucempresa.cod_ruc
      };

      this.facturaventa.totalsinimpuestos = this.childdetalleventa.totalsinimpuestos;
      this.facturaventa.totaldescuento = this.childdetalleventa.totaldescuento;
      this.facturaventa.totalconimpuestos = this.childdetalleventa.totalconimpuestos;
      this.facturaventa.subtotal12 = this.childdetalleventa.subtotal12;
      this.facturaventa.subtotal0 = this.childdetalleventa.subtotal0;
      this.facturaventa.totalconice = this.childdetalleventa.totalconice;
      this.facturaventa.observacion = this.childdetalleventa.observacion;
      //console.log(factura_venta);

      try
      {
        const data: any = await lastValueFrom(this.ventaservice.guardar(factura_venta));

        this.swalservice.close();

        if (data.estado == true)
        {
          this.facturaventa.numero_factura = data.n_factura;
          this.facturaventa.claveacceso = data.claveacceso;
          this.rucempresa.serieestab = data.serieestab;//Se asigna con 001
          this.rucempresa.ptoemi = data.ptoemi;//Se asigna con 001

          this.facturaventa.fecha_registro = moment(data.fecha_hora).format('YYYY-MM-DD');//data.fecha_hora

          this.facturaventa.deudor = 0;
          this.disabledbtnnuevo = false;
          this.disabledbtncambio = true;
          this.disabledbtnguardar = true;
          this.disabledbtnimprimir = false;
          
          this.deshabilitaCampos();
          
          this.colormensaje = "#00FF00";
          this.textomensaje = "CREADA";

          this.toastr.success("Factura de Venta registrada correctamente", "INFORMACIÓN DEL SISTEMA");

          if(this.facturaventa.tipo_venta=="ELECTRONICA")
          {
            const cod_proyecto = this.cod_proyecto;
            const clientecopia = JSON.parse(JSON.stringify(this.cliente));
            const rucempresacopia = JSON.parse(JSON.stringify(this.rucempresa));
            const facturaventacopia = JSON.parse(JSON.stringify(this.facturaventa));
            const formapagoscopia = JSON.parse(JSON.stringify(this.childformapago.datosformapagoseleccion));
            const detallescopia = JSON.parse(JSON.stringify(this.childdetalleventa.datosdetalles));
            this.sriventa.iniciarProcesoFacturacion(cod_proyecto, clientecopia, rucempresacopia, facturaventacopia, formapagoscopia, detallescopia, "envio");
            this.visualizar(data.cod_abono, 1);
          }
          else
          {
            this.visualizar(data.cod_abono, 1);
          }
        }
        else
        {
          this.toastr.error("Factura de Venta no se pudo registrar Error: " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
        }
        
      }
      catch (err) {
        this.swalservice.close();
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      }
  }


  async actualizar()
  {
    this.swalservice.iniciarLoading("Actualizando...");

    let detalles = [];
    //console.log(this.childdetalleventa.datosdetalles);
      if(this.facturaventa.estado!="AUTORIZADO")
      {
        this.facturaventa.estado = "CREADA";
      }
      
      this.childdetalleventa.datosdetalles.forEach(item => {
        let detalle = {
          'id_detalle_venta' : item.id_detalle_venta,
          'cod_producto' : item.cod_producto,
          'ice' : item.porcentaje_ice,
          'codigo_iva' : item.codigo_iva,
          'iva' : item.porcentaje_iva,
          'cantidad_comprar' : item.cantidad_comprar,
          'cantidad_tarifa' : item.cantidad_tarifa,
          'cantidad_unidad' : item.cantidad_unidad,
          'cantidad_unidad_pedido' : item.cantidad_unidad_pedido,
          'tarifa' : item.tarifa,
          'cod_tarifa' : item.cod_tarifa,
          'detalle' : item.descripcion,
          'precio' : item.precio_base,
          'precio_venta' : item.precio_venta,
          'chkporcentaje' : item.checked,
          'valorporcentaje' : item.descuento,
          'descuento' : item.descuento_calculado,
          'total' : item.total,
          'total_ice' : item.ice,
          'total_iva' : item.iva,
          'total_final' : item.total_final,
          'unidades_denominacion' : item.unidades_denominacion,
          'inventario' : item.inventario,
          'modificable' : item.modificable
        };
        detalles.push(detalle);
      });

      let pedidopanaderia = {};

      let factura_venta = {
        'cod_factura_venta' : this.facturaventa.cod_factura_venta,
        'n_factura_venta' : this.facturaventa.numero_factura,
        'claveacceso' : this.facturaventa.claveacceso,
        'serieestab' : this.rucempresa.serieestab,
        'ptoemi' : this.rucempresa.ptoemi,
        'ruc' : this.rucempresa.ruc,
        "cod_empleado" : this.facturaventa.cod_empleado,
        'tipoambiente' : this.rucempresa.tipoambiente,
        'fecha_hora' : this.facturaventa.fecha_registro,
        'cod_cliente' : this.cliente.cod_cliente,
        'cod_transaccion_tarjeta' :  this.childrecargofactura.recargo.cod_transaccion_tarjeta,
        'subtotalconimpuesto' : this.childdetalleventa.subtotal12,
        'subtotalsinimpuesto' : this.childdetalleventa.subtotal0,
        'totalsinimpuestos' : this.childdetalleventa.totalsinimpuestos,
        'total_descuento' : this.childdetalleventa.totaldescuento,
        'total_iva' : this.childdetalleventa.totalconimpuestos,
        'total_ice' : this.childdetalleventa.totalconice,
        'importetotal' : this.childdetalleventa.importetotal,
    
        'cod_sucursal' : this.facturaventa.cod_sucursal,    
        'cod_usuario' : this.facturaventa.cod_usuario,
        'tipo_venta' : this.facturaventa.tipo_venta,
        'deudor' : this.facturaventa.deudor,
        'tipo_credito' : this.facturaventa.tipo_credito,

        'estado' : this.facturaventa.estado,
        'envio' : this.facturaventa.envio,
    
        'porcentaje_tarjeta' : this.childrecargofactura.recargo.tarifa_recargo,
        'observacion' : this.childdetalleventa.observacion,
        'kardex' : this.kardex,
        'detalles' : detalles,
        'detallesactualizar' : this.detallesactualizar,
        'pedidopanaderia' : pedidopanaderia,
        'recibido' : this.facturaventa.recibido,
        'diferencia' : this.facturaventa.diferenciavalor,
        'tipo_venta_anterior' : this.tipo_venta_anterior,
        'numeracion_automatica' : this.numeracion_automatica,
        'formapago' : this.childformapago.datosformapagoseleccion,
        'pagonotacredito' : this.childcompensacion.datospagarnotacredito,
        'transaccionbanco' : this.childtransaccionbanco.datostransaccionbanco,
        'estado_recaudado' : this.estado_recaudado,
        'excluir_general' : this.excluir_general,
        'estado_recaudado_anterior' : this.estado_recaudado_anterior,
        'fecha_registro_anterior' : this.fecha_registro_anterior,
        'cod_ruc' : this.rucempresa.cod_ruc
      };

      try
      {
        const data: any = await lastValueFrom(this.ventaservice.actualizar(factura_venta));
          
          this.swalservice.close();

          if (data.estado == true)
          {
            this.facturaventa.numero_factura = data.n_factura;
            this.facturaventa.claveacceso = data.claveacceso;
            this.rucempresa.serieestab = data.serieestab;
            this.rucempresa.ptoemi = data.ptoemi;

            this.facturaventa.fecha_registro = moment(data.fecha_hora).format('YYYY-MM-DD');

            if(this.facturaventa.tipo_venta=="ELECTRONICA")
            {
              this.facturaventa.totalsinimpuestos = this.childdetalleventa.totalsinimpuestos;
              this.facturaventa.totaldescuento = this.childdetalleventa.totaldescuento;
              this.facturaventa.totalconimpuestos = this.childdetalleventa.totalconimpuestos;
              this.facturaventa.subtotal12 = this.childdetalleventa.subtotal12;
              this.facturaventa.subtotal0 = this.childdetalleventa.subtotal0;
              this.facturaventa.totalconice = this.childdetalleventa.totalconice;
              this.facturaventa.observacion = this.childdetalleventa.observacion;
              if(this.estado_recaudado=="1")
              {
                if(this.facturaventa.estado!="AUTORIZADO")
                {
                  const cod_proyecto = this.cod_proyecto;
                  const clientecopia = JSON.parse(JSON.stringify(this.cliente));
                  const rucempresacopia = JSON.parse(JSON.stringify(this.rucempresa));
                  const facturaventacopia = JSON.parse(JSON.stringify(this.facturaventa));
                  const formapagoscopia = JSON.parse(JSON.stringify(this.childformapago.datosformapagoseleccion));
                  const detallescopia = JSON.parse(JSON.stringify(this.childdetalleventa.datosdetalles));
                  this.sriventa.iniciarProcesoFacturacion(cod_proyecto, clientecopia, rucempresacopia, facturaventacopia, formapagoscopia, detallescopia, "envio");
                }
                this.sendActualizar();
              }
              else
              {
                if(this.facturaventa.estado!="AUTORIZADO")
                {
                  await this.confirmarIniciarProceso();
                }
                this.sendActualizar();
              }
              
            }
            else
            {
              this.sendActualizar();
            }
            
          }
          else
          {
            this.toastr.error("Factura de Venta no se pudo actualizar Error: " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
          }
      }
      catch (err) {
        this.swalservice.close();
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      }
  }

  async confirmarIniciarProceso()
  {
    const ok = await this.swalservice.alertConfirmRequerido({
      title: 'Comprobante Actualizado No Recaudado',
      text: 'Este comprobante no está recaudado, si envía este comprobante al SRI no saldrá en los cierres de caja del cajero, ¿Está seguro de enviar el comprobante sin importar que no esté recaudado?',
      icon: "warning",
      confirmText: 'Si, Enviar',
      cancelText: 'No, Enviar'
    });

    if (ok) {
        const cod_proyecto = this.cod_proyecto;
        const clientecopia = JSON.parse(JSON.stringify(this.cliente));
        const rucempresacopia = JSON.parse(JSON.stringify(this.rucempresa));
        const facturaventacopia = JSON.parse(JSON.stringify(this.facturaventa));
        const formapagoscopia = JSON.parse(JSON.stringify(this.childformapago.datosformapagoseleccion));
        const detallescopia = JSON.parse(JSON.stringify(this.childdetalleventa.datosdetalles));
        this.sriventa.iniciarProcesoFacturacion(cod_proyecto, clientecopia, rucempresacopia, facturaventacopia, formapagoscopia, detallescopia, "envio");
        this.sendActualizar();
    }
  }

  sendActualizar()
  {
    this.disabledbtnmodificar = false;
    this.disabledbtnactualizar = true;
    this.disabledbtnimprimir = false;
    
    this.deshabilitaCampos();

    if(this.tipo_formulario == "copiarregistro" || this.tipo_formulario == "finalizarpedidoreservado" || this.tipo_formulario == "finalizarvariospedidosreservados" || this.tipo_formulario == "finalizarpedidoconsalida" || this.tipo_formulario == "finalizarvariospedidosconsalida" || this.tipo_formulario == "finalizarpedidoacumulativo" || this.tipo_formulario == "finalizarvariospedidosacumulativos" || this.tipo_formulario == "finalizarpedidopanaderia")
    {

    }
    else
    {
      if(this.facturaventa.deudor==1){
        this.chkcontado = false;      
      }else{
        this.chkcontado = true;
      }
    }
    
    this.colormensaje = "#00FF00";
    this.textomensaje = "ACTUALIZADA";

    this.toastr.success("Factura de Venta actualizada correctamente", "INFORMACIÓN DEL SISTEMA");
    //this.buscarFacturaVenta();


  }

  async visualizar(cod_abono: number, activo: number)
  {
    if(this.impresiondirecta=="1" && activo == 1)
    {
      if(cod_abono==0)
      {

        const ok = await this.swalservice.alertConfirmRequerido({
          title: "Imprimir Registro de Factura de Venta",
          text: "¿Desea imprimir directamente?",
          icon: "info",
          confirmText: "Si, Imprimir",
          cancelText: "No, Cerrar"
        });

        if (ok) {
            if(this.facturaventa.tipo_venta=="FACTURA" || this.facturaventa.tipo_venta=="ELECTRONICA")
            {
              const urlReporte = `${this.configService.settings.baseUrl}/reportes/ventas/facturaventa?codfacturaventa=${this.facturaventa.cod_factura_venta}&electronico=${this.electronico}`;
              this.impresionDirecta(urlReporte);
            }
            
            if(this.facturaventa.tipo_venta=="RECIBO")
            {
              const urlReporte = `${this.configService.settings.baseUrl}/reportes/ventas/recibo?codfacturaventa=${this.facturaventa.cod_factura_venta}&electronico=${this.electronico}`;
              this.impresionDirecta(urlReporte);
            }

            if(this.facturaventa.tipo_venta=="PROFORMA")
            {
              const urlReporte = `${this.configService.settings.baseUrl}/reportes/ventas/proforma?codfacturaventa=${this.facturaventa.cod_factura_venta}&electronico=${this.electronico}`;
              this.impresionDirecta(urlReporte);
            }
        }

        
      }
      else
      {
        const urlReporte = `${this.configService.settings.baseUrl}/reportes/cuentaspc/abonoventa?cod_abono_venta=${cod_abono}`;
        this.impresionDirecta(urlReporte);
      }
    }
    else
    {
      if(cod_abono==0)
      {
        if(this.facturaventa.tipo_venta=="FACTURA" || this.facturaventa.tipo_venta=="ELECTRONICA")
        {
        let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/facturaventa?codfacturaventa=" + this.facturaventa.cod_factura_venta + "&electronico=" + this.electronico, "", 'width=600,height=400,left=300,top=100');
          miVentana.focus();
        }
        
        if(this.facturaventa.tipo_venta=="RECIBO")
        {
          let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/recibo?codfacturaventa=" + this.facturaventa.cod_factura_venta, "Nota de Venta", 'width=600,height=400,left=300,top=100');
          miVentana.focus();
        }

        if(this.facturaventa.tipo_venta=="PROFORMA")
        {
          let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/proforma?codfacturaventa=" + this.facturaventa.cod_factura_venta, "Proforma", 'width=600,height=400,left=300,top=100');
          miVentana.focus();
        }
      }
      else
      {
        let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/cuentaspc/abonoventa?cod_abono_venta=" + cod_abono, "", 'width=600,height=400,left=300,top=100');
        miVentana.focus();
      }
    }

    
  }

  
  impresionDirecta(urlReporte: string)
  {
    this.impresionservice.enviarAImpresoraLocal(urlReporte).subscribe({
    next: (res) => {
      this.toastr.success("Impresión finalizada correctamente", "INFORMACIÓN DEL SISTEMA");
    },
    error: (err) => {
      console.error('Error en el proceso de impresión:', err);
      this.toastr.error("No se pudo imprimir. Verifique que el servidor local de impresión esté activo", "INFORMACIÓN DEL SISTEMA");
    }
  });
  }
  



  verificarRegistro()
  {
    this.loading = true;
    

    this.ventaservice.verificarRegistro().subscribe( (data : any) =>
    {
      
      if(data == null)
      {
        this.formularioNormal();
        this.deshabilitaCampos();
        this.toastr.error("Error al generar codigo de acceso, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.facturaventa.cod_factura_venta = data.codigo;
        //console.log(this.facturaventa.cod_factura_venta);
        this.facturaventa.numero_factura = data.n_comprobante;
        this.facturaventa.claveacceso = data.claveacceso;
        this.facturaventa.fecha_registro = moment(data.fecha).format('YYYY-MM-DD');
        let numeracionautomatica = parseInt(this.numeracion_automatica);
        if(numeracionautomatica==0)
        {
          this.facturaventa.numero_factura = "";
        }

        if(this.opcionesprivilegios['controlestrictoventas']==1)
        {
          this.registrarControlVenta();
        }
        
        this.txtcodigobarra.nativeElement.focus();
      }
      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  registrarControlVenta() {

    this.loading = true;

    const parametros = {
      'cod_factura_venta' : this.facturaventa.cod_factura_venta,
      'cod_sucursal' : this.cod_sucursal_estable
    };

    this.ventaservice.registrarControlVenta(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
  });
  }

  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/
  recibirDatosProducto(datosrecibidosproducto: any)
  {
    try
    {
      let ultimoindice = this.childdetalleventa.datosdetalles.length - 1;
      if(this.childdetalleventa.datosdetalles[ultimoindice].cod_producto == datosrecibidosproducto.cod_producto)
      {
        //console.log(this.childdetalleventa.datosdetalles[ultimoindice].saltar);
        if(this.childdetalleventa.datosdetalles[ultimoindice].saltar==0)//Sin salto de línea
        {
          let cantidadactual = parseFloat(this.childdetalleventa.datosdetalles[ultimoindice].cantidad_comprar) + 1;
          this.childdetalleventa.datosdetalles[ultimoindice].cantidad_comprar = cantidadactual;
          this.childdetalleventa.keySumar(ultimoindice);
        }
        else//Con salto de línea
        {
          this.childdetalleventa.enfocar = true;
          this.childdetalleventa.datosdetalles.push(datosrecibidosproducto);
          this.childdetalleventa.actualizarValores();
        }
      }
      else
      {
        this.childdetalleventa.enfocar = true;
        this.childdetalleventa.datosdetalles.push(datosrecibidosproducto);
        this.childdetalleventa.actualizarValores();
      }
    } catch (error) {
      this.childdetalleventa.enfocar = true;
      this.childdetalleventa.datosdetalles.push(datosrecibidosproducto);
      this.childdetalleventa.actualizarValores();
    }

  }

  actualizarListadoProducto()
  {
    this.childlistadoproductoventas.page = 1;
    this.childlistadoproductoventas.filterpost="";
    this.loading = true;
    this.datosproducto = [];
    this.datostarifasproducto = [];
    const result = this.childlistadoproductoventas.listarProductosVentasPorSucursal(this.cod_sucursal_estable, this.rucempresa.tipo_ruc).then();
    result.then(() => {      
      this.datosproducto = this.childlistadoproductoventas.datosproducto;
      this.datostarifasproducto = this.childlistadoproductoventas.datostarifasproducto;
      this.loading = false;
      this.toastr.success("Listado de productos actualizado exitosamente", "INFORMACIÓN DEL SISTEMA");
    }).catch(() => {
      this.loading = false;
      this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
    });
  }

  buscarCodigoProducto()
  {
    let comodin = this.codigo_barra.substr(-1);
    if(comodin=="*")
    {
      this.childlistadoproductoventas.page = 1;
      this.childlistadoproductoventas.filterpost= this.codigo_barra.slice(0, -1);
      $("#mymodallistarproductos").modal("show");
      setTimeout(()=>{
        this.childlistadoproductoventas.txtfilterpost.nativeElement.focus();
      },500);
    }
    else
    {
      if(this.codigo_barra.length>0)
      {
        this.childlistadoproductoventas.buscarcodigoproductoventas(this.codigo_barra);
      }
    }
    this.codigo_barra = "";
  }

  clickListarProductos()
  {
    this.childlistadoproductoventas.page = 1;
    this.childlistadoproductoventas.filterpost="";
    $("#mymodallistarproductos").modal("show");
    setTimeout(()=>{
      this.childlistadoproductoventas.txtfilterpost.nativeElement.focus();
    },500);
  }
  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/
  /*Métodos de Listados de Productos*/

  async calcularRecibido(valor: any)
  {
    let importeefectivo: number = parseFloat(valor);
      if(parseFloat(this.facturaventa.recibido)>=importeefectivo)
      {
          this.facturaventa.diferenciavalor = redondeardecimales((parseFloat(this.facturaventa.recibido) - importeefectivo), 2);
          this.facturaventa.diferencia = "Cambio: " + this.facturaventa.diferenciavalor;
        
          const ok = await this.swalservice.alertOkNoRequerido({
          title: this.facturaventa.diferencia,
          text: "Recibido: " + this.facturaventa.recibido
          });

          if (ok) {
            this.clickVerificar();
          }
      }
      else
      {
          this.toastr.warning("La cantidad recibida debe ser Mayor o Igual a la del Importe Total", "INFORMACIÓN DEL SISTEMA");
      }
  }

  recibirDatosDetalles(importetotal: number)
  {
    this.facturaventa.importetotal = importetotal;
    this.childformapago.agregarValorImporteFormaPago(importetotal);
    this.childcompensacion.agregarValorImporteFormaPago(importetotal);
    this.txtcodigobarra.nativeElement.focus();
  }

  clickNuevoCliente()
  {
    this.clienteformcomponent.nombreformulario="AGREGAR";
    this.clienteformcomponent.formularioNormal();
    $("#mymodalformcliente").modal("show");
  }

  clickListarCliente()
  {
    this.childlistadocliente.page = 1;
    this.childlistadocliente.filterpost="";
    $("#mymodallistarclientes").modal("show");
  }

  recibirDatosCliente(datosrecibidoscliente: any)
  {
    this.cliente.cod_identificacion = datosrecibidoscliente.cod_identificacion;
    this.cliente.identificacion = datosrecibidoscliente.identificacion;
    this.cliente.cod_cliente = datosrecibidoscliente.cod_cliente;
    this.cliente.cliente = datosrecibidoscliente.apellido + " " + datosrecibidoscliente.nombre;
    this.cliente.numero_identificacion = datosrecibidoscliente.cedula;
    this.cliente.celular = datosrecibidoscliente.celular;
    this.cliente.telefono = datosrecibidoscliente.telefono;
    this.cliente.correo = datosrecibidoscliente.correo;
    this.cliente.direccion = datosrecibidoscliente.direccion;
    this.childcompensacion.cod_cliente = datosrecibidoscliente.cod_cliente;

    if(this.afiliacion_cliente=="1")
    {
      this.cantidad_compras = 0;
      this.flagbotonafiliar = false;
      this.flagtextoafiliar = false;

      if(this.cliente.cod_cliente!="1")
      {
        if(datosrecibidoscliente.cod_tipo_cliente==1)
        {
          this.flagbotonafiliar = true;
          this.buscarCompras();
        }
        else
        {
          this.flagtextoafiliar = true;
        }
      }
    }

    this.childcompensacion.formularioNormal();
      
    $("#mymodallistarclientes").modal("hide");
  }

  buscarCompras()
  {
    this.loading = true;
    this.clienteservice.buscarCompras(this.cliente.cod_cliente).subscribe( (data : any) =>
    {
      this.cantidad_compras = data.cantidad_compras;
      this.loading = false;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
    });
  }

  afiliarCliente()
  {
    this.loading = true;
    const parametros = {
      'cod_cliente' : this.cliente.cod_cliente
    };
    this.clienteservice.afiliarCliente(parametros).subscribe( (data : any) =>
    {
      this.loading = false;
      if (data.estado == true)
      {
        this.cantidad_compras = 0;
        this.flagbotonafiliar = false;
        this.flagtextoafiliar = false;
        this.flagtextoafiliar = true;
        this.toastr.success("Cliente afiliado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Cliente no se pudo afiliar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
  });

  }

  recibirDatosNuevoCliente(datosrecibidoscliente: any)
  {
    this.cliente.cod_identificacion = datosrecibidoscliente.cod_identificacion;
    this.cliente.identificacion = datosrecibidoscliente.identificacion;
    this.cliente.cod_cliente = datosrecibidoscliente.cod_cliente;
    this.cliente.cliente = datosrecibidoscliente.apellido + " " + datosrecibidoscliente.nombre;
    this.cliente.numero_identificacion = datosrecibidoscliente.cedula;
    this.cliente.celular = datosrecibidoscliente.celular;
    this.cliente.telefono = datosrecibidoscliente.telefono;
    this.cliente.correo = datosrecibidoscliente.correo;
    this.cliente.direccion = datosrecibidoscliente.direccion;
    this.childcompensacion.cod_cliente = datosrecibidoscliente.cod_cliente;

    if(this.afiliacion_cliente=="1")
    {
      this.cantidad_compras = 0;
      this.flagbotonafiliar = false;
      this.flagtextoafiliar = false;

      if(this.cliente.cod_cliente!="1")
      {
        if(datosrecibidoscliente.cod_tipo_cliente==1)
        {
          this.flagbotonafiliar = true;
          this.buscarCompras();
        }
        else
        {
          this.flagtextoafiliar = true;
        }
      }
    }

    $("#mymodalformcliente").modal("hide");
  }

  formularioNormal(): void
  {
    if(this.tipo_formulario == "nuevoregistro")
    {
      this.disabledbtnnuevo = false;
      this.disabledbtncambio = true;
      this.disabledbtnguardar = true;
      this.disabledbtnsrienviar= true;
      this.disabledbtnimprimir = true;

      this.ocultartransaccionesbanco = true;

      this.facturaventa.cod_factura_venta = "";
      this.facturaventa.numero_factura = "";
      this.facturaventa.claveacceso = "0";

      this.colormensaje = "";
      this.textomensaje = "";

      this.cliente.cod_identificacion = "07";
      this.cliente.identificacion = "VENTA A CONSUMIDOR FINAL*";
      this.cliente.cod_cliente = "1";
      this.cliente.cliente = "CONSUMIDOR FINAL";
      this.cliente.numero_identificacion = "9999999999999";
      this.cliente.celular = "0000000000";
      this.cliente.telefono = "000-000";
      this.cliente.correo = "0";
      this.cliente.direccion = "N";

      this.facturaventa.cod_empleado = "0";

      this.childrecargofactura.recargo.cod_transaccion_tarjeta = 0;
      this.childrecargofactura.recargo.tarifa_recargo = "0";

      this.loading = false;
      

      this.facturaventa.diferencia = "";
      this.facturaventa.diferenciavalor="";
      this.facturaventa.recibido = "";

      this.facturaventa.recibidoabono = "0";
      this.facturaventa.id_forma_pago_abono = "01";

      this.facturaventa.pedido = 0;
      this.facturaventa.deudor=0;
      this.facturaventa.tipo_credito=0;

      this.flagNormal();

      this.childdetalleventa.datosdetalles = [];
      this.childdetalleventa.formularioNormal();
      this.childformapago.formularioNormal();
      this.childcompensacion.formularioNormal();
      this.childcompensacion.cod_cliente = 0;
      this.childcompensacion.importetotal = 0;
      this.facturaventa.importetotal = 0;

      this.arr_factura_venta = {};

      this.facturaventa.tipo_venta = this.defecto_venta;

      this.cantidad_compras = 0;
      this.flagbotonafiliar = false;
      this.flagtextoafiliar = false;
    }
    else
    {
      if(this.tipo_formulario == "actualizarregistro")
      {
        this.facturaventa.cod_factura_venta = this.rutaActiva.snapshot.paramMap.get("cod_factura_venta")!;

        this.disabledbtnmodificar = true;
        this.disabledbtnactualizar = true;
        this.disabledbtnimprimir = true;

        this.facturaventa.diferencia = "";
        this.facturaventa.recibido = "";

        this.buscarFacturaVenta();
      }
      else
      {
        if(this.tipo_formulario == "copiarregistro" || this.tipo_formulario == "finalizarpedidoreservado" || this.tipo_formulario == "finalizarvariospedidosreservados" || this.tipo_formulario == "finalizarpedidoconsalida" || this.tipo_formulario == "finalizarvariospedidosconsalida" || this.tipo_formulario == "finalizarpedidoacumulativo" || this.tipo_formulario == "finalizarvariospedidosacumulativos" || this.tipo_formulario == "finalizarpedidopanaderia")
        {
          this.facturaventa.cod_factura_venta = this.rutaActiva.snapshot.paramMap.get("cod_factura_venta")!;
  
          this.disabledbtnmodificar = true;
          this.disabledbtnactualizar = true;
          this.disabledbtnimprimir = true;
  
          this.facturaventa.diferencia = "";
          this.facturaventa.recibido = "";
  
          this.buscarFacturaVenta();
        }
      }
    }

  }

  deshabilitaCampos(): void
  {
    this.chkimpuesto = true;
    this.childlistadoproductoventas.chkimpuesto = true;
    this.disabledchkimpuesto = true;
    this.disabledtxtcodigobarra = true;
    this.disabledbtnlistarproducto = true;
    
    this.childdetalleventa.disabledtabladetalles = true;
    
    this.disabledbtnlistarcliente = true;
    this.disabledbtnagregarcliente = true;

    this.disabledcmbtipoventa = true;
    this.disabledtxtnfactura = true;
    this.disabledtxtfecha = true;
    this.disabledcmbrecargo = true;
    this.disabledformapago = true;
    this.disabledtransaccionbanco = true;
    this.chkcontado = true;
    this.disabledchkcontado = true;
    this.disabledbtncalcular = true;

    this.disabledcmbempleado = true;
  }

  verificarCampos()
  {
    let valor : Boolean = false;

    this.flagformapago = false;

    /*
    if(this.recargo.forma_pago=="0")
    {
      this.flagformapago=true;
      valor=true;
    }
    */

    return valor;
  }

  flagNormal()
  {
    this.flagformapago = false;
  }

  habilitarFormulario(): void
  {
    this.disabledbtnnuevo = true;
    this.disabledbtncambio = false;
    this.disabledbtnguardar = false;
    this.disabledbtnmodificar = true;
    this.disabledbtnactualizar = false;

    this.disabledchkimpuesto = false;
    this.disabledtxtcodigobarra = false;
    this.disabledbtnlistarproducto = false;

    this.disabledbtnlistarcliente = false;
    this.disabledbtnagregarcliente = false;


    if(this.tipo_formulario == "nuevoregistro")
    {
      this.disabledcmbtipoventa = false;
    }
    else
    {
      if(this.tipo_formulario == "actualizarregistro")
      {
        //this.disabledcmbtipoventa = true;
        this.disabledcmbtipoventa = false;
      }
      else
      {
        if(this.tipo_formulario == "copiarregistro" || this.tipo_formulario == "finalizarpedidoreservado" || this.tipo_formulario == "finalizarvariospedidosreservados" || this.tipo_formulario == "finalizarpedidoconsalida" || this.tipo_formulario == "finalizarvariospedidosconsalida" || this.tipo_formulario == "finalizarpedidoacumulativo" || this.tipo_formulario == "finalizarvariospedidosacumulativos" || this.tipo_formulario == "finalizarpedidopanaderia")
        {
          this.disabledcmbtipoventa = false;
        }
      }
    }

    this.disabledtxtnfactura = false;
    if(this.opcionesprivilegios["bloqueofechaventas"]==1)
    {
      this.disabledtxtfecha = true;
    }
    else
    {
      this.disabledtxtfecha = false;
    }
    this.disabledcmbrecargo = false;
    this.disabledformapago = false;
    this.disabledtransaccionbanco = false;

    if(this.tipo_formulario == "finalizarpedidoreservado" || this.tipo_formulario == "finalizarvariospedidosreservados" || this.tipo_formulario == "finalizarpedidoconsalida" || this.tipo_formulario == "finalizarvariospedidosconsalida" || this.tipo_formulario == "finalizarpedidoacumulativo" || this.tipo_formulario == "finalizarvariospedidosacumulativos" || this.tipo_formulario == "finalizarpedidopanaderia")
    {
      this.disabledchkcontado = true;
      this.disabledbtncalcular = true;
       this.childdetalleventa.disabledtabladetalles = true;
    }
    else
    {
      this.disabledchkcontado = false;
      this.disabledbtncalcular = false;
      this.childdetalleventa.disabledtabladetalles = false;
    }

    

    this.disabledcmbempleado = false;

   

    this.childdetalleventa.habilitarFormulario();
  }

  clickDeshacer()
  {
    this.formularioNormal();
    this.deshabilitaCampos();
  }

  listarRucEmpresas()
  {    
    this.loading = true;
    

    this.rucempresaservice.listarRucEmpresas(this.cod_sucursal_estable).subscribe( (data : any) =>
    {
      this.loading = false;
      this.datosrucempresa = data;
      this.childlistadocliente.listarClientes();

      if(this.rucusuario=="1")
      {
        this.buscarFirmaUsuarioSucursal();
      }
      else
      {
        this.buscarRuc();
      }
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  buscarFirmaUsuarioSucursal()
  {
    this.loading = true;
    this.firmausuarioservice.buscarFirmaUsuarioSucursal(this.cod_sucursal_estable).subscribe( (data : any) =>
    {
      this.loading = false;
      if(data.cod_ruc==false)
      {
        this.buscarRuc();
      }
      else
      {
        this.rucempresa.cod_ruc = data.cod_ruc;
        this.buscarRuc();
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  listarEmpleados()
  {    
    this.loading = true;
    

    this.empleadoservice.listarEmpleadosVendedores().subscribe( (data : any) =>
    {
      this.datosempleados = data;
      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  async clickCambio()
  {
    let item = this.childformapago.datosformapagoseleccion.find( (valor : any) => valor.id_forma_pago == "01" );
    if(item)
    {

      let { saldo_ocupado } = this.childcompensacion.datospagarnotacredito.reduce(
        (acc, item) => {
          const saldo = parseFloat(item.saldo_ocupado) || 0;
          if (item.id_forma_pago == '01') {
            acc.saldo_ocupado += saldo;
          }
          return acc;
        },
        { saldo_ocupado: 0 }
      );

      let importeefectivo  = parseFloat(item.valor) - saldo_ocupado;

      if(importeefectivo<0)
      {
        this.toastr.error("Los valores no coinciden entre la forma de pago con las notas de creditos aplicadas en forma de pago, revise que los valores de pagos sean coherentes", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        const valor = await this.swalservice.alertNumberRequerido({
          title: `Dar cambio: ${importeefectivo}`,
          text: "Ingresa el valor para dar el cambio"
        });

        if (valor != null) {
          this.facturaventa.recibido = String(valor);
          this.calcularRecibido(importeefectivo);
        }
      }
    }
    else
    {
      this.toastr.warning("No hay valores en efectivo para dar cambio", "INFORMACIÓN DEL SISTEMA");
    }
  }

  clickAbonar()
  {
    this.childregistroabonoventa.formularioNormal();
    $("#mymodalregistroabono").modal("show");
  }

  sendAceptar(resultado: any) {
    this.facturaventa.recibidoabono = resultado.recibidoabono;
    this.facturaventa.id_forma_pago_abono = resultado.id_forma_pago_abono;
    $("#mymodalregistroabono").modal("hide");
  }

  /*INICIO BUSQUEDA DE FACTURA*/
  /*INICIO BUSQUEDA DE FACTURA*/
  /*INICIO BUSQUEDA DE FACTURA*/
  async buscarFacturaVenta()
  {
    try
    {

    this.loadingprincipal = true;
    
    await this.buscarFormasPagoVenta();
    const existe = this.childformapago.datosformapagoseleccion.some(formapago => formapago.id_forma_pago == "20");
    if (existe) {
      this.ocultartransaccionesbanco = false;
      await this.buscarTransaccionesBanco();
    } else {
      this.ocultartransaccionesbanco = true;
    }

    let data: any = await lastValueFrom(this.ventaservice.buscarFactura(this.facturaventa.cod_factura_venta));

    
      //console.log(data);
      

      if(data[0].estado=="ANULADA" && this.tipo_formulario == "actualizarregistro")
      {
        const ok = await this.swalservice.alertOkRequerido({
          title: "Control del Sistema",
          text: "Este documento ya esta anulado, retroceda y seleccione otro"
        });

        if (ok) {
          this.location.back();
        }
      }
      else
      {
        if(data[0].estado_pedido == "1")
        {
            this.disabledbtnmodificar = true;
            this.disabledbtnguardar = true;
            
            const ok = await this.swalservice.alertOkRequerido({
              title: "Control del Sistema",
              text: 'Este pedido ya fue finalizado, retroceda y seleccione otro'
            });

            if (ok) {
              this.location.back();
            }

          }
          else
          {
            this.facturaventa.estado = data[0].estado;
            this.facturaventa.envio = data[0].envio;
            this.rucempresa.cod_ruc = data[0].cod_ruc;
            this.rucempresa.empresa = data[0].empresa;
            
            if(this.tipo_formulario == "copiarregistro" || this.tipo_formulario == "finalizarpedidoreservado" || this.tipo_formulario == "finalizarvariospedidosreservados" || this.tipo_formulario == "finalizarpedidoconsalida" || this.tipo_formulario == "finalizarvariospedidosconsalida" || this.tipo_formulario == "finalizarpedidoacumulativo" || this.tipo_formulario == "finalizarvariospedidosacumulativos" || this.tipo_formulario == "finalizarpedidopanaderia")
            {
              this.facturaventa.tipo_venta = this.defecto_venta;
            }
            else
            {
              this.facturaventa.tipo_venta = data[0].tipo_venta;
              this.defecto_venta = data[0].tipo_venta;
              this.tipo_venta_anterior = data[0].tipo_venta;
            }

            this.estado_recaudado_anterior = data[0].estado_recaudado;
            this.fecha_registro_anterior = data[0].fecha_registro;

            this.facturaventa.cod_usuario = data[0].cod_usuario;
            this.facturaventa.cod_sucursal = data[0].cod_sucursal;
    
            this.facturaventa.numero_factura = this.padLeft(data[0].numero_factura, 9);
            this.numerofacturatemporal = this.facturaventa.numero_factura;
            this.facturaventa.claveacceso = data[0].claveacceso;
            this.rucempresa.serieestab = data[0].serieestab;
            this.rucempresa.ptoemi = data[0].ptoemi;
            this.rucempresa.ruc = data[0].ruc_sucursal;
            this.rucempresa.tipoambiente = data[0].tipo_ambiente;
    
            this.rucempresa.razon_social = data[0].razonsocial;
            this.rucempresa.nombre_comercial = data[0].nombrecomercial;
            this.rucempresa.direccion_matriz = data[0].direccion_matriz;
            this.rucempresa.direccion_establecimiento = data[0].direccion_establecimiento;
            this.rucempresa.tipo_contribuyente = data[0].tipo_contribuyente;
            this.rucempresa.contribuyente = data[0].contribuyente;
            this.rucempresa.contabilidad = data[0].contabilidad;
            this.rucempresa.leyenda = data[0].leyenda;
            
            this.rucempresa.firmap12 = data[0].firmap12;
            this.rucempresa.clavep12 = data[0].clavep12;
            this.rucempresa.pk12 = data[0].pk12;
            this.rucempresa.firmapublica = data[0].firmapublica;
            this.rucempresa.firmaprivada = data[0].firmaprivada;
            this.rucempresa.certificado = data[0].certificado;
            this.rucempresa.tipo_ruc = data[0].tipo_ruc;
        
            this.colormensaje = "";
            this.textomensaje = "";
        
            this.cliente.cod_identificacion = data[0].cod_identificacion;
            this.cliente.identificacion = data[0].identificacion;
            this.cliente.cod_cliente = data[0].cod_cliente;
            this.childcompensacion.cod_cliente = data[0].cod_cliente;
            this.cliente.cliente = data[0].cliente;
            this.cliente.numero_identificacion = data[0].cedula;
            this.cliente.celular = data[0].celular;
            this.cliente.telefono = data[0].convencional;
            this.cliente.correo = data[0].correo;
            this.cliente.direccion = data[0].direccion;
        
            this.facturaventa.cod_empleado = data[0].cod_empleado;
    
            this.childrecargofactura.recargo.cod_transaccion_tarjeta = data[0].cod_transaccion_tarjeta;
            this.childrecargofactura.recargo.tarifa_recargo = data[0].porcentaje_tarjeta;

            this.rucempresa.facturaversion = data[0].facturaversion;
            this.facturaventa.iva = data[0].iva_general;
        
            this.facturaventa.diferencia = "";
            this.facturaventa.recibido = "";
    
            this.facturaventa.tipo_credito= data[0].tipo_credito;
            
            if(this.recaudador == "1")
            {
              if(this.tipo_formulario == "actualizarregistro")
              {
                this.estado_recaudado = data[0].estado_recaudado;
              }
              else
              {
                if(this.tipo_formulario == "finalizarpedidoreservado" || this.tipo_formulario == "finalizarvariospedidosreservados" || this.tipo_formulario == "finalizarpedidoconsalida" || this.tipo_formulario == "finalizarvariospedidosconsalida" || this.tipo_formulario == "finalizarpedidoacumulativo" || this.tipo_formulario == "finalizarvariospedidosacumulativos" || this.tipo_formulario == "finalizarpedidopanaderia")
                {
                  if(this.tipo_formulario == "finalizarpedidoreservado" || this.tipo_formulario == "finalizarvariospedidosreservados" || this.tipo_formulario == "finalizarpedidoconsalida" || this.tipo_formulario == "finalizarvariospedidosconsalida" || this.tipo_formulario == "finalizarpedidopanaderia")
                  {
                    this.estado_recaudado = "1";
                  }
                  else
                  {
                    this.estado_recaudado = "0";
                  }
                }
                else
                {
                  this.estado_recaudado = "0";
                }
              }
            }
            else
            {
              this.estado_recaudado = "1";
            }

    
            this.facturaventa.fecha_registro = moment(data[0].fecha_hora).format('YYYY-MM-DD');
            
            this.childdetalleventa.datosdetalles = [];

            if(this.datosenvio && this.datosenvio.length > 0)
            {
              data = await this.buscarFacturasPorCodigo();
            }

            data.forEach(element => {
              let descripcion = element.detalle;

              let bpv1=0;
              let bpv2=0;
              let bpv3=0;
              let bpv4=0;
              let bpv5=0;
              let bpv6=0;
              if(this.rucempresa.tipo_ruc=="POPULAR")//SIN IVA EN AUTOMATICO
              {
                bpv1 = element.pv1;
                bpv2 = element.pv2;
                bpv3 = element.pv3;
                bpv4 = element.pv4;
                bpv5 = element.pv5;
                bpv6 = element.pv6;
              }
              else//CON IVA CON IVA EN AUTOMATICO
              {
                bpv1 = element.bpv1;
                bpv2 = element.bpv2;
                bpv3 = element.bpv3;
                bpv4 = element.bpv4;
                bpv5 = element.bpv5;
                bpv6 = element.bpv6;
              }
              
              let detalle = {
                fila_error : false,//Para marcar la fila editada con rojo
                cod_producto : element.cod_producto,
                inventario : element.inventario,
                ctp : element.ctp,
        
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
                cantidad_unidad_pedido : element.cantidad_unidad,
    
                precio_base : parseFloat(element.precio),
                precio_venta : parseFloat(element.precio_venta),
        
                checked : element.chkporcentaje,
                descuento : element.valorporcentaje,
                descuento_calculado : parseFloat(element.descuento),//Calculado
        
                total : redondeardecimales(element.total, 6),
                iva : redondeardecimales(element.total_iva, 2),
                ice : redondeardecimales(element.total_ice, 2),
    
                codigo_iva : element.codigo_iva,
        
                total_final : redondeardecimales(element.total_final, 2),
                unidades_denominacion : element.unidades_denominacion,
                cantidad_antigua : element.cantidad_unidad,
                modificable : 0,
                id_detalle_venta : element.id_detalle_venta,

                precio_base_original: element.precio_base_original,
                rpv1: element.rpv1,
                bpv1: bpv1,
                pv1: element.pv1,
                apv1: element.apv1,

                rpv2: element.rpv2,
                bpv2: bpv2,
                pv2: element.pv2,
                apv2: element.apv2,

                rpv3: element.rpv3,
                bpv3: bpv3,
                pv3: element.pv3,
                apv3: element.apv3,

                rpv4: element.rpv4,
                bpv4: bpv4,
                pv4: element.pv4,
                apv4: element.apv4,

                rpv5: element.rpv5,
                bpv5: bpv5,
                pv5: element.pv5,
                apv5: element.apv5,

                rpv6: element.rpv6,
                bpv6: bpv6,
                pv6: element.pv6,
                apv6: element.apv6
              }
              this.childdetalleventa.datosdetalles.push(detalle);
            });
    
            this.detallesactualizar = [];
            this.childdetalleventa.datosdetalles.forEach(item => {
              let detalle = {
                'id_detalle_venta' : item.id_detalle_venta,
                'cod_producto' : item.cod_producto,
                'ice' : item.porcentaje_ice,
                'codigo_iva' : item.codigo_iva,
                'iva' : item.porcentaje_iva,
                'cantidad_comprar' : item.cantidad_comprar,
                'cantidad_tarifa' : item.cantidad_tarifa,
                'cantidad_unidad' : item.cantidad_unidad,
                'tarifa' : item.tarifa,
                'cod_tarifa' : item.cod_tarifa,
                'detalle' : item.descripcion,
                'precio' : item.precio_base,
                'precio_venta' : item.precio_venta,
                'chkporcentaje' : item.checked,
                'valorporcentaje' : item.descuento,
                'descuento' : item.descuento_calculado,
                'total' : item.total,
                'total_ice' : item.ice,
                'total_iva' : item.iva,
                'total_final' : item.total_final,
                'unidades_denominacion' : item.unidades_denominacion,
                'inventario' : item.inventario
              };
              this.detallesactualizar.push(detalle);
            });

            this.childdetalleventa.subtotal12 = redondeardecimales(data[0].subtotalconimpuesto, 2);
            this.childdetalleventa.subtotal0 = redondeardecimales(data[0].subtotalsinimpuesto, 2);
            this.childdetalleventa.totalsinimpuestos = redondeardecimales(data[0].totalsinimpuestos, 2);
            this.childdetalleventa.totaldescuento = redondeardecimales(data[0].total_descuento, 2);
            this.childdetalleventa.totalconice = redondeardecimales(data[0].total_ice_general, 2);
            this.childdetalleventa.totalconimpuestos = redondeardecimales(data[0].total_iva_general, 2);
            this.childdetalleventa.importetotal = redondeardecimales(data[0].importetotal, 2);
            this.facturaventa.importetotal = this.childdetalleventa.importetotal;
            this.childformapago.importetotal = this.childdetalleventa.importetotal;
            this.childcompensacion.importetotal = this.childdetalleventa.importetotal;
            this.deshabilitaCampos();
    
            if(this.datosenvio && this.datosenvio.length > 0)
            {
              this.childdetalleventa.actualizarValores();
            }
    
            if(this.tipo_formulario == "copiarregistro" || this.tipo_formulario == "finalizarpedidoreservado" || this.tipo_formulario == "finalizarvariospedidosreservados" || this.tipo_formulario == "finalizarpedidoconsalida" || this.tipo_formulario == "finalizarvariospedidosconsalida" || this.tipo_formulario == "finalizarpedidoacumulativo" || this.tipo_formulario == "finalizarvariospedidosacumulativos" || this.tipo_formulario == "finalizarpedidopanaderia")
            {
              
            }
            else
            {
              await this.verificarNotaCredito();

              this.excluir_general = data[0].excluir_general;
              this.facturaventa.deudor = data[0].deudor;
              if(this.facturaventa.deudor==1){
                this.chkcontado = false;
              }else{
                this.chkcontado = true;
                await this.buscarCompensacionesPorFactura();
              }
            }


          }
      }

      this.disabledbtnmodificar = false;

      this.loadingprincipal = false;
    } catch (err) {
      this.loadingprincipal = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    }
  }

  buscarFacturasPorCodigo(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ventaservice.buscarFacturasPorCodigo(this.datosenvio).subscribe( (data: any) => {
          resolve(data);
        },
        (err) => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          reject(err);
        }
      );
    });
  }

  buscarFormasPagoVenta(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ventaservice.buscarFormasPagoVenta(this.facturaventa.cod_factura_venta).subscribe( (data: any) => {
          this.childformapago.datosformapagoseleccion = [];
          this.childformapago.datosformapagoseleccion = data;
          resolve(data);  
        },
        (err) => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          reject(err);
        }
      );
    });
  }

  buscarCompensacionesPorFactura(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.saldonotacreditoservice.buscarCompensacionesPorFactura(this.facturaventa.cod_factura_venta).subscribe( (data: any) => {
          if(data.length>0)
          {
            this.childcompensacion.chkpagarnotacredito = true;
            this.childcompensacion.datospagarnotacredito = [];
            this.childcompensacion.datospagarnotacredito = data;
          }
          else
          {
            this.childcompensacion.chkpagarnotacredito = false;
          }
          resolve(data);
        },
        (err) => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          reject(err);
        }
      );
    });
  }

  buscarTransaccionesBanco(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ventaservice.buscarTransaccionesBanco(this.facturaventa.cod_factura_venta).subscribe( (data: any) => {
          this.childtransaccionbanco.datostransaccionbanco = [];
          this.childtransaccionbanco.datostransaccionbanco = data;
          resolve(data);
        },
        (err) => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          reject(err);
        }
      );
    });
  }

  verificarNotaCredito(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.notacreditoservice.verificarNotaCredito(this.facturaventa.cod_factura_venta).subscribe( (data: any) => {
          if(data.cod_nota_credito == false) {
            this.notacreditoexistente = "0";
          } else {
            this.notacreditoexistente = "1";
          }
          resolve(data);
        },
        (err) => {
          this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
          reject(err);
        }
      );
    });
  }
  /*TERMINA BUSQUEDA DE FACTURA*/
  /*TERMINA BUSQUEDA DE FACTURA*/
  /*TERMINA BUSQUEDA DE FACTURA*/

  async recibirDatosFirmaVenta(datosrecibidosfirmaventa: any)
  {
    localStorage.setItem("cod_ruc", datosrecibidosfirmaventa.cod_ruc);
    this.rucempresa.cod_ruc = datosrecibidosfirmaventa.cod_ruc;
    if(this.tipo_formulario == "nuevoregistro")
    {
      this.buscarRuc();
      this.clickNuevo();
    }
    else
    {
      if(this.tipo_formulario == "copiarregistro" || this.tipo_formulario == "finalizarpedidoreservado" || this.tipo_formulario == "finalizarvariospedidosreservados" || this.tipo_formulario == "finalizarpedidoconsalida" || this.tipo_formulario == "finalizarvariospedidosconsalida" || this.tipo_formulario == "finalizarpedidoacumulativo" || this.tipo_formulario == "finalizarvariospedidosacumulativos" || this.tipo_formulario == "finalizarpedidopanaderia")
      {

        const ok = await this.swalservice.alertOkRequerido({
          title: "Control del Sistema",
          text: 'Esta acción no restablecerá los datos de la factura, solo cambió la firma seleccionada, tener en cuenta el ruc con el impuesto en los detalles'
        });

        if (ok) {
          this.location.back();
        }
        
        


        this.buscarRuc();
      }
    }
  }
  
  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }

  goBack(){
    this.location.back();
  }

  
  async comprobarSri()
  {
    try
    {
      this.swalservice.iniciarLoading("Verificando...");
      
      let facturaventa1: FacturaVentaDTO = new FacturaVentaDTO;
      facturaventa1.claveacceso = this.facturaventa.claveacceso;

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
      this.swalservice.close();
    }
  }

}