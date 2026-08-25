import { Injectable } from '@angular/core';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { VentaService } from 'src/app/venta/services/venta.service';
import { redondeardecimales } from '../js/decimales.js';
import { ClienteDTO } from 'src/app/venta/models/cliente.dto';
import { FacturaVentaDTO } from 'src/app/venta/models/factura-venta.dto';
import { RucEmpresaDTO } from 'src/app/usuario/models/rucempresa.dto';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { RespuestaSri } from 'src/app/venta/models/respuesta-sri.interface.js';

@Injectable({
  providedIn: 'root'
})
export class SriVentaService {
  constructor(private ventaservice: VentaService, private toastr : ToastrService) {}

  async actualizarFechaClaveAccesoActual(cod_factura_venta: string, numero_factura: string, ruc_sucursal: string, tipo_ambiente: string, serieestab: string, ptoemi: string): Promise<any> { //Esto equivale al return Promise
    const parametros = {
      'cod_factura_venta' : cod_factura_venta,
      'numero_factura' : numero_factura,
      'ruc' : ruc_sucursal,
      'tipoambiente' : tipo_ambiente,
      'serieestab' : serieestab,
      'ptoemi' : ptoemi
    };

    try
    {
      const data: any = await lastValueFrom(this.ventaservice.actualizarFechaClaveAccesoActual(parametros));
      if (data.estado)
      {
        return data;
      }
      else
      {
        throw new Error("Se generó un error al actualizar la fecha y clave de acceso del comprobante");
      }
      
     } catch (err) {
      console.error("Error en el servidor en actualizar la fecha y clave de acceso: ", err);
      throw err;
    }
  }

  async buscarFactura(cod_factura_venta: string, codigo_iva: string)
  {
    try
    {
      let formapago = await this.buscarFormasPagoVenta(cod_factura_venta);
      let data: any = await lastValueFrom(this.ventaservice.buscarFactura(cod_factura_venta));

      if (!data || data.length === 0) {
        throw new Error("No se encontraron datos de la factura.");
      }

        let cliente: ClienteDTO = new ClienteDTO;
        let facturaventa: FacturaVentaDTO = new FacturaVentaDTO;
        let rucempresa: RucEmpresaDTO = new RucEmpresaDTO;

        facturaventa.cod_factura_venta = data[0].cod_factura_venta;

        facturaventa.estado = data[0].estado;
        facturaventa.envio = data[0].envio;
        rucempresa.cod_ruc = data[0].cod_ruc;
        rucempresa.empresa = data[0].empresa;
        
        facturaventa.tipo_venta = data[0].tipo_venta;

        facturaventa.cod_usuario = data[0].cod_usuario;

        facturaventa.numero_factura = this.padLeft(data[0].numero_factura, 9);
        facturaventa.claveacceso = data[0].claveacceso;
        rucempresa.serieestab = data[0].serieestab;
        rucempresa.ptoemi = data[0].ptoemi;
        rucempresa.ruc = data[0].ruc_sucursal;
        rucempresa.tipoambiente = data[0].tipo_ambiente;

        rucempresa.razon_social = data[0].razonsocial;
        rucempresa.nombre_comercial = data[0].nombrecomercial;
        rucempresa.direccion_matriz = data[0].direccion_matriz;
        rucempresa.direccion_establecimiento = data[0].direccion_establecimiento;
        rucempresa.tipo_contribuyente = data[0].tipo_contribuyente;
        rucempresa.contribuyente = data[0].contribuyente;
        rucempresa.contabilidad = data[0].contabilidad;
        rucempresa.leyenda = data[0].leyenda;
        
        rucempresa.firmap12 = data[0].firmap12;
        rucempresa.clavep12 = data[0].clavep12;
        rucempresa.pk12 = data[0].pk12;
        rucempresa.firmapublica = data[0].firmapublica;
        rucempresa.firmaprivada = data[0].firmaprivada;
        rucempresa.certificado = data[0].certificado;
    
        cliente.cod_identificacion = data[0].cod_identificacion;
        cliente.identificacion = data[0].identificacion;
        cliente.cod_cliente = data[0].cod_cliente;
        cliente.cliente = data[0].cliente;
        cliente.numero_identificacion = data[0].cedula;
        cliente.celular = data[0].celular;
        cliente.telefono = data[0].convencional;
        cliente.correo = data[0].correo;
        cliente.direccion = data[0].direccion;
    
        facturaventa.cod_empleado = data[0].cod_empleado;

        //this.childrecargofactura.recargo.cod_transaccion_tarjeta = data[0].cod_transaccion_tarjeta;
        //this.childrecargofactura.recargo.tarifa_recargo = data[0].porcentaje_tarjeta;

        rucempresa.facturaversion = data[0].facturaversion;
        facturaventa.iva = data[0].iva_general;
    
        facturaventa.diferencia = "";
        facturaventa.recibido = "";

        facturaventa.tipo_credito= data[0].tipo_credito;

        facturaventa.fecha_registro = moment(data[0].fecha_hora).format('YYYY-MM-DD');

        facturaventa.fechaautorizacion = moment(data[0].fechaautorizacion).format('YYYY-MM-DD HH:mm:ss');

        facturaventa.fecha_registro_hora= moment(data[0].fecha_hora).format('YYYY-MM-DD HH:mm:ss');

        facturaventa.codigo_iva = Number(codigo_iva);

        let datosdetalles = [];

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
            bpv1: element.bpv1,
            pv1: element.pv1,
            apv1: element.apv1,

            rpv2: element.rpv2,
            bpv2: element.bpv2,
            pv2: element.pv2,
            apv2: element.apv2,

            rpv3: element.rpv3,
            bpv3: element.bpv3,
            pv3: element.pv3,
            apv3: element.apv3
          }
          datosdetalles.push(detalle);
        });

        facturaventa.deudor = data[0].deudor;
          
        facturaventa.totalsinimpuestos = redondeardecimales(data[0].totalsinimpuestos, 2);
        facturaventa.totaldescuento = redondeardecimales(data[0].total_descuento, 2);
        facturaventa.totalconimpuestos = redondeardecimales(data[0].total_iva_general, 2);
        facturaventa.subtotal12 = redondeardecimales(data[0].subtotalconimpuesto, 2);
        facturaventa.subtotal0 = redondeardecimales(data[0].subtotalsinimpuesto, 2);
        facturaventa.totalconice = redondeardecimales(data[0].total_ice_general, 2);
        facturaventa.observacion = data[0].observacion;
        facturaventa.importetotal = redondeardecimales(data[0].importetotal, 2);

        //await this.childenviarsriventa.crearFirmarXml2(0, cliente, rucempresa, facturaventa, formapago, datosdetalles, "actualizar");
        return {
          cliente,
          rucempresa,
          facturaventa,
          formapago,
          datosdetalles
        };

    } catch (err) {
      console.error("Error en el servidor en buscarFactura: ", err);
      throw err; // Re-lanzar para que el componente lo detecte
    }
  }

  async buscarFormasPagoVenta(cod_factura_venta: string): Promise<any[]> {
    try {
        const data: any = await firstValueFrom(
          this.ventaservice.buscarFormasPagoVenta(cod_factura_venta)
        );

        if (data.cod_factura_venta_forma_pago == false) {
          return [];
        }

        return data;
    } catch (err: any) {
      console.log(err);
      throw err;
    }
  }

  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }

  async crearFirmarXml2(cod_proyecto: string, cliente: ClienteDTO, rucempresa: RucEmpresaDTO, facturaventa: FacturaVentaDTO, formapago: any, datosdetalles: any): Promise<any>
  {
    

    let detalles = [];
      datosdetalles.forEach(item => {

        let descripcion="";
        if(item.tarifa=="NORMAL")
        {
          descripcion = item.descripcion;
        }
        else
        {
          descripcion = item.tarifa + " - " + item.descripcion;
        }

        let detalle = {
          'codigoprincipal' : item.cod_producto,
          'codigoauxiliar' : 'NA',
          'descripcion' : descripcion,
          'cantidad' : item.cantidad_comprar,
          'preciounitario' : item.precio_base,
          'descuento' : item.descuento_calculado,
          'total' : item.total,//total preciototalsinimpuesto
          'codigo_iva' : item.codigo_iva,
          'iva' : item.porcentaje_iva,//0% y 12%
          'totaliva' : item.iva,//Valor total * % iva
          'totalice' : item.ice,//Valor del ice del producto
          'totalfinal' : item.total_final//No necesita el xml
        };
        detalles.push(detalle);
      });

      const arr_factura_venta = {
          'cod_proyecto' : cod_proyecto,
          'cod_factura_venta' : facturaventa.cod_factura_venta,
          'cod_sucursal' : rucempresa.cod_ruc,
          'ambiente' : rucempresa.tipoambiente,
          'tipoemision' : '1',
          'razonsocial' : rucempresa.razon_social,
          'nombrecomercial' : rucempresa.nombre_comercial,
          'ruc' : rucempresa.ruc,
          'claveacceso' : facturaventa.claveacceso,
          'coddoc' : '01',
          'estab' : rucempresa.serieestab,
          'ptoemi' : rucempresa.ptoemi,
          'secuencial' : facturaventa.numero_factura,
          'dirmatriz' : rucempresa.direccion_matriz,
          'tipocontribuyente': rucempresa.tipo_contribuyente,
          'contribuyente' : rucempresa.contribuyente,
          'leyenda' : rucempresa.leyenda,

          'facturaversion' : rucempresa.facturaversion,

          'firmap12' : rucempresa.firmap12,
          'clavep12' : rucempresa.clavep12,
          'pk12' : rucempresa.pk12,
          'firmapublica' : rucempresa.firmapublica,
          'firmaprivada' : rucempresa.firmaprivada,
          'certificado' : rucempresa.certificado,
      
          /*INFO FACTURA*/
          'fechaemision' : facturaventa.fecha_registro,
          'direstablecimiento' : rucempresa.direccion_establecimiento,
          'obligadocontabilidad' : rucempresa.contabilidad,
          'tipoidentificacioncomprador' : cliente.cod_identificacion,
          'razonsocialcomprador' : cliente.cliente,
          'identificacioncomprador' : cliente.numero_identificacion,
          'totalsinimpuestos' : facturaventa.totalsinimpuestos,
          'totaldescuento' : facturaventa.totaldescuento,
      
            'totaliva' : facturaventa.totalconimpuestos,
            'subtotalconimpuesto' : facturaventa.subtotal12,
            'subtotalsinimpuesto' : facturaventa.subtotal0,
            'totalice' : facturaventa.totalconice,
      
          'propina' : '0.00',
          'importetotal' : facturaventa.importetotal,
          'moneda' : 'DOLAR',
      
            'formapago' :  formapago,
            'total' : facturaventa.importetotal,//importetotal
      
          'direccion' : cliente.direccion,
          'celular' : cliente.celular,
          'correo' : cliente.correo,
          'observacion' : facturaventa.observacion,
          'detalles' : detalles,
          //'descripcionformapago' : formapago.forma_pago,
          'iva' : facturaventa.iva,
          'codigoiva' : facturaventa.codigo_iva,
          'fechaautorizacion' : facturaventa.fechaautorizacion
        };

        try
        {
          const data: any = await lastValueFrom(this.ventaservice.crearFirmarXml(arr_factura_venta));
          if (data && data.estado == true) {
            return arr_factura_venta;
          } else {
            throw new Error(data.mensaje || "Error en la generación del XML");
          }
        }
        catch (err) {
          console.error("Error en el servidor al firmar XML: ", err);
          throw err; 
        }   
  }

  async enviarSri(cod_proyecto: string, facturaventa: FacturaVentaDTO)
  {
      let parametros = {
          'cod_proyecto' : cod_proyecto,
          'cod_factura_venta' : facturaventa.cod_factura_venta
        };

      try
      {
        const data: any = await lastValueFrom(this.ventaservice.enviarSri(parametros));
        if (data.estado == true)//Si recibio el SRI y presentó mensajes integros claros
        {
          if(data.estadomensaje=="RECIBIDA")
          {
            return { estado: "RECIBIDA", data: data };
          }
          else
          {
            if(data.estadomensaje=="EN PROCESO")
            {
              return { estado: "EN PROCESO", data: data };
            }
            else
            {
              if(data.estadomensaje=="DEVUELTA")
              {
                return { estado: "DEVUELTA", data: data };
              }
              else//ERROR CONEXION
              {
                return { estado: "ERROR", data: data };
              }
            }
          }
        }
        else
        {
          throw new Error("Se Origino un error en el servidor Error 500: " + data.mensaje + " " + data.informacionadicional);
        }
      }
      catch (err) {
        console.error("Error en el servidor al enviar el comprobante al SRI en recepción: ", err);
        throw err; 
      }
  }

  async comprobarSri(cod_proyecto: string, facturaventa: FacturaVentaDTO): Promise<any>
  {
      let parametros = {
          'cod_proyecto' : cod_proyecto,
          'cod_factura_venta' : facturaventa.cod_factura_venta,
          'claveacceso' : facturaventa.claveacceso
        };
      
      try
      {
        const data: any = await lastValueFrom(this.ventaservice.comprobarSri(parametros));
        if (data.estado == true)
        {
            return { estado: true, data: data };
        }
        else
        {
          if(data.estadomensaje=="0")
          {
            return { estado: false, data: data }; 
          }
          else
          {
            throw new Error("Se Origino un error al comprobar documento " + data.mensaje + " " + data.informacionadicional);
          }
        }
      }
      catch (err) {
        console.error("Error en el servidor al enviar a comprobar el comprobante al SRI: ", err);
        throw err; 
      }
  }

  async comprobarSriRapido(cod_proyecto: string, facturaventa: FacturaVentaDTO): Promise<any>
  {
      let parametros = {
          'cod_proyecto' : cod_proyecto,
          'cod_factura_venta' : facturaventa.cod_factura_venta,
          'claveacceso' : facturaventa.claveacceso
        };
      
      try
      {
        const data: any = await lastValueFrom(this.ventaservice.comprobarSriRapido(parametros));
        if (data.estado == true)
        {
            return { estado: true, data: data };
        }
        else
        {
          if(data.estadomensaje=="0" || data.estadomensaje=="NA")//NA XML no se a creado
          {
            return { estado: false, data: data }; 
          }
          else
          {
            throw new Error("Se Origino un error al comprobar documento " + data.mensaje + " " + data.informacionadicional);
          }
        }
      }
      catch (err) {
        console.error("Error en el servidor al enviar a comprobar el comprobante al SRI: ", err);
        throw err; 
      }
  }

  async actualizarEstado(cod_factura_venta : string, n_autorizacion : string, mensaje_error : string, informacion_adicional : string, estado : string, fechaautorizacion: string): Promise<any>
  {
      let parametros = {
        'cod_factura_venta' : cod_factura_venta,
        'n_autorizacion' : n_autorizacion,
        'mensaje_error' : mensaje_error,
        'informacion_adicional' : informacion_adicional,
        'estado' : estado,
        'fechaautorizacion' : fechaautorizacion
      };

      try
      {
        const data: any = await lastValueFrom(this.ventaservice.actualizarEstado(parametros));
        if (data.estado == true)
        {
            return data;
        }
        else
        {
          throw new Error("No se actualizó el estado del comprobante electrónico, revisar en explorador de documentos");
        }
      }
      catch (err) {
        console.error("Error en el servidor al actualizar estado del comprobante en base de datos: ", err);
        throw err; 
      }
  }

  async actualizarEstadoError(cod_factura_venta : string, identificador : string, mensaje_error : string, informacion_adicional : string, estado : String): Promise<any>
  {
      let parametros = {
        'cod_factura_venta' : cod_factura_venta,
        'identificador' : identificador,
        'mensaje_error' : mensaje_error,
        'informacion_adicional' : informacion_adicional,
        'estado' : estado,
      };

      try
      {
        const data: any = await lastValueFrom(this.ventaservice.actualizarEstadoError(parametros));
        if (data.estado == true)
        {
            return data;
        }
        else
        {
          throw new Error("No se actualizó el estado del comprobante electrónico, revisar en explorador de documentos");
        }
      }
      catch (err) {
        console.error("Error en el servidor al actualizar estado del error de conexión del sri: ", err);
        throw err; 
      }
  }

  async crearRide(arr_factura_venta: any, cliente: ClienteDTO): Promise<boolean>
  {	 
    try
      {
        const data: any = await lastValueFrom(this.ventaservice.crearRide(arr_factura_venta));
        if(cliente.correo=="" || cliente.correo=="0" || cliente.correo==" " || cliente.correo.length==0)
        {
          throw new Error("No tiene el cliente un correo para enviar");
        }
        else
        {
          return true;
        }
      }
      catch (err) {
        console.error("Error en el servidor al crear Ride del comprobante: ", err);
        throw err; 
      }
  }

  async enviarCorreo(cod_proyecto: string, facturaventa: FacturaVentaDTO, cliente: ClienteDTO, rucempresa: RucEmpresaDTO): Promise<boolean>
  {
      let parametros = {
        'cod_proyecto' : cod_proyecto,
        'cod_factura_venta' : facturaventa.cod_factura_venta,
        'nombre_comercial' : rucempresa.nombre_comercial,
        'numero_factura' : facturaventa.numero_factura,
        'correo' : cliente.correo,
        'cliente' : cliente.cliente,
        'serieestab' : rucempresa.serieestab,
        'ptoemi' : rucempresa.ptoemi
        };
      
      try
      {
        const data: any = await lastValueFrom(this.ventaservice.enviarCorreoFactura(parametros));
        if(data.estado == false)
        {
          throw new Error("Correo no se pudo enviar al cliente");
        }
        else
        {
          return true;
        }
      }
      catch (err) {
        console.error("Error en el servidor al enviar comprobante al correo electrónico: ", err);
        throw err; 
      }
  }

  async actualizarEstadoCorreo(cod_factura_venta: string)
  {
      let parametros = {
        'cod_factura_venta' : cod_factura_venta
      };     

      try
      {
        const data: any = await lastValueFrom(this.ventaservice.actualizarEstadoCorreo(parametros));
        if(data.estado == false)
        {
          throw new Error("No se pudo actualizar estado de comprobante");
        }
        
      }
      catch (err) {
        console.error("Error en el servidor al actualizar estado del correo electrónico: ", err);
        throw err; 
      }
  }

  async crearArregloFacturaVenta(cod_proyecto: string, cliente: ClienteDTO, rucempresa: RucEmpresaDTO, facturaventa: FacturaVentaDTO, formapago: any, datosdetalles: any): Promise<any>
  {
    

    let detalles = [];
      datosdetalles.forEach(item => {

        let descripcion="";
        if(item.tarifa=="NORMAL")
        {
          descripcion = item.descripcion;
        }
        else
        {
          descripcion = item.tarifa + " - " + item.descripcion;
        }

        let detalle = {
          'codigoprincipal' : item.cod_producto,
          'codigoauxiliar' : 'NA',
          'descripcion' : descripcion,
          'cantidad' : item.cantidad_comprar,
          'preciounitario' : item.precio_base,
          'descuento' : item.descuento_calculado,
          'total' : item.total,//total preciototalsinimpuesto
          'codigo_iva' : item.codigo_iva,
          'iva' : item.porcentaje_iva,//0% y 12%
          'totaliva' : item.iva,//Valor total * % iva
          'totalice' : item.ice,//Valor del ice del producto
          'totalfinal' : item.total_final//No necesita el xml
        };
        detalles.push(detalle);
      });

      const arr_factura_venta = {
          'cod_proyecto' : cod_proyecto,
          'cod_factura_venta' : facturaventa.cod_factura_venta,
          'cod_sucursal' : rucempresa.cod_ruc,
          'ambiente' : rucempresa.tipoambiente,
          'tipoemision' : '1',
          'razonsocial' : rucempresa.razon_social,
          'nombrecomercial' : rucempresa.nombre_comercial,
          'ruc' : rucempresa.ruc,
          'claveacceso' : facturaventa.claveacceso,
          'coddoc' : '01',
          'estab' : rucempresa.serieestab,
          'ptoemi' : rucempresa.ptoemi,
          'secuencial' : facturaventa.numero_factura,
          'dirmatriz' : rucempresa.direccion_matriz,
          'tipocontribuyente': rucempresa.tipo_contribuyente,
          'contribuyente' : rucempresa.contribuyente,
          'leyenda' : rucempresa.leyenda,

          'facturaversion' : rucempresa.facturaversion,

          'firmap12' : rucempresa.firmap12,
          'clavep12' : rucempresa.clavep12,
          'pk12' : rucempresa.pk12,
          'firmapublica' : rucempresa.firmapublica,
          'firmaprivada' : rucempresa.firmaprivada,
          'certificado' : rucempresa.certificado,
      
          /*INFO FACTURA*/
          'fechaemision' : facturaventa.fecha_registro,
          'direstablecimiento' : rucempresa.direccion_establecimiento,
          'obligadocontabilidad' : rucempresa.contabilidad,
          'tipoidentificacioncomprador' : cliente.cod_identificacion,
          'razonsocialcomprador' : cliente.cliente,
          'identificacioncomprador' : cliente.numero_identificacion,
          'totalsinimpuestos' : facturaventa.totalsinimpuestos,
          'totaldescuento' : facturaventa.totaldescuento,
      
            'totaliva' : facturaventa.totalconimpuestos,
            'subtotalconimpuesto' : facturaventa.subtotal12,
            'subtotalsinimpuesto' : facturaventa.subtotal0,
            'totalice' : facturaventa.totalconice,
      
          'propina' : '0.00',
          'importetotal' : facturaventa.importetotal,
          'moneda' : 'DOLAR',
      
            'formapago' :  formapago,
            'total' : facturaventa.importetotal,//importetotal
      
          'direccion' : cliente.direccion,
          'celular' : cliente.celular,
          'correo' : cliente.correo,
          'observacion' : facturaventa.observacion,
          'detalles' : detalles,
          //'descripcionformapago' : formapago.forma_pago,
          'iva' : facturaventa.iva,
          'codigoiva' : facturaventa.codigo_iva,
          'fechaautorizacion': facturaventa.fechaautorizacion
        };

    
          return arr_factura_venta;
  }



  async verificarComprobanteSri(facturaventa: FacturaVentaDTO): Promise<any>
  {
    try
    {
      let parametros = {
          'claveacceso' : facturaventa.claveacceso
        };
      
      let valor = true;
      let data: any = await lastValueFrom(this.ventaservice.verificarComprobanteSri(parametros));

      if (data.estado == true)
        {
            return { estado: true, data: data };
        }
        else
        {
          if(data.estadomensaje=="0")
          {
            return { estado: false, data: data }; 
          }
          else
          {
            throw new Error("Se Origino un error al comprobar documento " + data.mensaje + " " + data.informacionadicional);
          }
        }

        
      } catch (err) {
        console.error("Error en el servidor al verificar comprobante en el SRI: ", err);
        throw err; 
    }
  }

  async iniciarProcesoFacturacion(cod_proyecto: string, cliente: ClienteDTO, rucempresa: RucEmpresaDTO, facturaventa: FacturaVentaDTO, datosformapagoseleccion: any, datosdetalles: any, metodoproceso: string)
  {
    let respuesta = {} as RespuestaSri;
      try
      {
        let arrfacturaventa: any;
        if(metodoproceso=="envio")
        {
          arrfacturaventa = await this.crearFirmarXml2(cod_proyecto, cliente, rucempresa, facturaventa, datosformapagoseleccion, datosdetalles);
        }
        else//reenvio
        {
          arrfacturaventa = await this.crearArregloFacturaVenta(cod_proyecto, cliente, rucempresa, facturaventa, datosformapagoseleccion, datosdetalles);
        }
        
        const resultado = await this.enviarSri(cod_proyecto, facturaventa);
        
        if (resultado.estado == "RECIBIDA")
        {
          const resultadocomprobacionsri = await this.comprobarSri(cod_proyecto, facturaventa);
          const data = resultadocomprobacionsri.data;
          if(resultadocomprobacionsri.estado)
          {
            if(data.estadomensaje=="AUTORIZADO")
            {
              this.toastr.success("Comprobante: Nº " + facturaventa.numero_factura  + " Autorizado", "INFORMACIÓN DEL SISTEMA");
              const resultadoestado = await this.actualizarEstado(facturaventa.cod_factura_venta, facturaventa.claveacceso, "", "", "AUTORIZADO", data.fechaautorizacion);

              respuesta = {
                  'estado_sri' : true,
                  'cod_factura_venta' : facturaventa.cod_factura_venta,
                  'estado' : 'AUTORIZADO',
                  'mensaje' : '',
                  'informacionadicional': '',
                  'fecha_hora': facturaventa.fecha_registro_hora,
                  'error_sri': 0,
                  'envio' : "NO",
                  'confirmar_envio': 'NO',
                  'confirmar_reenvio': 'NO',
                  'tiempo_espera_envio': 'NO',
                  'error_proceso': false
                };


              arrfacturaventa.fechaautorizacion = data.fechaautorizacion;
              const resultadoride = await this.crearRide(arrfacturaventa, cliente);
              if(resultadoride)
              {
                const resultadoenviocorreo = await this.enviarCorreo(cod_proyecto, facturaventa, cliente, rucempresa);
                if(resultadoenviocorreo)
                {
                  this.toastr.success("Comprobante: Nº " + facturaventa.numero_factura  + " enviado satisfactoriamente al cliente", "INFORMACIÓN DEL SISTEMA");
                  await this.actualizarEstadoCorreo(facturaventa.cod_factura_venta);
                  respuesta.envio = 'SI';
                }
              }
            }

            if(data.estadomensaje=="EN PROCESO")
            {
              this.toastr.warning("Comprobante: Nº " + facturaventa.numero_factura  + " en Proceso " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
              const resultadoestado = await this.actualizarEstado(facturaventa.cod_factura_venta, "0", data.mensaje, data.informacionadicional, "EN PROCESO", data.fechaautorizacion);
              respuesta = {
                'estado_sri' : true,
                'cod_factura_venta' : facturaventa.cod_factura_venta,
                'estado' : 'EN PROCESO',
                'mensaje' : data.mensaje,
                'informacionadicional': data.informacionadicional,
                'fecha_hora': facturaventa.fecha_registro_hora,
                'error_sri': 0,
                'envio' : "NO",
                'confirmar_envio': 'NO',
                'confirmar_reenvio': 'NO',
                'tiempo_espera_envio': 'NO',
                'error_proceso': false
              };
            }

            if(data.estadomensaje=="NO AUTORIZADO")
            {
              this.toastr.error("Comprobante: Nº " + facturaventa.numero_factura  + " No Autorizado: " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
              const resultadoestado = await this.actualizarEstado(facturaventa.cod_factura_venta, "0", data.mensaje, data.informacionadicional, "NO AUTORIZADO", data.fechaautorizacion);
              respuesta = {
                'estado_sri' : true,
                'cod_factura_venta' : facturaventa.cod_factura_venta,
                'estado' : 'NO AUTORIZADO',
                'mensaje' : data.mensaje,
                'informacionadicional': data.informacionadicional,
                'fecha_hora': facturaventa.fecha_registro_hora,
                'error_sri': 0,
                'envio' : "NO",
                'confirmar_envio': 'NO',
                'confirmar_reenvio': 'NO',
                'tiempo_espera_envio': 'NO',
                'error_proceso': false
              };
            }

            //FALTA DEVUELTA
          }
          else
          {
            if(data.identificador=="0")
            {
              this.toastr.warning("Comprobante: Nº " + facturaventa.numero_factura  + " en Proceso", "INFORMACIÓN DEL SISTEMA");
              const resultadoestado = await this.actualizarEstado(facturaventa.cod_factura_venta, "0", resultado.data.mensaje, resultado.data.informacionadicional, "EN PROCESO", resultado.data.fechaautorizacion);
              respuesta = {
                'estado_sri' : false,
                  'cod_factura_venta' : facturaventa.cod_factura_venta,
                  'estado' : 'EN PROCESO',
                  'mensaje' : resultado.data.mensaje,
                  'informacionadicional': resultado.data.informacionadicional,
                  'fecha_hora': facturaventa.fecha_registro_hora,
                  'error_sri': 0,
                  'envio' : "NO",
                  'confirmar_envio': 'NO',
                  'confirmar_reenvio': 'NO',
                  'tiempo_espera_envio': 'NO',
                  'error_proceso': false
                };
            }
          }
        }
        else
        {
          if(resultado.estado=="EN PROCESO")//En procesamiento debe esperar 24 Horas
          {
            this.toastr.warning("Comprobante: Nº " + facturaventa.numero_factura  + " en Proceso " + resultado.data.mensaje, "INFORMACIÓN DEL SISTEMA");
            const resultadoestado = await this.actualizarEstado(facturaventa.cod_factura_venta, "0", resultado.data.mensaje, resultado.data.informacionadicional, "EN PROCESO", resultado.data.fechaautorizacion);
            respuesta = {
              'estado_sri' : false,
                'cod_factura_venta' : facturaventa.cod_factura_venta,
                'estado' : 'EN PROCESO',
                'mensaje' : resultado.data.mensaje,
                'informacionadicional': resultado.data.informacionadicional,
                'fecha_hora': facturaventa.fecha_registro_hora,
                'error_sri': 0,
                'envio' : "NO",
                'confirmar_envio': 'NO',
                'confirmar_reenvio': "NO",
                'tiempo_espera_envio': 'NO',
                'error_proceso': false
            };
          }
          else
          {
            if(resultado.estado=="DEVUELTA")
            {
              this.toastr.error("Comprobante: Nº " + facturaventa.numero_factura  + " devuelta: " + resultado.data.mensaje + " " + resultado.data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
              const resultadoestado = await this.actualizarEstado(facturaventa.cod_factura_venta, "0", resultado.data.mensaje, resultado.data.informacionadicional, "DEVUELTA", resultado.data.fechaautorizacion);
              respuesta = {
                'estado_sri' : false,
                  'cod_factura_venta' : facturaventa.cod_factura_venta,
                  'estado' : 'DEVUELTA',
                  'mensaje' : resultado.data.mensaje,
                  'informacionadicional': resultado.data.informacionadicional,
                  'fecha_hora': facturaventa.fecha_registro_hora,
                  'error_sri': 0,
                  'envio' : "NO",
                  'confirmar_envio': 'NO',
                  'confirmar_reenvio': "NO",
                  'tiempo_espera_envio': 'NO',
                  'error_proceso': false
              };
            }
            else//ERROR CONEXION
            {
              this.toastr.error("Se Origino un error en el sistema de recepción de SRI con el comprobante Nº " + facturaventa.numero_factura + " => " + resultado.data.mensaje + " " + resultado.data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
              const resultadoestado = await this.actualizarEstadoError(facturaventa.cod_factura_venta, resultado.data.identificador, resultado.data.mensaje, resultado.data.informacionadicional, "CREADA");
              respuesta = {
                'estado_sri' : false,
                  'cod_factura_venta' : facturaventa.cod_factura_venta,
                  'estado' : 'CREADA',
                  'mensaje' : resultado.data.mensaje,
                  'informacionadicional': resultado.data.informacionadicional,
                  'fecha_hora': facturaventa.fecha_registro_hora,
                  'error_sri': 1,
                  'envio' : "NO",
                  'confirmar_envio': 'NO',
                  'confirmar_reenvio': "NO",
                  'tiempo_espera_envio': 'NO',
                  'error_proceso': false
              };
            }
          }
        }

      } catch (err) {
        this.toastr.error("Comprobante Nº " + facturaventa.numero_factura + " " + err.message || err, "INFORMACIÓN DEL SISTEMA");
        respuesta.error_proceso = true;
      } finally {
        return respuesta;
      }
      
  }


  async iniciarProcesoFacturacionComprobar(cod_proyecto: string, facturaventa1: FacturaVentaDTO, codigo_iva: string, error_sri: number)
  {
    let respuesta = {} as RespuestaSri;
      try
          {
            const resultadocomprobacionsri = await this.comprobarSriRapido(cod_proyecto, facturaventa1);
            if(resultadocomprobacionsri.estado)
            {
              const data = resultadocomprobacionsri.data;
              if(data.estadomensaje=="AUTORIZADO")
              {
                this.toastr.success("Comprobante ya está Autorizado", "INFORMACIÓN DEL SISTEMA");
  
                const resultadoestado = await this.actualizarEstado(facturaventa1.cod_factura_venta, facturaventa1.claveacceso, "", "", "AUTORIZADO", data.fechaautorizacion);

                //await this.informacionActualizarEstado(resultadoestado, "AUTORIZADO", data.fechaautorizacion);
                respuesta = {
                  'estado_sri' : true,
                  'cod_factura_venta' : facturaventa1.cod_factura_venta,
                  'estado' : 'AUTORIZADO',
                  'mensaje' : '',
                  'informacionadicional': '',
                  'fecha_hora': facturaventa1.fecha_registro_hora,
                  'error_sri': 0,
                  'envio' : "NO",
                  'confirmar_envio': 'NO',
                  'confirmar_reenvio': 'NO',
                  'tiempo_espera_envio': 'NO',
                  'error_proceso': false
                };
      
                const { cliente, rucempresa, facturaventa, formapago, datosdetalles } = await this.buscarFactura(facturaventa1.cod_factura_venta, codigo_iva);
                let arrfacturaventa = await this.crearArregloFacturaVenta(cod_proyecto, cliente, rucempresa, facturaventa, formapago, datosdetalles);
                const resultadoride = await this.crearRide(arrfacturaventa, cliente);
                if(resultadoride)
                {
                  const resultadoenviocorreo = await this.enviarCorreo(cod_proyecto, facturaventa, cliente, rucempresa);
                  if(resultadoenviocorreo)
                  {
                    //this.toastr.success("Correo enviado satisfactoriamente al cliente", "INFORMACIÓN DEL SISTEMA");
                    await this.actualizarEstadoCorreo(facturaventa.cod_factura_venta);
                    //await this.informacionActualizarEstadoCorreo(facturaventa.cod_factura_venta);
                    respuesta.envio = 'SI';
                  }
                }
              }
      
              if(data.estadomensaje=="EN PROCESO")
              {
                this.toastr.warning("Comprobante ya está en Proceso de Autorización " + data.mensaje, "INFORMACIÓN DEL SISTEMA");
                const resultadoestado = await this.actualizarEstado(facturaventa1.cod_factura_venta, "0", data.mensaje, data.informacionadicional, "EN PROCESO", data.fechaautorizacion);
                //await this.informacionActualizarEstado(resultadoestado, "EN PROCESO", data.fechaautorizacion);
                respuesta = {
                  'estado_sri' : true,
                  'cod_factura_venta' : facturaventa1.cod_factura_venta,
                  'estado' : 'EN PROCESO',
                  'mensaje' : data.mensaje,
                  'informacionadicional': data.informacionadicional,
                  'fecha_hora': facturaventa1.fecha_registro_hora,
                  'error_sri': 0,
                  'envio' : "NO",
                  'confirmar_envio': 'NO',
                  'confirmar_reenvio': 'NO',
                  'tiempo_espera_envio': 'NO',
                  'error_proceso': false
                };
              }
      
              if(data.estadomensaje=="DEVUELTA")
              {
                this.toastr.error("Comprobante Devuelta: " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
                const resultadoestado = await this.actualizarEstado(facturaventa1.cod_factura_venta, "0", data.mensaje, data.informacionadicional, "DEVUELTA", data.fechaautorizacion);
                //await this.informacionActualizarEstado(resultadoestado, "EN PROCESO", data.fechaautorizacion);
                //await this.confirmarEnvioComprobante();
                respuesta  = {
                  'estado_sri' : true,
                  'cod_factura_venta' : facturaventa1.cod_factura_venta,
                  'estado' : 'DEVUELTA',
                  'mensaje' : data.mensaje,
                  'informacionadicional': data.informacionadicional,
                  'fecha_hora': facturaventa1.fecha_registro_hora,
                  'error_sri': 0,
                  'envio' : "NO",
                  'confirmar_envio': 'SI',
                  'confirmar_reenvio': 'NO',
                  'tiempo_espera_envio': 'NO',
                  'error_proceso': false
                };
              }
      
              if(data.estadomensaje=="NO AUTORIZADO")
              {
                this.toastr.error("Comprobante No Autorizado: " + data.mensaje + " " + data.informacionadicional, "INFORMACIÓN DEL SISTEMA");
                const resultadoestado = await this.actualizarEstado(facturaventa1.cod_factura_venta, "0", data.mensaje, data.informacionadicional, "NO AUTORIZADO", data.fechaautorizacion);
                //await this.informacionActualizarEstado(resultadoestado, "NO AUTORIZADO", data.fechaautorizacion);
                //await this.confirmarEnvioComprobante();
                respuesta = {
                  'estado_sri' : true,
                  'cod_factura_venta' : facturaventa1.cod_factura_venta,
                  'estado' : 'NO AUTORIZADO',
                  'mensaje' : data.mensaje,
                  'informacionadicional': data.informacionadicional,
                  'fecha_hora': facturaventa1.fecha_registro_hora,
                  'error_sri': 0,
                  'envio' : "NO",
                  'confirmar_envio': 'SI',
                  'confirmar_reenvio': 'NO',
                  'tiempo_espera_envio': 'NO',
                  'error_proceso': false
                };
              }
            }
            else
            { 
              if(facturaventa1.estado=="EN PROCESO")
              {
                const fecha_hora_servidor =  resultadocomprobacionsri.data.fechahora;
                const fecha_hora = facturaventa1.fecha_registro_hora;
                const momentservidor = moment(fecha_hora_servidor);
                const momentfactura = moment(fecha_hora).add(1, 'days'); // Sumamos 24 horas
      
                if (momentfactura.isAfter(momentservidor))
                {
                 respuesta = {
                  'estado_sri' : false,
                    'cod_factura_venta' : facturaventa1.cod_factura_venta,
                    'estado' : 'EN PROCESO',
                    'mensaje' : '',
                    'informacionadicional': '',
                    'fecha_hora': facturaventa1.fecha_registro_hora,
                    'error_sri': 0,
                    'envio' : "NO",
                    'confirmar_envio': 'NO',
                    'confirmar_reenvio': 'NO',
                    'tiempo_espera_envio': 'SI',//Menos de las 24 horas,
                    'error_proceso': false
                  };
                }
                else
                {
                    //await this.confirmarEnvioComprobante();
                    respuesta = {
                      'estado_sri' : false,
                        'cod_factura_venta' : facturaventa1.cod_factura_venta,
                        'estado' : 'EN PROCESO',
                        'mensaje' : '',
                        'informacionadicional': '',
                        'fecha_hora': facturaventa1.fecha_registro_hora,
                        'error_sri': 0,
                        'envio' : "NO",
                        'confirmar_envio': 'SI',
                        'confirmar_reenvio': 'NO',
                        'tiempo_espera_envio': 'NO',
                        'error_proceso': false
                    };
                }
              }
              else
              {
                if(error_sri==1)//Hubo error en el SRI en recepción
                {
                  const fecha_hora_servidor =  resultadocomprobacionsri.data.fechahora;
                  const fecha_hora = facturaventa1.fecha_registro_hora;
                  const momentservidor = moment(fecha_hora_servidor);
                  const momentfactura = moment(fecha_hora).add(1, 'days'); // Sumamos 24 horas
                  if (momentfactura.isAfter(momentservidor))//Si es mayor envia sin actualizar comprobante
                  {
                    //await this.confirmarReenvioComprobante();
                    respuesta = {
                      'estado_sri' : false,
                        'cod_factura_venta' : facturaventa1.cod_factura_venta,
                        'estado' : 'EN PROCESO',
                        'mensaje' : '',
                        'informacionadicional': '',
                        'fecha_hora': facturaventa1.fecha_registro_hora,
                        'error_sri': 0,
                        'envio' : "NO",
                        'confirmar_envio': 'NO',
                        'confirmar_reenvio': "SI",
                        'tiempo_espera_envio': 'NO',
                        'error_proceso': false
                    };
                  }
                  else
                  {
                    //await this.confirmarEnvioComprobante();
                    respuesta = {
                      'estado_sri' : false,
                        'cod_factura_venta' : facturaventa1.cod_factura_venta,
                        'estado' : 'EN PROCESO',
                        'mensaje' : '',
                        'informacionadicional': '',
                        'fecha_hora': facturaventa1.fecha_registro_hora,
                        'error_sri': 0,
                        'envio' : "NO",
                        'confirmar_envio': 'SI',
                        'confirmar_reenvio': 'NO',
                        'tiempo_espera_envio': 'NO',
                        'error_proceso': false
                    };
                  }
                }
                else
                {
                  //await this.confirmarEnvioComprobante();
                  respuesta = {
                      'estado_sri' : false,
                        'cod_factura_venta' : facturaventa1.cod_factura_venta,
                        'estado' : 'EN PROCESO',
                        'mensaje' : '',
                        'informacionadicional': '',
                        'fecha_hora': facturaventa1.fecha_registro_hora,
                        'error_sri': 0,
                        'envio' : "NO",
                        'confirmar_envio': 'SI',
                        'confirmar_reenvio': 'NO',
                        'tiempo_espera_envio': 'NO',
                        'error_proceso': false
                    };
                }
              }
            }
      
          } catch (err) {
            //this.toastr.error(err.message || err, "INFORMACIÓN DEL SISTEMA");
            this.toastr.error("Comprobante Nº " + facturaventa1.numero_factura + " " + err.message || err, "INFORMACIÓN DEL SISTEMA");
            respuesta.fecha_hora = facturaventa1.fecha_registro_hora,
            respuesta.error_proceso = true;
          } finally {
            return respuesta;
          }
  }

}