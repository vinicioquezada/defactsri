import { Component, OnInit, ViewChild } from '@angular/core';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { VentaService } from '../../services/venta.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
declare var $:any;
import { ConfigService } from 'src/app/shared/services/config.service';
import { Router } from '@angular/router';
import { ClienteDTO } from '../../models/cliente.dto';
import { FacturaVentaDTO } from '../../models/factura-venta.dto';
import { redondeardecimales } from '../../../shared/js/decimales.js';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { RucEmpresaDTO } from 'src/app/usuario/models/rucempresa.dto';
import { RucEmpresaService } from 'src/app/usuario/services/ruc-empresa.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { SriVentaService } from 'src/app/shared/services/sri-venta.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { FormaPagoService } from '../../services/forma-pago.service';
import { NotaCreditoService } from '../../services/nota-credito.service';

@Component({
  selector: 'app-explorador-factura',
  templateUrl: './explorador-factura.component.html',
  styleUrls: ['./explorador-factura.component.css']
})
export class ExploradorFacturaComponent implements OnInit {  
  opcionesprivilegios : any;

  estado : string = "";
  proceso : string = "";

  multisucursal : string = "0";
  datos : any;
  datossucursal : any;
  filterpost = "";

  cod_sucursal : string = "";
  sucursal : string = "";

  fechadesde : string = "";
  fechahasta : string = "";
 
  cod_proyecto : string = "";
  
  loading : boolean = false;
  
  checktodos: boolean = false;

  recaudador: string = "";

  firmasruc: string = "";
  cod_ruc: string = "0";
  datosrucempresa : any = [];

  fechaactualizar: string = "";

  cod_tipo_comprobante : string = "1";
  datostipocomprobante : any[] = [
    {
      "cod_tipo_comprobante" : "1",
      "tipo_comprobante" : "FACTURA"
    },
    {
      "cod_tipo_comprobante" : "2",
      "tipo_comprobante" : "NOTA CREDITO"
    }
  ];

  cod_tipo_documento : string = "1";
  datostipodocumento : any[] = [
    {
      "cod_tipo_documento" : "1",
      "tipo_documento" : "ELECTRÓNICA"
    },
    {
      "cod_tipo_documento" : "3",
      "tipo_documento" : "RECIBO"
    }
    // {
    //   "cod_tipo_documento" : 4,
    //   "tipo_documento" : "VENTA PENDIENTE"
    // }
  ];

  datosformapago : any = [];
  id_forma_pago : string = "0";

  page = 1;
  count = 0;
  pagesize = 5;

  codigo_iva: string;

  constructor(private router : Router, private ventaservice:VentaService, private toastr: ToastrService, private error:ErrorService, private sucursalesservice:SucursalesService, private rucempresaservice : RucEmpresaService, private usersession: UserSessionService, private configService: ConfigService, private sriventa: SriVentaService, private swalservice: SwalService, private formapagoservice : FormaPagoService, private notacreditoservice:NotaCreditoService) { }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
    this.recaudador = this.usersession.getConfiguracion("recaudador");
    this.firmasruc = this.usersession.getConfiguracion("firmasruc");
    this.codigo_iva = this.usersession.getConfiguracion("codigo_iva");
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.listarSucursales();
  }

  changeEstadoComprobante(event: any): void {
    const elemento = event.target.value;
    this.estado = elemento;
  }

  changeProceso(event: any): void {
    const elemento = event.target.value;
    this.proceso = elemento;
    this.checktodos = false;
    this.datos = this.datos.map(item => ({ ...item, seleccion: false, fila_error: false }));
    this.fechaactualizar = "";
  }

  changeChecked(item: any) {
    item.seleccion = !item.seleccion;
  }

  changeTipoComprobante(event: any): void {
    const elemento = event.target.value;
    this.cod_tipo_comprobante = elemento;
    const resultado = this.datostipocomprobante.find( (valor : any) => valor.cod_tipo_comprobante == this.cod_tipo_comprobante );
  }

  changeTipoDocumento(event: any): void {
    const elemento = event.target.value;
    this.cod_tipo_documento = elemento;
    const resultado = this.datostipodocumento.find( (valor : any) => valor.cod_tipo_documento == this.cod_tipo_documento );
  }

  changeFormaPago(event: any): void {
    const elemento = event.target.value;
    this.id_forma_pago = elemento;
    const resultado = this.datosformapago.find( (valor : any) => valor.id_forma_pago == this.id_forma_pago );
  }

  verificarProceso(item: any)
  {
    let valor = true;
    if(this.proceso=="FIRMADO")
    {
      if(item.estado == "CREADA" || item.estado == "DEVUELTA" || item.estado == "NO AUTORIZADO")
      {
        valor = false;
      }
    }
  
    if(this.proceso=="ENVIARSRI")
    {
      if((item.estado == "CREADA" || item.estado == "EN PROCESO" || item.estado == "DEVUELTA" || item.estado == "NO AUTORIZADO") && item.estado_recaudado==1)
      {
        valor = false;
      }
    }

    if(this.proceso=="ENVIARCORREO" || this.proceso == "CREARRIDE" || this.proceso == "DESCARGARXML" || this.proceso == "DESCARGARRIDE")
    {
      if(item.estado == "AUTORIZADO")
      {
        valor = false;
      }
    }

    if(this.proceso=="CAMBIARFECHA")
    {
      if(item.estado == "CREADA" || item.estado == "DEVUELTA" || item.estado == "NO AUTORIZADO")
      {
        valor = false;
      }
    }

    if(this.proceso == "DESCARGARFACTURA")
    {
      if(item.tipo_venta == "RECIBO")
      {
        valor = false;
      }
    }

    return valor;
  }

  changeCheckedTodos(event: any) {
    const isChecked = event.target.checked;
    if(this.proceso=="FIRMADO")
    {
      const estadosPermitidos = ["CREADA", "DEVUELTA", "NO AUTORIZADO"];

      this.datos = this.datos.map(item => ({
        ...item,
        seleccion: estadosPermitidos.includes(item.estado) ? isChecked : item.seleccion
      }));
    }

    if(this.proceso=="ENVIARSRI")
    {
      const estadosPermitidos = ["CREADA", "EN PROCESO", "DEVUELTA", "NO AUTORIZADO"];

      this.datos = this.datos.map(item => ({
        ...item,
        seleccion: (estadosPermitidos.includes(item.estado) && item.estado_recaudado == 1) ? isChecked : item.seleccion
      }));
    }

    if(this.proceso=="ENVIARCORREO" || this.proceso=="CREARRIDE" || this.proceso == "DESCARGARXML" || this.proceso == "DESCARGARRIDE")
    {
      const estadosPermitidos = ["AUTORIZADO"];

      this.datos = this.datos.map(item => ({
        ...item,
        seleccion: estadosPermitidos.includes(item.estado) ? isChecked : item.seleccion
      }));
    }

    if(this.proceso=="CAMBIARFECHA")
    {
      const estadosPermitidos = ["CREADA", "DEVUELTA", "NO AUTORIZADO"];

      this.datos = this.datos.map(item => ({
        ...item,
        seleccion: estadosPermitidos.includes(item.estado) ? isChecked : item.seleccion
      }));
    }

    if(this.proceso == "DESCARGARFACTURA")
    {
      const estadosPermitidos = ["RECIBO"];

      this.datos = this.datos.map(item => ({
        ...item,
        seleccion: estadosPermitidos.includes(item.tipo_venta) ? isChecked : item.seleccion
      }));
    }
    
  }

  async listarFormaPagos(): Promise<void> {
      this.datosformapago = [];
      this.loading = true;
  
      try {
        const data = await firstValueFrom(this.formapagoservice.listarFormaPagos());
  
        this.datosformapago = data;
  
        const formapago = {
          id_forma_pago: 0,
          forma_pago: "TODOS",
          cod_tipo_tarjeta: 0,
          estado: 1
        };
  
        this.datosformapago.unshift(formapago);
  
      } catch (err) {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        throw err;
      } finally {
        this.loading = false;
      }
    }

  keyFiltrado()
  {
    this.page = 1;
  }

  changeSucursal(event: any): void {
    const elemento = event.target.value;
    this.cod_sucursal= elemento;
    this.listarRucEmpresas();
  }

  changeEmpresa(event: any): void {
      const elemento = event.target.value;
      this.cod_ruc = elemento;
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  clickBuscar()
  {
    if(this.datossucursal.length>0)
    {
      if(this.cod_tipo_comprobante=="1")
      {
        this.listarFacturas(1);
      }
      
      if(this.cod_tipo_comprobante=="2")
      {
        this.listarNotasCreditos(1);
      }
    }
    else
    {
      this.toastr.warning("Presiona F5 o Recarga la página, no se completó la conexión correctamente debido error de conectividad", "INFORMACIÓN DEL SISTEMA");
    }
  }

  formularioNormal()
  {
    this.page = 1;
    this.filterpost="";

    this.estado = "0";
    this.proceso = "0";

    this.fechadesde = moment().format('YYYY-MM-DD');
    this.fechahasta = moment().format('YYYY-MM-DD');

    this.checktodos = false;

    this.fechaactualizar = "";

    this.datos = [];
    //this.datossucursal = [];

    const savedtipoformulario = sessionStorage.getItem("tipo_formulario");//Restaurar datos
    const savedcodsucursal = sessionStorage.getItem("cod_sucursal");
    const savedpage = parseInt(sessionStorage.getItem("page"));
    const savedfechadesde = sessionStorage.getItem("fechadesde");
    const savedfechahasta = sessionStorage.getItem("fechahasta");
    if (savedtipoformulario=="explorador_factura") {
      this.cod_sucursal = savedcodsucursal;
      this.fechadesde = savedfechadesde;
      this.fechahasta = savedfechahasta;
      sessionStorage.removeItem("tipo_formulario");
      sessionStorage.removeItem("cod_sucursal");
      sessionStorage.removeItem("estado");
      sessionStorage.removeItem("page");
      sessionStorage.removeItem("fechadesde");
      sessionStorage.removeItem("fechahasta");
      this.listarFacturas(savedpage);
    }
    else
    {
      sessionStorage.removeItem("tipo_formulario");
      sessionStorage.removeItem("cod_sucursal");
      sessionStorage.removeItem("estado");
      sessionStorage.removeItem("page");
      sessionStorage.removeItem("fechadesde");
      sessionStorage.removeItem("fechahasta");
    }

    this.id_forma_pago = "0";
    this.cod_tipo_comprobante = "1";
    this.cod_tipo_documento = "1";
  }

  mantenerEstados()
  {
    sessionStorage.setItem("tipo_formulario", "explorador_factura");//Restaurar datos
    sessionStorage.setItem("cod_sucursal", this.cod_sucursal);
    sessionStorage.setItem("page", String(this.page));
    sessionStorage.setItem("fechadesde", this.fechadesde);
    sessionStorage.setItem("fechahasta", this.fechahasta);
  }
 
  listarFacturas(page: number)
  {
    this.proceso = "0";
    this.checktodos = false;

    this.page = page;
    this.filterpost="";
    
    let opcion = "exploradorfacturas";
    this.loading = true;
    

    this.ventaservice.listarFacturas(this.fechadesde, this.fechahasta, opcion, this.cod_sucursal, this.estado, this.cod_tipo_documento, this.opcionesprivilegios.solomiscomprobantes, this.cod_ruc, this.id_forma_pago).subscribe( (data : any) =>
    {
      this.datos = data.map(obj => ({ ...obj, seleccion: false, fila_error: false }));
      //console.log(this.datos);
      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
    
  }

  listarNotasCreditos(page: number)
  {
    this.proceso = "0";
    this.checktodos = false;

    this.page = page;
    this.filterpost="";
    
    let opcion = "exploradornotascreditos";
    this.loading = true;

    this.notacreditoservice.listarNotasCreditos(this.fechadesde, this.fechahasta, opcion, this.cod_sucursal, this.estado, this.cod_tipo_documento, this.cod_ruc, this.id_forma_pago).subscribe( (data : any) =>
    {
      this.datos = data.map(obj => ({ ...obj, seleccion: false, fila_error: false }));
      //console.log(this.datos);
      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
    
  }

  listarSucursales()
  {    
    this.loading = true;
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.sucursalesservice.listarSucursales().subscribe( (data : any) =>
    {
      this.loading = false;
      this.datossucursal = data;
      this.listarRucEmpresas();
      this.formularioNormal();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  listarRucEmpresas()
  {    
    this.loading = true;
    this.rucempresaservice.listarRucEmpresas(this.cod_sucursal).subscribe( (data : any) =>
    {
      this.loading = false;
      this.datosrucempresa = data;

      let objetoidentificacion = {
        "cod_ruc" : "0",
        "empresa": "TODOS"
      }
      this.datosrucempresa.unshift(objetoidentificacion);
      this.listarFormaPagos();
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }

  handlePageChange(event: number): void {
    this.page = event;
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

  async clickGenerarRide()
  {
    const seleccionados = this.datos.some(item => item.seleccion == true);
    if(seleccionados)
    {
        const ok = await this.swalservice.alertConfirmNoRequerido({
          title: "Generación de Documentos RIDE",
          text: "Desea generar el RIDE a los comprobantes seleccionados",
          icon: "info",
          confirmText: "Si, Generar",
          cancelText: "No, Cerrar"
        });

        if (ok)
        {
          this.procesarRide();
        }
    }
    else
    {
      this.presentarMensaje("Selecciona al menos un comprobante para verificar y actualizar los estados", "info");
    }
  }

  async procesarRide(): Promise<void> {

    this.checktodos = false;
    this.datos = this.datos.map(obj => ({ ...obj, fila_error: false, mensajesri: "" }));
    this.swalservice.iniciarLoading("Procesando RIDE...");

    for (const item of this.datos) {
      if (item.seleccion) {
        try
        {
          const { cliente, rucempresa, facturaventa, formapago, datosdetalles } = await this.sriventa.buscarFactura(item.cod_factura_venta, this.codigo_iva);
          let arrfacturaventa = await this.sriventa.crearArregloFacturaVenta(this.cod_proyecto, cliente, rucempresa, facturaventa, formapago, datosdetalles);
          const resultadoride = await this.sriventa.crearRide(arrfacturaventa, cliente);

        } catch (error) {
          item.fila_error = true;
        }
      }
    }
    
    this.swalservice.close();
    const error = this.datos.some(item => item.fila_error == true);
    if(error)
    {
      this.presentarMensaje("No se pudo procesar completamente los RIDE de los comprobantes electrónicos, revisa y crealos de nuevo", "error");
    }
    else
    {
      this.presentarMensaje("Se crearon todos los RIDE de los comprobantes electrónicos satisfactoriamente", "info");
    }


  }

  async clickEnviarCorreo()
  {
    const seleccionados = this.datos.some(item => item.seleccion == true);
    if(seleccionados)
    {
        const ok = await this.swalservice.alertConfirmNoRequerido({
          title: "Envios de Correo de Comprobantes",
          text: "Desea enviar correos electrónicos de comprobantes seleccionados",
          icon: "info",
          confirmText: "Si, Enviar",
          cancelText: "No, Cerrar"
        });

        if (ok)
        {
          this.procesarCorreos();
        }
    }
    else
    {
      this.presentarMensaje("Selecciona al menos un comprobante para verificar y actualizar los estados", "info");
    }
  }

  async procesarCorreos(): Promise<void> {
    this.swalservice.iniciarLoading("Procesando Correos...");
    for (const item of this.datos) {
      if (item.seleccion) {
        try {

          let facturaventa: FacturaVentaDTO = new FacturaVentaDTO;
          facturaventa.cod_factura_venta = item.cod_factura_venta;
          facturaventa.numero_factura = item.numero_factura;

          let cliente: ClienteDTO = new ClienteDTO;
          cliente.correo = item.correo;
          cliente.cliente = item.cliente;

          let ruc = this.datosrucempresa.find( (valor : any) => valor.cod_ruc == this.cod_ruc );

          let rucempresa: RucEmpresaDTO = new RucEmpresaDTO;
          rucempresa.nombre_comercial = ruc.nombrecomercial
          rucempresa.serieestab = item.serieestab;
          rucempresa.ptoemi = item.ptoemi;

          const resultadoenviocorreo = await this.sriventa.enviarCorreo(this.cod_proyecto, facturaventa, cliente, rucempresa);
          if(resultadoenviocorreo)
          {
            await this.sriventa.actualizarEstadoCorreo(facturaventa.cod_factura_venta);
          }
        } catch (error) {
          item.fila_error = true;
        }
      }
    }
    this.swalservice.close();
    const error = this.datos.some(item => item.fila_error == true);
    if(error)
    {
      this.presentarMensaje("No se pudo enviar algunos correos al cliente, revisa si los correos son válidos para que puedas enviar de nuevo", "error");
    }
    else
    {
      this.presentarMensaje("Se enviaron todos los correos electrónicos satisfactoriamente", "info");
    }
  }

  async clickActualizarFechas()
  {
    const seleccionados = this.datos.some(item => item.seleccion == true);
    if(seleccionados)
    {
        const ok = await this.swalservice.alertConfirmNoRequerido({
          title: "Actualización de Fechas a Comprobantes",
          text: "Desea actualizar fechas a comprobantes seleccionados",
          icon: "info",
          confirmText: "Si, Actualizar",
          cancelText: "No, Cerrar"
        });

        if (ok)
        {
          this.procesarCambioFechas();
        }
    }
    else
    {
      this.presentarMensaje("Selecciona al menos un comprobante para verificar y actualizar los estados", "info");
    }
  }

  async procesarCambioFechas(): Promise<void> {

    if(this.fechaactualizar.length==0)
    {
      this.presentarMensaje("Escriba o seleccione una fecha correcta", "error");
    }
    else
    {
      this.swalservice.iniciarLoading("Procesando cambios fechas...");
      for (const item of this.datos) {
        if (item.seleccion) {
          try
          {
            let estado = await this.comprobarSriRapido(item);
            if(estado)
            {
              throw new Error("La venta está autorizada en el SRI");
            }
            else
            {
              await this.actualizarFechaClaveAcceso(item);
            }
          } catch (error) {
            item.fila_error = true;
          }
        }
      }
      this.swalservice.close();
      const error = this.datos.some(item => item.fila_error == true);
      if(error)
      {
        this.presentarMensaje("No se pudo actualizar las fechas y las claves de acceso de algunos comprobantes, revisa desde el Explorador de Ventas que no esten Autorizados así sea con estados CREADA, DEVUELTA, NO AUTORIZADA o en PROCESO", "error");
      }
      else
      {
        this.presentarMensaje("Se actualizaron las fechas y las claves de acceso de todos los comprobantes satisfactoriamente", "info");
      }
    }
  }

  async comprobarSriRapido(item: any): Promise<boolean>
  {
      let parametros = {
          'cod_proyecto' : this.cod_proyecto,
          'cod_factura_venta' : item.cod_factura_venta,
		      'claveacceso' : item.claveacceso
        };
      
        let valor = true;
        let data: any = await lastValueFrom(this.ventaservice.comprobarSriRapido(parametros));

        if (data.estado == true)
        {
          if(data.estadomensaje=="AUTORIZADO")
          {
            
          }

          if(data.estadomensaje=="EN PROCESO")
          {
            valor = false;
          }

          if(data.estadomensaje=="NO AUTORIZADO")
          {
            valor = false;
          }

          if(data.estadomensaje=="DEVUELTA")
          {
            valor = false;
          }
        }
        else
        {
          valor = false;
        }
        return valor;
  }

  async actualizarFechaClaveAcceso(item: any): Promise<any> { //Esto equivale al return Promise
    const parametros = {
      'cod_factura_venta' : item.cod_factura_venta,
      'n_factura_venta' : item.numero_factura,
      'ruc' : item.ruc_sucursal,
      'tipoambiente' : item.tipo_ambiente,
      'serieestab' : item.serieestab,
      'ptoemi' : item.ptoemi,
      'fecha_hora' : this.fechaactualizar
    };

    const data = await lastValueFrom(this.ventaservice.actualizarFechaClaveAcceso(parametros)) as any;
     if (!data || data.estado == false) throw null;
     return data;
  }
 
  async clickDescargasXMLAutorizado()
  {
    const ok = await this.swalservice.alertConfirmNoRequerido({
      title: "Descarga de XML Autorizados",
      text: "Desea descargar los XML de comprobantes seleccionados",
      icon: "info",
      confirmText: "Si, Descargar",
      cancelText: "No, Cerrar"
    });

    if (ok)
    {
      this.procesarDescargasXMLAutorizado();
    }
  }

  async clickDescargasRIDE()
  {
    const ok = await this.swalservice.alertConfirmNoRequerido({
      title: "Descarga de RIDE de comprobantes",
      text: "Desea descargar los RIDE de comprobantes seleccionados",
      icon: "info",
      confirmText: "Si, Descargar",
      cancelText: "No, Cerrar"
    });

    if (ok)
    {
      this.procesarDescargasRIDE();
    }
  }

  async clickDescargasFactura()
  {
    const ok = await this.swalservice.alertConfirmNoRequerido({
      title: "Descarga de Factura de comprobantes",
      text: "Desea descargar las plantillas de comprobantes seleccionados",
      icon: "info",
      confirmText: "Si, Descargar",
      cancelText: "No, Cerrar"
    });

    if (ok)
    {
      this.procesarDescargasFacturas();
    }
  }

  async procesarDescargasXMLAutorizado(): Promise<void> {

    const seleccionados = this.datos
            .filter(x => x.seleccion)
            .map(x => ({
              cod_factura_venta: x.cod_factura_venta,
              numero_factura: x.numero_factura,
              serieestab: x.serieestab,
              ptoemi: x.ptoemi
            }));

          if (seleccionados.length === 0) {
            this.presentarMensaje("No has seleccionado facturas", "warning");
            return;
          }

          this.swalservice.iniciarLoading("Generando ZIP XML...");

          const parametros = {
            cod_proyecto: this.cod_proyecto,
            facturas: seleccionados
          };

          try {
            const blob = await this.ventaservice.descargarXMLMasivo(parametros);

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'xml.zip';
            a.click();

            window.URL.revokeObjectURL(url);

            this.presentarMensaje("Descarga completada", "info");

          } catch (error) {
            this.presentarMensaje("Error al descargar", "error");
          }

          this.swalservice.close();
  }

  async procesarDescargasRIDE(): Promise<void> {
          const seleccionados = this.datos
            .filter(x => x.seleccion)
            .map(x => ({
              cod_factura_venta: x.cod_factura_venta,
              numero_factura: x.numero_factura,
              serieestab: x.serieestab,
              ptoemi: x.ptoemi
            }));

          if (seleccionados.length === 0) {
            this.presentarMensaje("No has seleccionado facturas", "warning");
            return;
          }

          this.swalservice.iniciarLoading("Generando ZIP RIDE...");

          const parametros = {
            cod_proyecto: this.cod_proyecto,
            facturas: seleccionados
          };

          try {
            const blob = await this.ventaservice.descargarRidesMasivo(parametros);

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'rides.zip';
            a.click();

            window.URL.revokeObjectURL(url);

            this.presentarMensaje("Descarga completada", "info");

          } catch (error) {
            this.presentarMensaje("Error al descargar", "error");
          }

          this.swalservice.close();
  }

  async procesarDescargasFacturas(): Promise<void> {
          const seleccionados = this.datos
            .filter(x => x.seleccion)
            .map(x => ({
              cod_factura_venta: x.cod_factura_venta,
              numero_factura: x.numero_factura,
              serieestab: x.serieestab,
              ptoemi: x.ptoemi
            }));

          if (seleccionados.length === 0) {
            this.presentarMensaje("No has seleccionado facturas", "warning");
            return;
          }

          this.swalservice.iniciarLoading("Generando ZIP...");

          const parametros = {
            cod_proyecto: this.cod_proyecto,
            facturas: seleccionados
          };

          try {
            const blob = await this.ventaservice.descargarFacturasMasivo(parametros);

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'facturas.zip';
            a.click();

            window.URL.revokeObjectURL(url);

            this.presentarMensaje("Descarga completada", "info");

          } catch (error) {
            this.presentarMensaje("Error al descargar", "error");
          }

          this.swalservice.close();
  }

  revisarDocumentoError(cod_factura_venta: string)
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/facturas/4_rechazados/" + cod_factura_venta + ".xml", "Documento", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }

  revisarDocumentoXml(cod_factura_venta: string)
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/facturas/1_creados/" + cod_factura_venta + ".xml", "Documento", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }








  

  imprimirVenta(cod_factura_venta: string)
  {
    if(this.cod_tipo_documento=="1")
    {
      let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/facturaventa?codfacturaventa=" + cod_factura_venta + "&electronico=1", "Factura de Venta", 'width=600,height=400,left=300,top=100');
    miVentana.focus();
    }
    
   if(this.cod_tipo_documento=="3")
   {
     let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/recibo?codfacturaventa=" + cod_factura_venta + "&electronico=1", "Factura de Venta", 'width=600,height=400,left=300,top=100');
      miVentana.focus();
   }

  }

  descargarRide(cod_factura_venta: string)
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/facturas/0_ride/" + cod_factura_venta + ".pdf", "Ride", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }

  descargarXmlAutorizado(factura_venta: any)
  {
    window.open(this.configService.settings.baseUrlSri + "/ride/descargararchivofacuraventa.php?cod_proyecto=" + this.cod_proyecto + "&cod_factura_venta=" + factura_venta.cod_factura_venta + "&numero_factura=" + this.padLeft(factura_venta.numero_factura, 9) + "&serieestab=" + factura_venta.serieestab + "&ptoemi=" + factura_venta.ptoemi + "&op=1");
  }

  reiniciarFilasError()
  {
    for (const item of this.datos) {
      item.fila_error = false;
    }
  }

  presentarMensaje(texto: string, tipo: 'success' | 'error' | 'warning' | 'info' | 'question')
  {
    this.swalservice.alertOkSimple({
      title: "Control del Sistema",
      text: texto,
      icon: tipo
    });
  }




  imprimirNotaCredito(cod_nota_credito: string)
  {
      if(this.cod_tipo_documento=="1")
      {
      let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/notacredito?codnotacredito=" + cod_nota_credito, "Nota de Credito", 'width=600,height=400,left=300,top=100');
          miVentana.focus();
      }
      
    if(this.cod_tipo_documento=="3")
    {
      let miVentana = window.open(this.configService.settings.baseUrl + "/reportes/ventas/devolucionrecibo?codnotacredito=" + cod_nota_credito, "Devolución Nota de Venta", 'width=600,height=400,left=300,top=100');
        miVentana.focus();
    }
  }

  async clickDescargasXMLAutorizadoNotaCredito()
  {
    const ok = await this.swalservice.alertConfirmNoRequerido({
      title: "Descarga de XML Autorizados",
      text: "Desea descargar los XML de comprobantes seleccionados",
      icon: "info",
      confirmText: "Si, Descargar",
      cancelText: "No, Cerrar"
    });

    if (ok)
    {
      this.procesarDescargasXMLAutorizadoNotaCredito();
    }
  }

  async clickDescargasRIDENotaCredito()
  {
    const ok = await this.swalservice.alertConfirmNoRequerido({
      title: "Descarga de RIDE de comprobantes",
      text: "Desea descargar los RIDE de comprobantes seleccionados",
      icon: "info",
      confirmText: "Si, Descargar",
      cancelText: "No, Cerrar"
    });

    if (ok)
    {
      this.procesarDescargasRIDENotaCredito();
    }
  }

  async procesarDescargasXMLAutorizadoNotaCredito(): Promise<void> {

    const seleccionados = this.datos
            .filter(x => x.seleccion)
            .map(x => ({
              cod_nota_credito: x.cod_nota_credito,
              numero_nota_credito: x.numero_nota_credito,
              serieestab: x.serieestab,
              ptoemi: x.ptoemi
            }));

          if (seleccionados.length === 0) {
            this.presentarMensaje("No has seleccionado notas de créditos", "warning");
            return;
          }

          this.swalservice.iniciarLoading("Generando ZIP XML notas de créditos...");

          const parametros = {
            cod_proyecto: this.cod_proyecto,
            notascreditos: seleccionados
          };

          try {
            const blob = await this.notacreditoservice.descargarXMLMasivo(parametros);

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'xml.zip';
            a.click();

            window.URL.revokeObjectURL(url);

            this.presentarMensaje("Descarga completada", "info");

          } catch (error) {
            this.presentarMensaje("Error al descargar", "error");
          }

          this.swalservice.close();
  }

  async procesarDescargasRIDENotaCredito(): Promise<void> {
          const seleccionados = this.datos
            .filter(x => x.seleccion)
            .map(x => ({
              cod_nota_credito: x.cod_nota_credito,
              numero_nota_credito: x.numero_nota_credito,
              serieestab: x.serieestab,
              ptoemi: x.ptoemi
            }));

          if (seleccionados.length === 0) {
            this.presentarMensaje("No has seleccionado notas de créditos", "warning");
            return;
          }

          this.swalservice.iniciarLoading("Generando ZIP RIDE notas de créditos...");

          const parametros = {
            cod_proyecto: this.cod_proyecto,
            notascreditos: seleccionados
          };

          try {
            const blob = await this.notacreditoservice.descargarRidesMasivo(parametros);

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'rides.zip';
            a.click();

            window.URL.revokeObjectURL(url);

            this.presentarMensaje("Descarga completada", "info");

          } catch (error) {
            this.presentarMensaje("Error al descargar", "error");
          }

          this.swalservice.close();
  }


  descargarRideNotaCredito(cod_nota_credito: string)
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/notascredito/0_ride/" + cod_nota_credito + ".pdf", "Ride", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }

  descargarXmlAutorizadoNotaCredito(cod_nota_credito: string)
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/notascredito/3_autorizados/" + cod_nota_credito + ".xml", "Documento", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }

  revisarDocumentoErrorNotaCredito(cod_nota_credito: string)
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/notascredito/4_rechazados/" + cod_nota_credito + ".xml", "Documento", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }

  revisarDocumentoXmlNotaCredito(cod_nota_credito: string)
  {
    let miVentana = window.open(this.configService.settings.baseUrlSri + "/comprobantes/" + this.cod_proyecto + "/notascredito/1_creados/" + cod_nota_credito + ".xml", "Documento", 'width=800,height=700,left=300,top=100');
    miVentana.focus();
  }





}