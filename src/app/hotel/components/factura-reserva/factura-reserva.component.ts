import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { VentaService } from 'src/app/venta/services/venta.service';
import { EmpleadoService } from 'src/app/administrar/services/empleado.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ListadoProductoVentasComponent } from 'src/app/shared/components/listado-producto/listado-producto-ventas/listado-producto-ventas.component';
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
import { FacturaReservaService } from '../../services/factura-reserva.service';
import { Location } from '@angular/common';
import { RecargoFacturaComponent } from 'src/app/shared/components/recargo-factura/recargo-factura.component';
import { TransaccionesBancoComponent } from 'src/app/shared/components/venta/transacciones-banco/transacciones-banco.component';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';
import { CompensacionComponent } from 'src/app/shared/components/compensacion/compensacion.component';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { RucEmpresaDTO } from 'src/app/usuario/models/rucempresa.dto';
import { RucEmpresaService } from 'src/app/usuario/services/ruc-empresa.service';
import { CajeroService } from 'src/app/venta/services/cajero.service';
import { lastValueFrom } from 'rxjs';
import { SriVentaService } from 'src/app/shared/services/sri-venta.service';
import { SwalService } from 'src/app/shared/services/swal.service';

@Component({
  selector: 'app-factura-reserva',
  templateUrl: './factura-reserva.component.html',
  styleUrls: ['./factura-reserva.component.css']
})
export class FacturaReservaComponent implements OnInit {
  
  opcionesprivilegios : any;
  cod_proyecto : string = "";
  multisucursal : string = "0";
  electronico : string = "0";
  defecto_venta : string = "";
  numeracion_automatica : string = "";
  comision_venta : string = "";
  kardex : string = "";
  afiliacion_cliente : string = "0";
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

  rucempresa: RucEmpresaDTO = new RucEmpresaDTO;

  datostipoventa : any;

  disabledbtnnuevo : boolean = false;
  disabledbtncambio : boolean = true;
  disabledbtnguardar: boolean = true;
  disabledbtnimprimir : boolean = true;
  disabledbtnsrienviar: boolean = true;

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

  disabledbtnmodificar : boolean = false;
  disabledbtnactualizar: boolean = true;
  detallesactualizar : any = [];

  estado_pedido : number = 0;
  cod_pedido : string = "";
  excluir : number = 0;

  cod_sucursal_estable: string = "";

  ocultartransaccionesbanco: boolean = true;

  constructor(private location: Location, private ventaservice : VentaService, private toastr : ToastrService, private error : ErrorService, private sucursalesservice : SucursalesService, private empleadoservice : EmpleadoService, private clienteservice:ClienteService, private rutaActiva: ActivatedRoute, private facturareservaservice : FacturaReservaService, private bodyStyleService: BodyStyleService, private usersession: UserSessionService, private rucempresaservice : RucEmpresaService, private cajeroservice: CajeroService, private sriventa: SriVentaService, private configService: ConfigService, private swalservice: SwalService) { }

  ngOnInit(): void {
    this.tipo_formulario = this.rutaActiva.snapshot.paramMap.get("tipo_formulario")!;

    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.electronico = this.usersession.getConfiguracion("electronico");
    this.defecto_venta = this.usersession.getConfiguracion("defecto_venta");
    this.facturaventa.tipo_venta = this.defecto_venta;
    this.numeracion_automatica = this.usersession.getConfiguracion("numeracion_automatica");
    this.comision_venta = this.usersession.getConfiguracion("comision_venta");
    this.datosrucempresa = [];
    this.kardex = this.usersession.getConfiguracion("kardex");
    this.afiliacion_cliente = this.usersession.getConfiguracion("afiliacion_cliente");
    this.facturaventa.iva = Number(this.usersession.getConfiguracion("iva"));
    this.facturaventa.codigo_iva = Number(this.usersession.getConfiguracion("codigo_iva"));
    this.facturaventa.cod_reserva = this.rutaActiva.snapshot.paramMap.get("cod_reserva")!;
    this.datostipoventa = [];
    this.rucempresa.cod_ruc = this.usersession.getConfiguracion("cod_ruc");
    this.cod_sucursal_estable = this.usersession.getConfiguracion("cod_sucursal");
    this.control_estricto_cajero = this.opcionesprivilegios["controlestrictocajero"];

    if(this.control_estricto_cajero == "1")
    {
        this.verificarCajaAbiertaUsuario();
    }
    else
    {
      this.cargaInicioVenta();
    }
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
  
    if(this.tipo_formulario == "nuevoregistro") {
      setTimeout(() => this.listarRucEmpresas());
    }

    this.bodyStyleService.resetBodyStyles();
  }

  listarRucEmpresas()
  {    
    this.loading = true;
    

    this.rucempresaservice.listarRucEmpresas(this.cod_sucursal_estable).subscribe( (data : any) =>
    {
      this.loading = false;
      this.datosrucempresa = data;
      this.listarEmpleados();
      this.childlistadocliente.listarClientes();
      this.buscarRuc();
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
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

    this.nuevo();
  }
  
  changeEmpleado(event: any): void {
    const elemento = event.target.value;
    this.facturaventa.cod_empleado = elemento;
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
  
  clickGuardar()
  {
    if(this.facturaventa.fecha_registro.length == 0)
    {
      this.toastr.warning("Seleccione una fecha de registro para registrar", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      if (this.facturaventa.importetotal == 0)
      {
        this.toastr.warning("Verifique forma de Pago, No hay nada que facturar, realice la factura por favor", "INFORMACIÓN DEL SISTEMA");
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

  
  clickActualizar()
  {
    if(this.facturaventa.fecha_registro.length == 0)
    {
      this.toastr.warning("Seleccione una fecha de registro para registrar", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      if (this.facturaventa.importetotal == 0)
      {
        this.toastr.warning("Verifique forma de Pago, No hay nada que facturar, realice la factura por favor", "INFORMACIÓN DEL SISTEMA");
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
                this.verificaDetalles();
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

  async modalGuardar()
  {
    if(this.tipo_formulario == "nuevoregistro")
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
        //'estado_pedido' : this.estado_pedido,
        //'cod_pedido' : this.cod_pedido,
        //'excluir' : this.excluir,
        'cod_reserva' : this.facturaventa.cod_reserva,
        'tipo_pago' : this.facturaventa.tipo_pago,
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
        const data: any = await lastValueFrom(this.facturareservaservice.guardarFacturaReserva(factura_venta));

          this.swalservice.close();

          if (data.estado == true)
          {
            this.facturaventa.numero_factura = data.n_factura;
            this.facturaventa.claveacceso = data.claveacceso;
            this.rucempresa.serieestab = data.serieestab;//Se asigna con 001
            this.rucempresa.ptoemi = data.ptoemi;//Se asigna con 001

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
            this.toastr.error("Factura de Venta no se pudo registrar, error inesperado: " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
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

  visualizar(cod_abono)
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
   
     if(this.facturaventa.tipo_venta=="PEDIDO RESERVADO")
     {
       let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/pedido?codfacturaventa=" + this.facturaventa.cod_factura_venta, "Nota de Pedido", 'width=600,height=400,left=300,top=100');
       miVentana.focus();
     }
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
        this.txtcodigobarra.nativeElement.focus();
      }
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
    const result = this.childlistadoproductoventas.listarProductosVentasPorSucursal(this.cod_sucursal_estable, "GENERAL").then();
    result.then(() => {
      this.childlistadoproductoventas.datosproducto = this.childlistadoproductoventas.datosproducto.map(element => {
        return { ...element, ctp: 1 };
      }); 
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
              this.clickGuardar();
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
      this.cliente.correo = "N";
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


    if(this.tipo_formulario == "nuevoregistro")
    {
      this.disabledcmbtipoventa = false;
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
    this.formularioNormal();
    this.habilitarFormulario();
    this.nuevo();
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

  nuevo()
  {
    if(this.datosrucempresa.length>0)
    {
      this.loading = true;
      
      const result = this.childlistadoproductoventas.listarProductosVentasPorSucursal(this.cod_sucursal_estable, "GENERAL").then();
      result.then(() => { 
          this.facturaventa.cod_factura_venta = "";
          this.facturaventa.numero_factura = "";
          this.facturaventa.claveacceso = "0";
          this.facturaventa.cod_empleado = "0";
          this.childrecargofactura.recargo.cod_transaccion_tarjeta = 0; //REVISAR
          this.childrecargofactura.recargo.tarifa_recargo = "0";
          this.childrecargofactura.recargo.tarifarecargo = [];
          this.facturaventa.deudor=0;
          this.facturaventa.tipo_credito=0;
          this.childdetalleventa.datosdetalles = [];
          this.childdetalleventa.formularioNormal();
          this.facturaventa.importetotal = 0;
          this.arr_factura_venta = {};
          this.facturaventa.tipo_venta = this.defecto_venta;
          this.facturaventa.recibidoabono = "0";
          this.facturaventa.id_forma_pago_abono = "01";
          this.habilitarFormulario();
          this.childdetalleventa.datosdetalles = [];
          this.childlistadoproductoventas.datosproducto = this.childlistadoproductoventas.datosproducto.map(element => {
            return { ...element, ctp: 1 };
          });
          this.verificarRegistro();
          this.childformapago.formularioNormal();
          this.childcompensacion.formularioNormal();
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

  buscarPersona()
  {
    this.cliente.cod_cliente = this.rutaActiva.snapshot.paramMap.get("cod_cliente")!;
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
      }

      setTimeout(() => {
        this.codigo_barra = this.rutaActiva.snapshot.paramMap.get("codigo")!;
        if(this.codigo_barra!="0")
        {
          this.buscarCodigoProducto();
          this.facturaventa.tipo_pago = 0;
        }
        else
        {
          this.codigo_barra = "";
          this.facturaventa.tipo_pago = 1;
        }
      }, 500);
      

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
  
  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }

  goBack(){
    this.location.back();
  }

}