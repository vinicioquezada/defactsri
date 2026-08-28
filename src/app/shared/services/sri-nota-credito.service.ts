import { Injectable } from '@angular/core';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { NotaCreditoService } from 'src/app/venta/services/nota-credito.service';
import { redondeardecimales } from '../js/decimales.js';
import { ClienteDTO } from 'src/app/venta/models/cliente.dto';
import { RucEmpresaDTO } from 'src/app/usuario/models/rucempresa.dto';
import * as moment from 'moment';
import { NotaCreditoDTO } from 'src/app/venta/models/nota-credito.dto';


@Injectable({
  providedIn: 'root'
})
export class SriNotaCreditoService {
constructor(private notacreditoservice: NotaCreditoService) {}

  async actualizarFechaClaveAccesoActual(cod_nota_credito: string, n_nota_credito: string, ruc_sucursal: string, tipo_ambiente: string, serieestab: string, ptoemi: string): Promise<any> { //Esto equivale al return Promise
    const parametros = {
      'cod_nota_credito' : cod_nota_credito,
      'numero_nota_credito' : n_nota_credito,
      'ruc' : ruc_sucursal,
      'tipoambiente' : tipo_ambiente,
      'serieestab' : serieestab,
      'ptoemi' : ptoemi
    };

    try
    {
      const data: any = await lastValueFrom(this.notacreditoservice.actualizarFechaClaveAccesoActual(parametros));
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

  async buscarNotaCredito(cod_nota_credito: string, codigo_iva: string)
  {
    try
    {
      let data: any = await lastValueFrom(this.notacreditoservice.buscarNotaCredito(cod_nota_credito));

      if (!data || data.length === 0) {
        throw new Error("No se encontraron datos de la factura.");
      }

        let cliente: ClienteDTO = new ClienteDTO;
        let notacredito: NotaCreditoDTO = new NotaCreditoDTO;
        let rucempresa: RucEmpresaDTO = new RucEmpresaDTO;

        notacredito.cod_nota_credito = data[0].cod_nota_credito;
        notacredito.n_nota_credito = this.padLeft(data[0].numero_nota_credito, 9);
        
        notacredito.fecha_hora = moment(data[0].fecha_hora).format('YYYY-MM-DD');
        notacredito.fecha_emision_factura = moment(data[0].fecha_emision_factura).format('YYYY-MM-DD');

        rucempresa.cod_ruc = data[0].cod_ruc;
        rucempresa.empresa = data[0].empresa;
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
        rucempresa.facturaversion = data[0].facturaversion;

        notacredito.cod_factura_venta = data[0].cod_factura_venta;
        notacredito.estado = data[0].estado;
        notacredito.envio = data[0].envio;
        notacredito.tipo_venta = data[0].tipo_venta;
        notacredito.cod_usuario = data[0].cod_usuario;
        notacredito.numero_factura = this.padLeft(data[0].numero_factura, 9);
        notacredito.claveacceso = data[0].claveacceso;
        notacredito.cod_empleado = data[0].cod_empleado;
        notacredito.iva = data[0].iva_general;

        notacredito.fechaautorizacion = moment(data[0].fechaautorizacion).format('YYYY-MM-DD HH:mm:ss');
        notacredito.fecha_registro_hora= moment(data[0].fecha_hora).format('YYYY-MM-DD HH:mm:ss');

        notacredito.codigo_iva = Number(codigo_iva);

        notacredito.razon_modificacion = data[0].motivo;
    
        cliente.cod_identificacion = data[0].cod_identificacion;
        cliente.identificacion = data[0].identificacion;
        cliente.cod_cliente = data[0].cod_cliente;
        cliente.cliente = data[0].cliente;
        cliente.numero_identificacion = data[0].cedula;
        cliente.celular = data[0].celular;
        cliente.telefono = data[0].convencional;
        cliente.correo = data[0].correo;
        cliente.direccion = data[0].direccion;
    
        
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

            precio_base_original: element.precio,
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
          
        notacredito.totalsinimpuestos = redondeardecimales(data[0].totalsinimpuestos, 2);
        notacredito.totaldescuento = redondeardecimales(data[0].total_descuento, 2);
        notacredito.totalconimpuestos = redondeardecimales(data[0].total_iva_general, 2);
        notacredito.subtotal12 = redondeardecimales(data[0].subtotalconimpuesto, 2);
        notacredito.subtotal0 = redondeardecimales(data[0].subtotalsinimpuesto, 2);
        notacredito.totalconice = redondeardecimales(data[0].total_ice_general, 2);
        notacredito.observacion = data[0].observacion;
        notacredito.importetotal = redondeardecimales(data[0].importetotal, 2);

        //await this.childenviarsriventa.crearFirmarXml2(0, cliente, rucempresa, notacredito, formapago, datosdetalles, "actualizar");
        return {
          cliente,
          rucempresa,
          notacredito,
          datosdetalles
        };

    } catch (err) {
      console.error("Error en el servidor en buscarFactura: ", err);
      throw err; // Re-lanzar para que el componente lo detecte
    }
  }

  padLeft(value, length) {
    return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
    value;
  }

  async crearFirmarXml2(cod_proyecto: string, cliente: ClienteDTO, rucempresa: RucEmpresaDTO, notacredito: NotaCreditoDTO, datosdetalles: any): Promise<any>
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
          'codigointerno' : item.cod_producto,
          'codigoadicional' : 'NA',
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

      const arr_nota_credito = {
        'cod_proyecto' : cod_proyecto,
        'cod_nota_credito' : notacredito.cod_nota_credito,
        'cod_sucursal' : rucempresa.cod_ruc,
        'ambiente' : rucempresa.tipoambiente,
        'tipoemision' : '1',
        'razonsocial' : rucempresa.razon_social,
        'nombrecomercial' : rucempresa.nombre_comercial,
        'ruc' : rucempresa.ruc,
        'claveacceso' : notacredito.claveacceso,
        'coddoc' : '04',
        'estab' : rucempresa.serieestab,
        'ptoemi' : rucempresa.ptoemi,
        'secuencial' : notacredito.n_nota_credito,
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
    
        /*INFO NOTA CREDITO*/
        'fechaemision' : notacredito.fecha_hora,
        'direstablecimiento' : rucempresa.direccion_establecimiento,
        'obligadocontabilidad' : rucempresa.contabilidad,
        'tipoidentificacioncomprador' : cliente.cod_identificacion,
        'razonsocialcomprador' : cliente.cliente,
        'identificacioncomprador' : cliente.numero_identificacion,
    
        'comprobante' : "FACTURA",
        'coddocmodificado' : "01",
        'numdocmodificado' : notacredito.numero_factura,
        'fechaemisiondocsustento' : notacredito.fecha_emision_factura,
    
        'totalsinimpuestos' : notacredito.totalsinimpuestos,
    
        'valormodificacion' : notacredito.importetotal,
        'moneda' : 'DOLAR',
    
        'totaliva' : notacredito.totalconimpuestos,
        'subtotalconimpuesto' : notacredito.subtotal12,
        'subtotalsinimpuesto' : notacredito.subtotal0,
        'totalice' : notacredito.totalconice,
    
        'motivo' :  notacredito.razon_modificacion,
    
        'direccion' : cliente.direccion,
        'celular' : cliente.celular,
        'correo' : cliente.correo,
        'observacion' : notacredito.observacion,
        'detalles' : detalles,
        'iva' : notacredito.iva,
        'codigoiva' : notacredito.codigo_iva,
        'fechaautorizacion' : notacredito.fechaautorizacion
      };

        try
        {
          const data: any = await lastValueFrom(this.notacreditoservice.crearFirmarXml(arr_nota_credito));
          if (data && data.estado == true) {
            return arr_nota_credito;
          } else {
            throw new Error(data.mensaje || "Error en la generación del XML");
          }
        }
        catch (err) {
          console.error("Error en el servidor al firmar XML: ", err);
          throw err; 
        }   
  }

  async enviarSri(cod_proyecto: string, notacredito: NotaCreditoDTO)
  {
      let parametros = {
          'cod_proyecto' : cod_proyecto,
          'cod_nota_credito' : notacredito.cod_nota_credito
        };

      try
      {
        const data: any = await lastValueFrom(this.notacreditoservice.enviarSri(parametros));
        if (data.estado == true)
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
          throw new Error("Se Origino un error al enviar recepción al SRI: " + data.mensaje + " " + data.informacionadicional);
        }
      }
      catch (err) {
        console.error("Error en el servidor al enviar el comprobante al SRI en recepción: ", err);
        throw err; 
      }
  }

  async comprobarSri(cod_proyecto: string, notacredito: NotaCreditoDTO): Promise<any>
  {
      let parametros = {
          'cod_proyecto' : cod_proyecto,
          'cod_nota_credito' : notacredito.cod_nota_credito,
          'claveacceso' : notacredito.claveacceso
        };
      
      try
      {
        const data: any = await lastValueFrom(this.notacreditoservice.comprobarSri(parametros));
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

  async comprobarSriRapido(cod_proyecto: string, notacredito: NotaCreditoDTO): Promise<any>
  {
      let parametros = {
          'cod_proyecto' : cod_proyecto,
          'cod_nota_credito' : notacredito.cod_nota_credito,
          'claveacceso' : notacredito.claveacceso
        };
      
      try
      {
        const data: any = await lastValueFrom(this.notacreditoservice.comprobarSriRapido(parametros));
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

   async actualizarEstado(cod_nota_credito : string, n_autorizacion : string, mensaje_error : string, informacion_adicional : string, estado : string, fechaautorizacion: string): Promise<any>
  {
      let parametros = {
        'cod_nota_credito' : cod_nota_credito,
        'n_autorizacion' : n_autorizacion,
        'mensaje_error' : mensaje_error,
        'informacion_adicional' : informacion_adicional,
        'estado' : estado,
        'fechaautorizacion' : fechaautorizacion
      };

      try
      {
        const data: any = await lastValueFrom(this.notacreditoservice.actualizarEstado(parametros));
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

  async actualizarEstadoError(cod_nota_credito : string, identificador : string, mensaje_error : string, informacion_adicional : string, estado : String): Promise<any>
  {
      let parametros = {
        'cod_nota_credito' : cod_nota_credito,
        'identificador' : identificador,
        'mensaje_error' : mensaje_error,
        'informacion_adicional' : informacion_adicional,
        'estado' : estado,
      };

      try
      {
        const data: any = await lastValueFrom(this.notacreditoservice.actualizarEstadoError(parametros));
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

  async crearRide(arr_nota_credito: any, cliente: ClienteDTO): Promise<boolean>
  {	 
    try
      {
        const data: any = await lastValueFrom(this.notacreditoservice.crearRide(arr_nota_credito));
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

  async enviarCorreo(cod_proyecto: string, notacredito: NotaCreditoDTO, cliente: ClienteDTO, rucempresa: RucEmpresaDTO): Promise<boolean>
  {
    let parametros = {
        'cod_proyecto' : cod_proyecto,
        'cod_nota_credito' : notacredito.cod_nota_credito,
        'nombre_comercial' : rucempresa.nombre_comercial,
        'numero_nota_credito' : notacredito.n_nota_credito,
        'correo' : cliente.correo,
        'cliente' : cliente.cliente,
        'serieestab' : rucempresa.serieestab,
        'ptoemi' : rucempresa.ptoemi
      };
      
      try
      {
        const data: any = await lastValueFrom(this.notacreditoservice.enviarCorreoNotaCredito(parametros));
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

  async actualizarEstadoCorreo(cod_nota_credito: string)
  {
      let parametros = {
        'cod_nota_credito' : cod_nota_credito
      };     

      try
      {
        const data: any = await lastValueFrom(this.notacreditoservice.actualizarEstadoCorreo(parametros));
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

  async crearArregloNotaCredito(cod_proyecto: string, cliente: ClienteDTO, rucempresa: RucEmpresaDTO, notacredito: NotaCreditoDTO, datosdetalles: any): Promise<any>
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
          'codigointerno' : item.cod_producto,
          'codigoadicional' : 'NA',
          'descripcion' : descripcion,
          'cantidad' : item.cantidad_comprar,
          'preciounitario' : item.precio_base,
          'descuento' : item.descuento_calculado,
          'total' : item.total,//total preciototalsinimpuesto
          'ice' : item.ice,//0% y 12%
          'codigo_iva' : item.codigo_iva,
          'iva' : item.iva,//0% y 12%
          'totaliva' : item.total_iva,//Valor total * % iva
          'totalice' : item.total_ice,//Valor del ice del producto
          'totalfinal' : item.total_final//No necesita el xml
        };
        detalles.push(detalle);
      });
    
      const arr_nota_credito = {
        'cod_proyecto' : cod_proyecto,
        'cod_nota_credito' : notacredito.cod_nota_credito,
        'cod_sucursal' : rucempresa.cod_ruc,
        'ambiente' : rucempresa.tipoambiente,
        'tipoemision' : '1',
        'razonsocial' : rucempresa.razon_social,
        'nombrecomercial' : rucempresa.nombre_comercial,
        'ruc' : rucempresa.ruc,
        'claveacceso' : notacredito.claveacceso,
        'coddoc' : '01',//Factura
        'estab' : rucempresa.serieestab,
        'ptoemi' : rucempresa.ptoemi,
        'secuencial' : notacredito.n_nota_credito,
        'dirmatriz' : rucempresa.direccion_matriz,
        'tipocontribuyente' : rucempresa.tipo_contribuyente,
        'contribuyente' : rucempresa.contribuyente,
        'leyenda' : rucempresa.leyenda,

        'firmap12' : rucempresa.firmap12,
        'clavep12' : rucempresa.clavep12,
        'pk12' : rucempresa.pk12,
        'firmapublica' : rucempresa.firmapublica,
        'firmaprivada' : rucempresa.firmaprivada,
        'certificado' : rucempresa.certificado,
    
        /*INFO FACTURA*/
        'fechaemision' : notacredito.fecha_hora,

        'direstablecimiento' : rucempresa.direccion_establecimiento,
        'obligadocontabilidad' : rucempresa.contabilidad,
        'tipoidentificacioncomprador' : cliente.cod_identificacion,
        'razonsocialcomprador' : cliente.cliente,
        'identificacioncomprador' : cliente.numero_identificacion,

        'comprobante' : "FACTURA",
        'coddocmodificado' : "01",
        'numdocmodificado' : notacredito.numero_factura,
        'fechaemisiondocsustento' : notacredito.fecha_emision_factura,

        'totalsinimpuestos' : notacredito.totalsinimpuestos,
        'valormodificacion' : notacredito.importetotal,
        'moneda' : 'DOLAR',
    
          'totaliva' : notacredito.totalconimpuestos,
          'subtotalconimpuesto' : notacredito.subtotal12,
          'subtotalsinimpuesto' : notacredito.subtotal0,
          'totalice' : notacredito.totalconice,
    
        'motivo' : notacredito.razon_modificacion,
    
        'direccion' : cliente.direccion,
        'celular' : cliente.celular,
        'correo' : cliente.correo,
        'observacion' : notacredito.observacion,
        'detalles' : detalles,
        'facturaversion' : rucempresa.facturaversion,
        'iva' : notacredito.iva,
        'codigoiva' : notacredito.codigo_iva,//Agregado recien,
        'fechaautorizacion': notacredito.fechaautorizacion,
      };

    
          return arr_nota_credito;
  }



  async verificarComprobanteSri(notacredito: NotaCreditoDTO): Promise<any>
  {
    try
    {
      let parametros = {
          'claveacceso' : notacredito.claveacceso
        };
      
      let valor = true;
      let data: any = await lastValueFrom(this.notacreditoservice.verificarComprobanteSri(parametros));

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


}