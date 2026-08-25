import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { VentaService } from 'src/app/venta/services/venta.service';
import { EmpleadoService } from 'src/app/administrar/services/empleado.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ListadoClienteVentaComponent } from 'src/app/shared/components/venta/listado-cliente-venta/listado-cliente-venta.component';
import { ClienteFormComponent } from 'src/app/venta/components/cliente/cliente-form/cliente-form.component';
declare var $:any;
import { DetalleVentaComponent } from 'src/app/shared/components/detalle-venta/detalle-venta.component';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { ConfigService } from 'src/app/shared/services/config.service';
import { ClienteService } from 'src/app/venta/services/cliente.service';
import { FacturaVentaDTO } from 'src/app/venta/models/factura-venta.dto';
import { ClienteDTO } from 'src/app/venta/models/cliente.dto';
import { RegistroAbonoVentaComponent } from 'src/app/shared/components/registro-abono-venta/registro-abono-venta.component';
import { FormaPagoComponent } from 'src/app/shared/components/forma-pago/forma-pago.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MembresiaService } from '../../services/membresia.service';
import { PlanService } from '../../services/plan.service';
import { ListadoPlanesGymComponent } from 'src/app/shared/components/listado-planes-gym/listado-planes-gym.component';
import { SocioDTO } from '../../models/socio.dto';
import { RecargoFacturaComponent } from 'src/app/shared/components/recargo-factura/recargo-factura.component';
import { TransaccionesBancoComponent } from 'src/app/shared/components/venta/transacciones-banco/transacciones-banco.component';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';
import { CajeroService } from 'src/app/venta/services/cajero.service';
import { RucEmpresaDTO } from 'src/app/usuario/models/rucempresa.dto';
import { RucEmpresaService } from 'src/app/usuario/services/ruc-empresa.service';
import { CompensacionComponent } from 'src/app/shared/components/compensacion/compensacion.component';
import { SaldoNotaCreditoService } from 'src/app/venta/services/saldo-nota-credito.service';
import { FirmaUsuarioService } from 'src/app/usuario/services/firma-usuario.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { lastValueFrom } from 'rxjs';
import { ListadoAperturaDiarioComponent } from './listado-apertura-diario/listado-apertura-diario.component';
import { ListadoSociosComponent } from 'src/app/shared/components/listado-socios/listado-socios.component';
import { SriVentaService } from 'src/app/shared/services/sri-venta.service';
import { SwalService } from 'src/app/shared/services/swal.service';

@Component({
  selector: 'app-factura-plan',
  templateUrl: './factura-plan.component.html',
  styleUrls: ['./factura-plan.component.css']
})
export class FacturaPlanComponent implements OnInit {
  
  opcionesprivilegios : any;
  cod_proyecto : string = "";
  multisucursal : string = "0";
  electronico : string = "0";
  defecto_venta : string = "";
  numeracion_automatica : string = "";
  comision_venta : string = "";
  kardex : string = "";
  afiliacion_cliente : string = "0";
  @ViewChild(ListadoSociosComponent) childlistadosocio!: ListadoSociosComponent;
  @ViewChild(ListadoClienteVentaComponent) childlistadocliente!: ListadoClienteVentaComponent;
  @ViewChild(ClienteFormComponent) clienteformcomponent: any;
  @ViewChild(DetalleVentaComponent) childdetalleventa: any;
  @ViewChild(RegistroAbonoVentaComponent) childregistroabonoventa: any;
  @ViewChild(FormaPagoComponent) childformapago: any;
  @ViewChild(RecargoFacturaComponent) childrecargofactura: any;
  @ViewChild(ListadoPlanesGymComponent) childlistadoplanesgym!: ListadoPlanesGymComponent;
  @ViewChild(TransaccionesBancoComponent) childtransaccionbanco: any;
  @ViewChild(CompensacionComponent) childcompensacion: any;
  @ViewChild(ListadoAperturaDiarioComponent) childlistadoaperturadiario: ListadoAperturaDiarioComponent;

  @ViewChild("txtcodigobarra") txtcodigobarra: ElementRef;

  datosrucempresa : any;
  datosempleados : any;

  datostipoventa : any;

  disabledbtnnuevo : boolean = false;
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
  socios: SocioDTO[] = [];
  //sucursal: SucursalDTO = new SucursalDTO;
  rucempresa: RucEmpresaDTO = new RucEmpresaDTO;

  codigo_barra : string = "";

  //formapago: FormaPagoDTO = new FormaPagoDTO;
  //recargo: RecargoDTO = new RecargoDTO;

  flagformapago : boolean = false;

  loading : boolean = false;

  disabledcmbempleado : boolean = true;
  flagempleado : boolean = false;

  arr_factura_venta : any;

  datosproducto : any = [];
  datostarifasproducto : any = [];

  flagtextoafiliar: boolean = false;
  flagbotonafiliar: boolean = false;
  cantidad_compras : number = 0;

  tipo_formulario: string = "";

  disabledbtnmodificar : boolean = true;
  disabledbtnactualizar: boolean = true;
  disabledbtnsrienviar: boolean = true;
  detallesactualizar : any = [];

  estado_pedido : number = 0;
  cod_pedido : any = [];
  excluir : number = 0;
  cod_tipo_plan : number = 0;
  rol: string = "";
  flagcalcularfecha: boolean = false;
  ocultartransaccionesbanco: boolean = true;
  control_estricto_cajero : string = "";

  firmasruc: string = "";
  cod_sucursal_estable: string = "";
  sucursal_estable: string = "";
  rucusuario: string = "";
  chkgrupal : boolean = false;
  cantidad_grupo: number = 1;

  tipo_venta_anterior: string = "";

  constructor(private location: Location, private ventaservice : VentaService, private toastr : ToastrService, private error : ErrorService, private rucempresaservice : RucEmpresaService, private empleadoservice : EmpleadoService, private clienteservice:ClienteService, private rutaActiva: ActivatedRoute, private membresiaservice : MembresiaService, private planservice : PlanService, private bodyStyleService: BodyStyleService, private cajeroservice: CajeroService, private saldonotacreditoservice: SaldoNotaCreditoService, private firmausuarioservice: FirmaUsuarioService, private usersession: UserSessionService, private sriventa: SriVentaService, private configService: ConfigService, private swalservice: SwalService) { }

  ngOnInit(): void {
    this.tipo_formulario = this.rutaActiva.snapshot.paramMap.get("tipo_formulario")!;
    this.cod_tipo_plan = Number(this.rutaActiva.snapshot.paramMap.get("cod_tipo_plan")!);
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
    this.rol = this.usersession.getConfiguracion("rol");
    this.firmasruc = this.usersession.getConfiguracion("firmasruc");
    this.control_estricto_cajero = this.opcionesprivilegios["controlestrictocajero"];
    this.datostipoventa = [];

    this.firmasruc = this.usersession.getConfiguracion("firmasruc");
    this.cod_sucursal_estable = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursal_estable = this.usersession.getConfiguracion("sucursal");
    this.rucusuario = this.usersession.getConfiguracion("ruc_usuario");

    this.facturaventa.cod_tipo_plan = this.rutaActiva.snapshot.paramMap.get("cod_tipo_plan")!;

    if(this.tipo_formulario == "nuevoregistro" || this.tipo_formulario == "nuevoregistrodiario")
    {
      if(this.control_estricto_cajero == "1")
      {
        this.verificarCajaAbiertaUsuario();
      }
      else
      {
        this.cargaInicioVenta();
      }
    }
    else
    {
      this.cargaInicioVenta();
    }

    this.bodyStyleService.resetBodyStyles();
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
  
      if(this.tipo_formulario == "nuevoregistro" || this.tipo_formulario == "actualizarregistro")
      {
        this.estado_pedido = 0;
        this.cod_pedido = [];
        this.excluir = 0;
      }
    
      if(this.tipo_formulario == "nuevoregistro" || this.tipo_formulario == "nuevoregistrodiario")
      {
        setTimeout(() => this.listarRucEmpresas());
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
      }
  }

  clickNuevo()
  {
    if(this.datosrucempresa.length>0)
    {
      this.disabledbtnnuevo = true;
      this.nuevo();
    }
    else
    {
      this.toastr.warning("Presiona F5 o Recarga la página, no se completó la conexión correctamente debido error de conectividad", "INFORMACIÓN DEL SISTEMA");
    }
  }

  ngAfterViewInit(): void {
    //this.childformapago.formularioNormal();
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

  changeFechaInicioPlan(event: any): void {

    const elemento = event.target.value;
    
    if(this.childdetalleventa.datosdetalles.length>0) {
      this.facturaventa.fecha_inicio_plan = elemento;
      this.flagcalcularfecha = true;
      if(this.facturaventa.cod_subcategoria == 111)//1 Dias
      {
        this.calcularFechasPlanDiario(this.childdetalleventa.datosdetalles[0].cantidad_unidad);
      }
      else
      {
        this.calcularFechasPlanMensual(this.childdetalleventa.datosdetalles[0].cantidad_unidad);
      }
    } else {
      this.toastr.warning("Primero debe agregar un plan para configurar", "INFORMACIÓN DEL SISTEMA");
    }
  }

  calcularFechasPlanDiario(cantidad_dias : number) {
    this.loading = true;
    this.membresiaservice.calcularFechasDiarios(this.facturaventa.fecha_inicio_plan, cantidad_dias).subscribe( (data : any) =>
    {
      this.loading = false;
      //this.fecha_inicio_plan = data.fecha_inicio_plan;
      this.facturaventa.fecha_fin_plan = data.fecha_fin_plan;
      this.flagcalcularfecha = false;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
    });
  }

  calcularFechasPlanMensual(cantidad_meses : number) {
    this.loading = true;
    this.membresiaservice.calcularFechasMensuales(this.facturaventa.fecha_inicio_plan, cantidad_meses).subscribe( (data : any) =>
    {
      this.loading = false;
      //this.fecha_inicio_plan = data.fecha_inicio_plan;
      this.facturaventa.fecha_fin_plan = data.fecha_fin_plan;
      this.flagcalcularfecha = false;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
    });
  }

  clickModificar()
  {
    this.disabledbtnmodificar = true;
    this.loading = true;
    if(this.facturaventa.estado!="AUTORIZADO")
    {
      const result = this.childlistadoplanesgym.listarPlanesPorSucursal(this.cod_sucursal_estable, this.rucempresa.tipo_ruc).then();
      result.then(() => { 
        
        this.habilitarFormulario();

        if(this.facturaventa.tipo_venta=="PROFORMA") {
          this.disabledchkcontado = true;
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
  
        //let element = document.getElementById("box");
        //element.scrollIntoView({ behavior: "smooth", block: "start" });
        
        this.datosproducto = this.childlistadoplanesgym.datosproducto;
        this.datostarifasproducto = this.childlistadoplanesgym.datostarifasproducto;
        this.loading = false;
        
      }).catch(() => {
        this.loading = false;
        
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
        this.buscarDatosRuc();
        /*
        this.formularioNormal();
        const result = this.childlistadoplanesgym.listarPlanesPorSucursal(this.cod_sucursal_estable, this.rucempresa.tipo_ruc).then();
        result.then(() => {
          this.loading = false;
          this.datosproducto = this.childlistadoplanesgym.datosproducto;
          this.datostarifasproducto = this.childlistadoplanesgym.datostarifasproducto;
          if(this.tipo_formulario == "nuevoregistrodiario")
          {
            this.childlistadoplanesgym.buscarCodSubCategoriaProductoVentas(111);
          }
          this.toastr.success("Listado de productos actualizado exitosamente", "INFORMACIÓN DEL SISTEMA");
        }).catch(() => {
          this.loading = false;
          this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
        });
        */
      } else {
        event.target.value = this.rucempresa.cod_ruc;
      }
    }
    else
    {
      this.rucempresa.cod_ruc = elemento;
      this.buscarDatosRuc();
      this.formularioNormal();
      const result = this.childlistadoplanesgym.listarPlanesPorSucursal(this.cod_sucursal_estable, this.rucempresa.tipo_ruc).then();
      result.then(() => {
        this.loading = false;
        this.datosproducto = this.childlistadoplanesgym.datosproducto;
        this.datostarifasproducto = this.childlistadoplanesgym.datostarifasproducto;
        if(this.tipo_formulario == "nuevoregistrodiario")
        {
          this.childlistadoplanesgym.buscarCodSubCategoriaProductoVentas(111);
        }
        this.toastr.success("Listado de productos actualizado exitosamente", "INFORMACIÓN DEL SISTEMA");
      }).catch(() => {
        this.loading = false;
        this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
      });


    }
    
    


  }

  buscarDatosRuc()
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
  }

  buscarRuc()
  {
    this.buscarDatosRuc();
    this.nuevo();
  }

  sendChangeRecargo(valor: any) {
    this.facturaventa.deudor = 0;
    this.chkcontado = true;
    this.disabledchkcontado = valor.disabledchkcontado;
    this.disabledbtncalcular = valor.disabledbtncalcular;
    this.childdetalleventa.reiniciarPorcentajeTarifa();
    this.facturaventa.diferencia = "";
    this.facturaventa.diferenciavalor="";
    this.facturaventa.recibido = "";
    this.facturaventa.recibidoabono = "0";
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
      this.childlistadoplanesgym.chkimpuesto = false;
    }else{
      this.chkimpuesto = true;
      this.childlistadoplanesgym.chkimpuesto = true;
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
      if(this.flagcalcularfecha == true)
      {
        this.toastr.warning("No se completó el cálculo de mebresía correctamente, F5 o volver a seleccionar fecha de inicio", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        if (this.facturaventa.importetotal == 0)
        {
          let importesumadoformapago = redondeardecimales(this.childformapago.datosformapagoseleccion.reduce((suma, item) => suma + parseFloat(item.valor), 0), 2);
          if(importesumadoformapago == this.facturaventa.importetotal)
          {
            if(this.facturaventa.tipo_venta == "RECIBO" && this.rol == "ADMINISTRADOR")
            {		
              this.verificaDetalles();
            }
            else
            {
              this.toastr.warning("El total a cobrar está en 0, no se puede guardar o actualizar comprobantes en valores 0", "INFORMACIÓN DEL SISTEMA");
            }
          }
          else
          {
            this.toastr.warning("Los valores de la forma pago deben surmarse y ser igual al importe total", "INFORMACIÓN DEL SISTEMA");
          }
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
                    this.buscarNFactura();
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
  }

  changeTipoVenta(event: any): void {
    const elemento = event.target.value;
    this.facturaventa.tipo_venta = elemento;
    
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
      } else {
        this.disabledcmbrecargo = false;
        this.disabledchkcontado = false;
        this.facturaventa.pedido = 0;
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
    let cantidad_socios = 0;
    let cantidad_grupo = 0;
    //console.log(this.facturaventa.cod_tipo_plan);
    if(this.facturaventa.cod_tipo_plan=="1")
    {
      cantidad_socios = this.socios.length;
      cantidad_grupo = this.cantidad_grupo;
      //console.log(cantidad_socios);
      //console.log(cantidad_grupo);
    }

    if (cantidad_socios==cantidad_grupo)
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
    }
    else
    {
      this.toastr.error("La cantidad de socios en la asignación de la membresía es inferior a la que está configurada, debe agregar mas socios en la membresía de tipo grupal", "INFORMACIÓN DEL SISTEMA");
    }
  }

  async modalGuardar()
  {
    if(this.tipo_formulario == "nuevoregistro" || this.tipo_formulario == "nuevoregistrodiario")
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
          "unidades_denominacion" : item.unidades_denominacion,
          'inventario' : item.inventario
        };
        detalles.push(detalle);
      });

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
        'socios' : this.socios,
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
        'detalles' : detalles,
        'formapago' : this.childformapago.datosformapagoseleccion,
        'pagonotacredito' : this.childcompensacion.datospagarnotacredito,
        'transaccionbanco' : this.childtransaccionbanco.datostransaccionbanco,
        'excluir_general' : 0,
        'cod_venta_real' : '',

        'cod_producto' : this.childdetalleventa.datosdetalles[0].cod_producto,
        'plan' : this.childdetalleventa.datosdetalles[0].descripcion,
        'lunes' : this.childdetalleventa.datosdetalles[0].lunes,
        'martes' : this.childdetalleventa.datosdetalles[0].martes,
        'miercoles' : this.childdetalleventa.datosdetalles[0].miercoles,
        'jueves' : this.childdetalleventa.datosdetalles[0].jueves,
        'viernes' : this.childdetalleventa.datosdetalles[0].viernes,
        'sabado' : this.childdetalleventa.datosdetalles[0].sabado,
        'domingo' : this.childdetalleventa.datosdetalles[0].domingo,
        'hora_inicio' : this.childdetalleventa.datosdetalles[0].hora_inicio,
        'hora_fin' : this.childdetalleventa.datosdetalles[0].hora_fin,
        'fecha_inicio' : this.facturaventa.fecha_inicio_plan,
        'fecha_fin' : this.facturaventa.fecha_fin_plan,
        'cod_subcategoria' : this.childdetalleventa.datosdetalles[0].cod_subcategoria,
        'cantidad_unidad' : this.childdetalleventa.datosdetalles[0].cantidad_unidad,
        'grupal' : this.chkgrupal,
        'cantidad_grupo' : this.cantidad_grupo,
        'compartido' : this.childdetalleventa.datosdetalles[0].compartido,
        'actividad' : this.childdetalleventa.datosdetalles[0].actividad,
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
      
      let metodo = "";

      if(this.tipo_formulario == "nuevoregistro" || this.tipo_formulario == "actualizarregistro")
      {
        metodo = "guardarMembresia";
      }
      else
      {
        if(this.tipo_formulario == "nuevoregistrodiario" || this.tipo_formulario == "actualizarregistrodiario")
        {
          metodo = "guardarMembresiaDiario";
        }
      }
      

      try
      {
        const data: any = await lastValueFrom(this.membresiaservice[metodo](factura_venta));

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
              this.visualizar(data.cod_abono);
            }
            else
            {
              this.visualizar(data.cod_abono);
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
          "unidades_denominacion" : item.unidades_denominacion,
          'inventario' : item.inventario,
          'modificable' : item.modificable
        };
        detalles.push(detalle);
      });

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
        'socios' : this.socios,
        'cod_transaccion_tarjeta' :  this.childrecargofactura.recargo.cod_transaccion_tarjeta,
        'subtotalconimpuesto' : this.childdetalleventa.subtotal12,
        'subtotalsinimpuesto' : this.childdetalleventa.subtotal0,
        'totalsinimpuestos' : this.childdetalleventa.totalsinimpuestos,
        'total_descuento' : this.childdetalleventa.totaldescuento,
        'total_iva' : this.childdetalleventa.totalconimpuestos,
        'total_ice' : this.childdetalleventa.totalconice,
        'importetotal' : this.childdetalleventa.importetotal,
    
        'cod_sucursal' : this.cod_sucursal_estable,
        'cod_usuario' : this.facturaventa.cod_usuario,
        'tipo_venta' : this.facturaventa.tipo_venta,
        'tipo_venta_anterior' : this.tipo_venta_anterior,
        'deudor' : this.facturaventa.deudor,
        'tipo_credito' : this.facturaventa.tipo_credito,

        'estado' : this.facturaventa.estado,
        'envio' : this.facturaventa.envio,
    
        'porcentaje_tarjeta' : this.childrecargofactura.recargo.tarifa_recargo,
        'observacion' : this.childdetalleventa.observacion,
        'kardex' : this.kardex,
        'detalles' : detalles,
        'detallesactualizar' : this.detallesactualizar,
        'formapago' : this.childformapago.datosformapagoseleccion,
        'pagonotacredito' : this.childcompensacion.datospagarnotacredito,
        'transaccionbanco' : this.childtransaccionbanco.datostransaccionbanco,
        'cod_ruc' : this.rucempresa.cod_ruc,

        'cod_producto' : this.childdetalleventa.datosdetalles[0].cod_producto,
        'plan' : this.childdetalleventa.datosdetalles[0].descripcion,
        'lunes' : this.childdetalleventa.datosdetalles[0].lunes,
        'martes' : this.childdetalleventa.datosdetalles[0].martes,
        'miercoles' : this.childdetalleventa.datosdetalles[0].miercoles,
        'jueves' : this.childdetalleventa.datosdetalles[0].jueves,
        'viernes' : this.childdetalleventa.datosdetalles[0].viernes,
        'sabado' : this.childdetalleventa.datosdetalles[0].sabado,
        'domingo' : this.childdetalleventa.datosdetalles[0].domingo,
        'hora_inicio' : this.childdetalleventa.datosdetalles[0].hora_inicio,
        'hora_fin' : this.childdetalleventa.datosdetalles[0].hora_fin,
        'fecha_inicio' : this.facturaventa.fecha_inicio_plan,
        'fecha_fin' : this.facturaventa.fecha_fin_plan,
        'cod_subcategoria' : this.childdetalleventa.datosdetalles[0].cod_subcategoria,
        'cantidad_unidad' : this.childdetalleventa.datosdetalles[0].cantidad_unidad,
        'compartido' : this.childdetalleventa.datosdetalles[0].compartido,
        'actividad' : this.childdetalleventa.datosdetalles[0].actividad,
        'grupal' : this.chkgrupal,
        'cantidad_grupo' : this.cantidad_grupo
      };

      //console.log(factura_venta);

      let metodo = "";
      if(this.facturaventa.cod_tipo_plan=="1") {
        metodo = "actualizarMembresia";
      } else {
        metodo = "actualizarMembresiaDiario";
      }

      try
      {
        const data: any = await lastValueFrom(this.membresiaservice[metodo](factura_venta));
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

  sendVisualizar(cod_abono) {
    this.visualizar(cod_abono);
  }

  sendMensajeSri(mensaje: any) {
    this.colormensaje = mensaje.colormensaje;
    this.textomensaje = mensaje.textomensaje;
  }

  sendActualizar() {
    this.disabledbtnmodificar = false;
    this.disabledbtnactualizar = true;
    this.disabledbtnimprimir = false;
    
    this.deshabilitaCampos();

    if(this.facturaventa.deudor==1){
      this.chkcontado = false;      
    }else{
      this.chkcontado = true;
    }
    
    
    this.colormensaje = "#00FF00";
    this.textomensaje = "ACTUALIZADA";

    this.toastr.success("Factura de Venta registrada correctamente", "INFORMACIÓN DEL SISTEMA");
  }

  visualizar(cod_abono)
  {
    if(cod_abono==0)
    {
      if(this.facturaventa.tipo_venta=="FACTURA" || this.facturaventa.tipo_venta=="ELECTRONICA")
      {
        let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/facturaventamembresia?codfacturaventa=" + this.facturaventa.cod_factura_venta + "&electronico=" + this.electronico, "", 'width=600,height=400,left=300,top=100');
        miVentana.focus();
      }
      
      if(this.facturaventa.tipo_venta=="RECIBO")
      {
        let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/recibomembresia?codfacturaventa=" + this.facturaventa.cod_factura_venta, "Nota de Venta", 'width=600,height=400,left=300,top=100');
        miVentana.focus();
      }
    
      if(this.facturaventa.tipo_venta=="PROFORMA")
      {
        let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/proformamembresia?codfacturaventa=" + this.facturaventa.cod_factura_venta, "Proforma", 'width=600,height=400,left=300,top=100');
        miVentana.focus();
      }
      /*
      if(this.facturaventa.tipo_venta=="PEDIDO RESERVADO")
      {
        let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/pedido?codfacturaventa=" + this.facturaventa.cod_factura_venta, "Nota de Pedido", 'width=600,height=400,left=300,top=100');
        miVentana.focus();
      }
      */
    }
    else
    {
      let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/cuentaspc/abonoventa?cod_abono_venta=" + cod_abono, "Abono", 'width=600,height=400,left=300,top=100');
       miVentana.focus();
    }
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
        this.facturaventa.numero_factura = data.n_comprobante;
        this.facturaventa.claveacceso = data.claveacceso;
        this.facturaventa.fecha_registro = moment(data.fecha).format('YYYY-MM-DD');
        let numeracionautomatica = parseInt(this.numeracion_automatica);
        if(numeracionautomatica==0)
        {
          this.facturaventa.numero_factura = "";
        }

        this.buscarPersona();

        //this.txtcodigobarra.nativeElement.focus();
      }
      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  buscarPersona()
  {
    if(this.tipo_formulario == "nuevoregistro" || this.tipo_formulario == "actualizarregistro")
    {
      this.cliente.cod_cliente = this.rutaActiva.snapshot.paramMap.get("cod_cliente")!;
      this.facturaventa.cod_factura_venta = this.rutaActiva.snapshot.paramMap.get("cod_factura_venta")!;
    }
    else
    {
      if(this.tipo_formulario == "nuevoregistrodiario" || this.tipo_formulario == "actualizarregistrodiario")
      {
        this.cliente.cod_cliente = this.rutaActiva.snapshot.paramMap.get("cod_cliente")!;
      }
    }

    
    this.loading = true;
    

    this.clienteservice.buscarClientePorCodigo(this.cliente.cod_cliente).subscribe( (data : any) =>
    {
      if (data.cod_cliente == false)//No existe
      {
        this.toastr.warning("Hubo un error al buscar cliente, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.cliente.cod_identificacion = data.cod_identificacion;
        this.cliente.identificacion = data.identificacion;
        this.cliente.cod_cliente = data.cod_cliente;
        this.childcompensacion.cod_cliente = data.cod_cliente;
        this.cliente.cliente = data.apellido + " " + data.nombre;
        this.cliente.numero_identificacion = data.cedula;
        this.cliente.celular = data.celular;
        this.cliente.telefono = data.telefono;
        this.cliente.correo = data.correo;
        this.cliente.direccion = data.direccion;

        const socio = new SocioDTO();
        socio.cod_socio = data.cod_cliente;
        socio.nombres_completos = data.apellido + " " + data.nombre;
        this.socios.push(socio);

        if(this.tipo_formulario == "nuevoregistro" || this.tipo_formulario == "actualizarregistro")
        {
          this.buscarUltimoPlan();
        }
        
        if(this.tipo_formulario == "nuevoregistrodiario")
        {
          this.childlistadoplanesgym.buscarCodSubCategoriaProductoVentas(111);
        }
        
      }

      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  buscarUltimoPlan()
  {
    this.loading = true;

    this.membresiaservice.buscarultimoplan(this.cliente.cod_cliente).subscribe( (data : any) =>
    {
      this.loading = false;

      if(data.estado == true)
      {
        this.facturaventa.infomembresia = true;
        this.facturaventa.infoestadoplan = data.estado_plan;
        this.facturaventa.infoplan = data.plan;
        this.facturaventa.infofechainicio = data.fecha_inicio;
        this.facturaventa.infofechafin = data.fecha_fin;
      }
      else
      {
        this.facturaventa.infomembresia = false;
        this.facturaventa.infoestadoplan = "";
        this.facturaventa.infoplan = "";
        this.facturaventa.infofechainicio = "";
        this.facturaventa.infofechafin = "";
      }

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
    this.chkgrupal = datosrecibidosproducto.grupal;
    this.cantidad_grupo = datosrecibidosproducto.cantidad_grupo;

    if(this.chkgrupal==false)
    {
      if(this.socios.length>0)
      {
        this.socios = this.socios.slice(0, 1);
      }
    }

    this.childdetalleventa.enfocar = true;
    this.childdetalleventa.datosdetalles.splice(0, 1);
    /*
    if(datosrecibidosproducto.cod_subcategoria!=113)//Diferente al adicional por propuesta
    {
      this.childdetalleventa.datosdetalles = [];
    }
    */
    $("#mymodallistarproductos").modal("hide");
    this.childdetalleventa.datosdetalles.push(datosrecibidosproducto);
    
    this.facturaventa.cod_subcategoria = datosrecibidosproducto.cod_subcategoria;
    this.facturaventa.fecha_inicio_plan = moment().format('YYYY-MM-DD');
    this.facturaventa.horario = datosrecibidosproducto.horario_completo;
    /*
    this.flagcalcularfecha = true;
    if(this.facturaventa.cod_subcategoria == 111)//1 Dias
    {
      this.calcularFechasPlanDiario(datosrecibidosproducto.cantidad_unidad);
    }
    else
    {
      this.calcularFechasPlanMensual(datosrecibidosproducto.cantidad_unidad);
    }
    */
    this.childdetalleventa.actualizarValores();
  }

  actualizarListadoProducto()
  {

    

      


    this.childlistadoplanesgym.page = 1;
    this.childlistadoplanesgym.filterpost="";
    this.loading = true;
    this.datosproducto = [];
    this.datostarifasproducto = [];
    
    let metodo = "";
    if(this.tipo_formulario == "nuevoregistro" || this.tipo_formulario == "actualizarregistro")
    {
      metodo = "listarPlanesPorSucursal";
    }
    else
    {
      if(this.tipo_formulario == "nuevoregistrodiario" || this.tipo_formulario == "actualizarregistrodiario")
      {
        metodo = "listarPlanesDiariosPorSucursal";
      }
    }
    
    const result = this.childlistadoplanesgym[metodo](this.cod_sucursal_estable, this.rucempresa.tipo_ruc).then();
    result.then(() => {   

      this.datosproducto = this.childlistadoplanesgym.datosproducto;
      this.datostarifasproducto = this.childlistadoplanesgym.datostarifasproducto;
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
      this.childlistadoplanesgym.page = 1;
      this.childlistadoplanesgym.filterpost= this.codigo_barra.slice(0, -1);
      $("#mymodallistarproductos").modal("show");
      setTimeout(()=>{
        this.childlistadoplanesgym.txtfilterpost.nativeElement.focus();
      },500);
    }
    else
    {
      if(this.codigo_barra.length>0)
      {
        this.childlistadoplanesgym.buscarcodigoproductoventas(this.codigo_barra);
      }
    }
    this.codigo_barra = "";
  }

  clickListarProductos()
  {
    this.childlistadoplanesgym.page = 1;
    this.childlistadoplanesgym.filterpost="";
    $("#mymodallistarproductos").modal("show");
    setTimeout(()=>{
      this.childlistadoplanesgym.txtfilterpost.nativeElement.focus();
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
    try
    {
      this.facturaventa.importetotal = importetotal;
      setTimeout(() => {
        this.childformapago.agregarValorImporteFormaPago(importetotal);
        this.childcompensacion.agregarValorImporteFormaPago(importetotal);
      }, 2000);
      
      this.flagcalcularfecha = true;
      if(this.facturaventa.cod_subcategoria == 111)//1 Dias
      {
        this.calcularFechasPlanDiario(this.childdetalleventa.datosdetalles[0].cantidad_unidad);
      }
      else
      {
        this.calcularFechasPlanMensual(this.childdetalleventa.datosdetalles[0].cantidad_unidad);
      }
    }
    catch(e)
    {
      console.log(e);
    }
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
    $("#mymodalformcliente").modal("hide");
  }

  formularioNormal(): void
  {
    if(this.tipo_formulario == "nuevoregistro")
    {
      this.disabledbtnnuevo = false;
      this.disabledbtncambio = true;
      this.disabledbtnguardar = false;
      this.disabledbtnsrienviar= true;
      this.disabledbtnimprimir = true;

      this.ocultartransaccionesbanco = true;

      //this.facturaventa.cod_factura_venta = "";
      //this.facturaventa.numero_factura = "";
      //this.facturaventa.claveacceso = "0";
      this.facturaventa.fecha_inicio_plan = "";
      this.facturaventa.fecha_fin_plan = "";
      this.facturaventa.horario = "";
      this.facturaventa.cod_subcategoria = 0;

      this.colormensaje = "";
      this.textomensaje = "";

      /*
      this.cliente.cod_identificacion = "07";
      this.cliente.identificacion = "VENTA A CONSUMIDOR FINAL*";
      this.cliente.cod_cliente = "1";
      this.cliente.cliente = "CONSUMIDOR FINAL";
      this.cliente.numero_identificacion = "9999999999999";
      this.cliente.celular = "0000000000";
      this.cliente.telefono = "000-000";
      this.cliente.correo = "N";
      this.cliente.direccion = "N";
      */

      this.facturaventa.cod_empleado = "0";

      this.childrecargofactura.recargo.cod_transaccion_tarjeta = 0; //REVISAR
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

      this.chkgrupal = false;
      this.cantidad_grupo = 1;
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

        this.buscarSocio();
      }
    }

  }

  deshabilitaCampos()
  {
    this.chkimpuesto = true;
    this.childlistadoplanesgym.chkimpuesto = true;
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
    if(this.formapago.forma_pago=="0")
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


    if(this.tipo_formulario == "nuevoregistro" || this.tipo_formulario == "nuevoregistrodiario")
    {
      this.disabledcmbtipoventa = false;
    }
    else
    {
      if(this.tipo_formulario == "actualizarregistro")
      {
        this.disabledcmbtipoventa = false;
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
    
    this.disabledchkcontado = false;
    this.disabledbtncalcular = false;

    this.disabledcmbempleado = false;

    this.childdetalleventa.disabledtabladetalles = false;

    this.childdetalleventa.habilitarFormulario();
  }

  clickDeshacer()
  {
    /*
    if(this.tipo_formulario == "nuevoregistro")
    {
      this.nuevo();
      this.deshabilitaCampos();
    }
    else
    {
      if(this.tipo_formulario == "actualizarregistro")
      {*/
        this.formularioNormal();
      /*}
    }*/
  }

  nuevo()
  {
    if(this.datosrucempresa.length>0)
    {
      this.loading = true;
      
      let metodo = "";

      if(this.tipo_formulario == "nuevoregistro" || this.tipo_formulario == "actualizarregistro")
      {
        metodo = "listarPlanesPorSucursal";
      }
      else
      {
        if(this.tipo_formulario == "nuevoregistrodiario" || this.tipo_formulario == "actualizarregistrodiario")
        {
          metodo = "listarPlanesDiariosPorSucursal";
        }
      }
      
      const result = this.childlistadoplanesgym[metodo](this.cod_sucursal_estable, this.rucempresa.tipo_ruc).then();
      result.then(() => { 
          this.facturaventa.cod_factura_venta = "";
          this.facturaventa.numero_factura = "";
          this.facturaventa.claveacceso = "0";
          this.facturaventa.cod_empleado = "0";
          this.childrecargofactura.recargo.cod_transaccion_tarjeta = 0;
          this.childrecargofactura.recargo.tarifa_recargo = "0";
          this.childrecargofactura.recargo.tarifarecargo = [];
          this.facturaventa.deudor=0;
          this.facturaventa.tipo_credito=0;
          this.childdetalleventa.datosdetalles = [];
          this.childdetalleventa.formularioNormal();
          this.childformapago.formularioNormal();
          this.childcompensacion.formularioNormal();
  
          this.facturaventa.importetotal = 0;
          this.arr_factura_venta = {};
          this.facturaventa.tipo_venta = this.defecto_venta;

          this.facturaventa.recibidoabono = "0";
          this.facturaventa.id_forma_pago_abono = "01";

          this.facturaventa.fecha_inicio_plan = "";
          //this.facturaventa.fecha_inicio_plan = moment().format('YYYY-MM-DD');
          
          this.facturaventa.fecha_fin_plan = "";
          this.facturaventa.horario = "";
          this.facturaventa.cod_subcategoria = 0;
          this.facturaventa.infomembresia= false;
          this.facturaventa.infoestadoplan = "";
          this.facturaventa.infoplan = "";
          this.facturaventa.infofechainicio = "";
          this.facturaventa.infofechafin = "";

          this.colormensaje = "";
          this.textomensaje = "";

          this.habilitarFormulario();
          this.childdetalleventa.datosdetalles = [];

          this.datosproducto = this.childlistadoplanesgym.datosproducto;
          this.datostarifasproducto = this.childlistadoplanesgym.datostarifasproducto;
          this.loading = false;
          
          this.verificarRegistro();
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

  listarRucEmpresas()
  {    
    this.loading = true;
    this.rucempresaservice.listarRucEmpresas(this.cod_sucursal_estable).subscribe( (data : any) =>
    {
      this.datosrucempresa = data;
      this.loading = false;

      if(this.comision_venta=='1')
      {
        this.listarEmpleados();
      }
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
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA"); 
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
    

    this.empleadoservice.listar().subscribe( (data : any) =>
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

  buscarSocio()
  {
    this.loading = true;   
    this.membresiaservice.buscarMembresiaSocio(this.facturaventa.cod_factura_venta).subscribe( (data : any) =>
    {
      this.loading = false;
      if(data.length>0)
      {
        this.chkgrupal = data[0].grupal;
        this.cantidad_grupo = data[0].cantidad_grupo;
        this.socios = [];
        data.forEach((item: any) => {
          const socio = new SocioDTO();
          socio.cod_socio = item.cod_cliente;
          socio.nombres_completos = item.apellido + " " + item.nombre;
          this.socios.push(socio);
        });

        this.buscarFacturaVenta();
      }
      else
      {
        this.buscarFacturaVenta();
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
    });
  }

  async buscarFacturaVenta()
  {
    try
    {
    this.loading = true;

    await this.buscarFormasPagoVenta();
    const existe = this.childformapago.datosformapagoseleccion.some(formapago => formapago.id_forma_pago == "20");
    if (existe) {
      this.ocultartransaccionesbanco = false;
      await this.buscarTransaccionesBanco();
    } else {
      this.ocultartransaccionesbanco = true;
    }
    

    let data: any = await lastValueFrom(this.membresiaservice.buscarFacturaMembresia(this.facturaventa.cod_factura_venta));

      this.facturaventa.estado = data[0].estado;
      this.facturaventa.envio = data[0].envio;
      this.rucempresa.cod_ruc = data[0].cod_ruc;
      this.rucempresa.empresa = data[0].empresa;
      
      this.facturaventa.tipo_venta = data[0].tipo_venta;
      this.tipo_venta_anterior = data[0].tipo_venta;
      this.defecto_venta = data[0].tipo_venta;

      this.facturaventa.cod_usuario = data[0].cod_usuario;

      this.facturaventa.numero_factura = this.padLeft(data[0].numero_factura, 9);
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

      this.facturaventa.fecha_registro = moment(data[0].fecha_hora).format('YYYY-MM-DD');
      
      this.childdetalleventa.datosdetalles = [];


      
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
        else//CON IVA EN AUTOMATICO
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
          ctp : 1,
  
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
          apv6: element.apv6,

          cod_subcategoria : element.cod_subcategoria,
          lunes : element.lunes,
          martes : element.martes,
          miercoles : element.miercoles,
          jueves : element.jueves,
          viernes : element.viernes,
          sabado : element.sabado,
          domingo : element.domingo,
          hora_inicio : element.hora_inicio,
          hora_fin : element.hora_fin,
          horario_completo : element.horario + " (" + element.jornada + ")",
          fecha_inicio : element.fecha_inicio,
          fecha_fin : element.fecha_fin,
          compartido : element.compartido,
          actividad : element.actividad
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
          "unidades_denominacion" : item.unidades_denominacion,
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
      this.facturaventa.cod_subcategoria = data[0].cod_subcategoria;
      this.facturaventa.fecha_inicio_plan = data[0].fecha_inicio;
      this.facturaventa.fecha_fin_plan = data[0].fecha_fin;
      this.facturaventa.horario = data[0].horario_completo;
      this.childformapago.importetotal = this.childdetalleventa.importetotal;
      this.childcompensacion.importetotal = this.childdetalleventa.importetotal;
      this.loading = false;
      
      this.deshabilitaCampos();


      this.facturaventa.deudor = data[0].deudor;

      if(this.facturaventa.deudor==1){
        this.chkcontado = false;        
      }else{
        this.chkcontado = true;
        await this.buscarCompensacionesPorFactura();
      }
      
      this.disabledbtnmodificar = false;

    } catch (err) {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    }
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

  

  recibirDatosFirmaVenta(datosrecibidosfirmaventa: any)
  {
    localStorage.setItem("cod_ruc", datosrecibidosfirmaventa.cod_ruc);
    this.rucempresa.cod_ruc = datosrecibidosfirmaventa.cod_ruc;
    if(this.tipo_formulario == "nuevoregistro" || this.tipo_formulario == "nuevoregistrodiario")
    {
      this.buscarDatosRuc();
      this.formularioNormal();
      const result = this.childlistadoplanesgym.listarPlanesPorSucursal(this.cod_sucursal_estable, this.rucempresa.tipo_ruc).then();
      result.then(() => {
        this.loading = false;
        this.datosproducto = this.childlistadoplanesgym.datosproducto;
        this.datostarifasproducto = this.childlistadoplanesgym.datostarifasproducto;
        if(this.tipo_formulario == "nuevoregistrodiario")
        {
          this.childlistadoplanesgym.buscarCodSubCategoriaProductoVentas(111);
        }
        this.toastr.success("Listado de productos actualizado exitosamente", "INFORMACIÓN DEL SISTEMA");
      }).catch(() => {
        this.loading = false;
        this.toastr.warning("No se completó la carga completa de registros debido a un error de tu conectividad", "INFORMACIÓN DEL SISTEMA");
      });
    }
  }
  
  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }

  goBack(){
    this.location.back();
  }

  clickAbrirPuerta()
  {
    this.childlistadoaperturadiario.listarPuertaDiario();
    $("#mymodallistadoaperturadiarios").modal("show");
  }

  clickListarSocios()
  {
    this.childlistadosocio.pagesocio = 1;
    this.childlistadosocio.filterpostsocio="";
    $("#mymodallistarsocios").modal("show");
  }

  recibirDatosSocio(datosrecibidossocio: any)
  {
    const existe = this.socios.some(item => item.cod_socio == datosrecibidossocio.cod_cliente);
    if (existe)
    {
      this.toastr.error("El socio ya está agregado en el grupo", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      const socio = new SocioDTO();
      socio.cod_socio = datosrecibidossocio.cod_cliente;
      socio.nombres_completos = datosrecibidossocio.apellido + " " + datosrecibidossocio.nombre;
      this.socios.push(socio);
      $("#mymodallistarsocios").modal("hide");
    }
  }

  borrar(index)
  {
      try
      {
        this.socios.splice(index, 1);
      }
      catch(e)
      {
        console.log(e);
       this.toastr.error("Se a producido un error al borrar el items", "INFORMACIÓN DEL SISTEMA");
      }
  }

}