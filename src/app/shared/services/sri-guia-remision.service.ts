import { Injectable } from '@angular/core';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { GuiaRemisionService } from 'src/app/venta/services/guia-remision.service';
import { redondeardecimales } from '../js/decimales.js';
import { RucEmpresaDTO } from 'src/app/usuario/models/rucempresa.dto';
import * as moment from 'moment';
import { TransportistaDTO } from 'src/app/venta/models/transportista.dto';
import { GuiaRemisionDTO } from 'src/app/venta/models/guia-remision.dto';


@Injectable({
  providedIn: 'root'
})
export class SriGuiaRemisionService {
constructor(private guiaremisionservice: GuiaRemisionService) {}

  async actualizarFechaClaveAccesoActual(cod_guia_remision: string, n_guia_remision: string, ruc_sucursal: string, tipo_ambiente: string, serieestab: string, ptoemi: string): Promise<any> { //Esto equivale al return Promise
    const parametros = {
      'cod_guia_remision' : cod_guia_remision,
      'numero_guia' : n_guia_remision,
      'ruc' : ruc_sucursal,
      'tipoambiente' : tipo_ambiente,
      'serieestab' : serieestab,
      'ptoemi' : ptoemi
    };

    try
    {
      const data: any = await lastValueFrom(this.guiaremisionservice.actualizarFechaClaveAccesoActual(parametros));
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

  async buscarGuiaRemision(cod_guia_remision: string)
  {
    try
    {
      let data: any = await lastValueFrom(this.guiaremisionservice.buscarGuiaRemision(cod_guia_remision));

      if (!data || data.length === 0) {
        throw new Error("No se encontraron datos de la factura.");
      }

        let transportista: TransportistaDTO = new TransportistaDTO;
        let guiaremision: GuiaRemisionDTO = new GuiaRemisionDTO;
        let rucempresa: RucEmpresaDTO = new RucEmpresaDTO;

        guiaremision.cod_guia_remision = data[0].cod_guia_remision;
        guiaremision.n_guia_remision = this.padLeft(data[0].numero_guia, 9);
        guiaremision.fecha_registro = moment(data[0].fecha_emision_factura).format('YYYY-MM-DD');
        guiaremision.estado = data[0].estado;
        guiaremision.envio = data[0].envio;
        guiaremision.cod_usuario = data[0].cod_usuario;
        guiaremision.cod_factura_venta = data[0].cod_factura_venta;
        guiaremision.numero_factura = this.padLeft(data[0].numero_factura, 9);
        guiaremision.claveacceso = data[0].claveacceso;
        guiaremision.fecha_hora = moment(data[0].fecha_hora).format('YYYY-MM-DD');
        guiaremision.fecha_registro_hora= moment(data[0].fecha_hora).format('YYYY-MM-DD HH:mm:ss');
        guiaremision.fechaautorizacion = moment(data[0].fechaautorizacion).format('YYYY-MM-DD HH:mm:ss');

        guiaremision.placa = data[0].placa;
        guiaremision.punto_partida = data[0].punto_partida;
        guiaremision.fecha_inicio_transporte = data[0].fecha_inicio_transporte;
        guiaremision.fecha_fin_transporte = data[0].fecha_fin_transporte;
        guiaremision.ruta = data[0].ruta;
        guiaremision.identificacion_destinatario = data[0].identificacion_destinatario;
        guiaremision.razon_social_destinatario = data[0].razon_social_destinatario;
        guiaremision.destino = data[0].destino;
        guiaremision.codigo_establecimiento_destino = data[0].codigo_establecimiento_destino;
        guiaremision.comprobante = data[0].comprobante;
        guiaremision.numero_autorizacion_factura = data[0].n_autorizacion_factura;
        guiaremision.motivo_translado = data[0].motivo_traslado;
        guiaremision.documento_aduanero = data[0].documento_aduanero;
        guiaremision.cod_sucursal = data[0].cod_sucursal;
        guiaremision.observacion = data[0].observacion_guia_remision;

        rucempresa.serieestab = data[0].serieestab;
        rucempresa.ptoemi = data[0].ptoemi;
        rucempresa.ruc = data[0].ruc_sucursal;
        rucempresa.tipoambiente = data[0].tipo_ambiente;
        rucempresa.cod_ruc = data[0].cod_ruc;
        rucempresa.empresa = data[0].empresa;
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
    
        transportista.cod_identificacion = data[0].cod_identificacion;
        transportista.identificacion = data[0].identificacion;
        transportista.cod_transportista = data[0].cod_transportista;
        transportista.razon_social_transportista = data[0].razon_social_transportista;
        transportista.numero_identificacion = data[0].cedula;
        transportista.celular = data[0].celular;
        transportista.telefono = data[0].convencional;
        transportista.correo = data[0].correo;
        transportista.direccion = data[0].direccion;
  
        //guiaremision.codigo_iva = Number(codigo_iva);

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
          
        guiaremision.totalsinimpuestos = redondeardecimales(data[0].totalsinimpuestos, 2);
        guiaremision.totaldescuento = redondeardecimales(data[0].total_descuento, 2);
        guiaremision.totalconimpuestos = redondeardecimales(data[0].total_iva_general, 2);
        guiaremision.subtotal12 = redondeardecimales(data[0].subtotalconimpuesto, 2);
        guiaremision.subtotal0 = redondeardecimales(data[0].subtotalsinimpuesto, 2);
        guiaremision.totalconice = redondeardecimales(data[0].total_ice_general, 2);
        guiaremision.observacion = data[0].observacion;
        guiaremision.importetotal = redondeardecimales(data[0].importetotal, 2);

        //await this.childenviarsriventa.crearFirmarXml2(0, cliente, rucempresa, guiaremision, formapago, datosdetalles, "actualizar");
        return {
          transportista,
          rucempresa,
          guiaremision,
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

  async crearFirmarXml2(cod_proyecto: string, transportista: TransportistaDTO, rucempresa: RucEmpresaDTO, guiaremision: GuiaRemisionDTO, datosdetalles: any): Promise<any>
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
          'cantidad' : item.cantidad_comprar,
          'descripcion' : descripcion,
        };

        detalles.push(detalle);
      });

      const arr_guia_remision = {
        'cod_proyecto' : cod_proyecto,
        'cod_guia_remision' : guiaremision.cod_guia_remision,
        'cod_sucursal' : rucempresa.cod_ruc,
        'ambiente' : rucempresa.tipoambiente,
        'tipoemision' : '1',
        'razonsocial' : rucempresa.razon_social,
        'nombrecomercial' : rucempresa.nombre_comercial,
        'ruc' : rucempresa.ruc,
        'claveacceso' : guiaremision.claveacceso,
        'coddoc' : '06',
        'estab' : rucempresa.serieestab,
        'ptoemi' : rucempresa.ptoemi,
        'secuencial' : guiaremision.n_guia_remision,
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
    
        'direstablecimiento' : rucempresa.direccion_establecimiento,
        'obligadocontabilidad' : rucempresa.contabilidad,
        'fechaemision' : guiaremision.fecha_hora,
        'cod_identificacion_transportista' : transportista.cod_identificacion,
        'razon_social_transportista' :  transportista.razon_social_transportista,
        'identificacion_transportista' : transportista.numero_identificacion,
        'placa' : guiaremision.placa,
        'punto_partida' : guiaremision.punto_partida,
        'fecha_inicio_transporte' : guiaremision.fecha_inicio_transporte,
        'fecha_fin_transporte' : guiaremision.fecha_fin_transporte,
        'comprobante' : guiaremision.comprobante,
        'numero_factura' : guiaremision.numero_factura,
        'fecha_emision_factura' : guiaremision.fecha_registro,
        'n_autorizacion_factura' : guiaremision.numero_autorizacion_factura,
        'motivo_traslado' : guiaremision.motivo_translado,
        'destino' : guiaremision.destino,
        'identificacion_destinatario' : guiaremision.identificacion_destinatario,
        'razon_social_destinatario' : guiaremision.razon_social_destinatario,
        'documento_aduanero' : guiaremision.documento_aduanero,
        'codigo_establecimiento_destino' : guiaremision.codigo_establecimiento_destino,
        'ruta' : guiaremision.ruta,
        'observacion' : guiaremision.observacion,
        'cod_factura_venta' : guiaremision.cod_factura_venta,
        'cod_usuario' : guiaremision.cod_usuario,
        'correo' : transportista.correo,
        'fechaautorizacion' : guiaremision.fechaautorizacion,
        'detalles' : detalles
      };

        try
        {
          const data: any = await lastValueFrom(this.guiaremisionservice.crearFirmarXml(arr_guia_remision));
          if (data && data.estado == true) {
            return arr_guia_remision;
          } else {
            throw new Error(data.mensaje || "Error en la generación del XML");
          }
        }
        catch (err) {
          console.error("Error en el servidor al firmar XML: ", err);
          throw err; 
        }   
  }

  async enviarSri(cod_proyecto: string, guiaremision: GuiaRemisionDTO)
  {
      let parametros = {
          'cod_proyecto' : cod_proyecto,
          'cod_guia_remision' : guiaremision.cod_guia_remision
        };

      try
      {
        const data: any = await lastValueFrom(this.guiaremisionservice.enviarSri(parametros));
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

  async comprobarSri(cod_proyecto: string, guiaremision: GuiaRemisionDTO): Promise<any>
  {
      let parametros = {
          'cod_proyecto' : cod_proyecto,
          'cod_guia_remision' : guiaremision.cod_guia_remision,
          'claveacceso' : guiaremision.claveacceso
        };
      
      try
      {
        const data: any = await lastValueFrom(this.guiaremisionservice.comprobarSri(parametros));
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

  async comprobarSriRapido(cod_proyecto: string, guiaremision: GuiaRemisionDTO): Promise<any>
  {
      let parametros = {
          'cod_proyecto' : cod_proyecto,
          'cod_guia_remision' : guiaremision.cod_guia_remision,
          'claveacceso' : guiaremision.claveacceso
        };
      
      try
      {
        const data: any = await lastValueFrom(this.guiaremisionservice.comprobarSriRapido(parametros));
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

   async actualizarEstado(cod_guia_remision : string, n_autorizacion : string, mensaje_error : string, informacion_adicional : string, estado : string, fechaautorizacion: string): Promise<any>
  {
      let parametros = {
        'cod_guia_remision' : cod_guia_remision,
        'n_autorizacion' : n_autorizacion,
        'mensaje_error' : mensaje_error,
        'informacion_adicional' : informacion_adicional,
        'estado' : estado,
        'fechaautorizacion' : fechaautorizacion
      };

      try
      {
        const data: any = await lastValueFrom(this.guiaremisionservice.actualizarEstado(parametros));
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

  async actualizarEstadoError(cod_guia_remision : string, identificador : string, mensaje_error : string, informacion_adicional : string, estado : String): Promise<any>
  {
      let parametros = {
        'cod_guia_remision' : cod_guia_remision,
        'identificador' : identificador,
        'mensaje_error' : mensaje_error,
        'informacion_adicional' : informacion_adicional,
        'estado' : estado,
      };

      try
      {
        const data: any = await lastValueFrom(this.guiaremisionservice.actualizarEstadoError(parametros));
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

  async crearRide(arr_guia_remision: any, transportista: TransportistaDTO): Promise<boolean>
  {	 
    try
      {
        const data: any = await lastValueFrom(this.guiaremisionservice.crearRide(arr_guia_remision));
        if(transportista.correo=="" || transportista.correo=="0" || transportista.correo==" " || transportista.correo.length==0)
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

  async enviarCorreo(cod_proyecto: string, guiaremision: GuiaRemisionDTO, transportista: TransportistaDTO, rucempresa: RucEmpresaDTO): Promise<boolean>
  {
      let parametros = {
        'cod_proyecto' : cod_proyecto,
        'cod_guia_remision' :guiaremision.cod_guia_remision,
        'nombre_comercial' : rucempresa.nombre_comercial,
        'numero_guia' : guiaremision.n_guia_remision,
        'correo' : transportista.correo,
        'razon_social_transportista' : transportista.razon_social_transportista,
        'serieestab' : rucempresa.serieestab,
        'ptoemi' : rucempresa.ptoemi
      };
      
      try
      {
        const data: any = await lastValueFrom(this.guiaremisionservice.enviarCorreoGuiaRemision(parametros));
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

  async actualizarEstadoCorreo(cod_guia_remision: string)
  {
      let parametros = {
        'cod_guia_remision' : cod_guia_remision
      };     

      try
      {
        const data: any = await lastValueFrom(this.guiaremisionservice.actualizarEstadoCorreo(parametros));
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

  async crearArregloGuiaRemision(cod_proyecto: string, transportista: TransportistaDTO, rucempresa: RucEmpresaDTO, guiaremision: GuiaRemisionDTO, datosdetalles: any): Promise<any>
  {
    

    let detalles = [];
      datosdetalles.forEach(item => {

        let descripcion="";
          if(item.tarifa=="NORMAL")
          {
            descripcion = item.detalle;
          }
          else
          {
            descripcion = item.tarifa + " - " + item.detalle;
          }

        let detalle = {
          'codigointerno' : item.cod_producto,
          'codigoadicional' : 'NA',
          'cantidad' : item.cantidad_comprar,
          'descripcion' : descripcion
        };
        detalles.push(detalle);
      });
      
      const arr_guia_remision = {
        'cod_proyecto' : cod_proyecto,
        'cod_guia_remision' : guiaremision.cod_guia_remision,
        'cod_sucursal' : rucempresa.cod_ruc,
        'ambiente' : rucempresa.tipoambiente,
        'tipoemision' : '1',
        'razonsocial' : rucempresa.razon_social,
        'nombrecomercial' : rucempresa.nombre_comercial,
        'ruc' : rucempresa.ruc,
        'claveacceso' : guiaremision.claveacceso,
        'coddoc' : '06',//Guia Remisión
        'estab' : this.padLeft(rucempresa.serieestab, 3),
        'ptoemi' : this.padLeft(rucempresa.ptoemi, 3),
        'secuencial' : guiaremision.n_guia_remision,
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

        'direstablecimiento' : rucempresa.direccion_establecimiento,
        'obligadocontabilidad' : rucempresa.contabilidad,

        'fechaemision' : guiaremision.fecha_hora,

        'cod_identificacion_transportista' : transportista.cod_identificacion,
        'razon_social_transportista' :  transportista.razon_social_transportista,
        'identificacion_transportista' : transportista.identificacion,
        'placa' : guiaremision.placa,
        'punto_partida' : guiaremision.punto_partida,
        'fecha_inicio_transporte' : guiaremision.fecha_inicio_transporte,
        'fecha_fin_transporte' : guiaremision.fecha_fin_transporte,

        'comprobante' : guiaremision.comprobante,
        'numero_factura' : guiaremision.numero_factura,
        'fecha_emision_factura' : guiaremision.fecha_registro,
        'n_autorizacion_factura' : guiaremision.numero_autorizacion_factura,

        'motivo_traslado' : guiaremision.motivo_translado,
        'destino' : guiaremision.destino,
        'identificacion_destinatario' : guiaremision.identificacion_destinatario,
        'razon_social_destinatario' : guiaremision.razon_social_destinatario,
        'documento_aduanero' : guiaremision.documento_aduanero,
        'codigo_establecimiento_destino' : guiaremision.codigo_establecimiento_destino,
        'ruta' : guiaremision.ruta,
        'observacion' : guiaremision.observacion,
        'cod_factura_venta' : guiaremision.cod_factura_venta,
        'cod_usuario' : guiaremision.cod_usuario,
        'correo' : transportista.correo,	
        'detalles' : detalles,
        'facturaversion' : rucempresa.facturaversion,
        'fechaautorizacion': guiaremision.fechaautorizacion,
      };
    
          return arr_guia_remision;
  }



  async verificarComprobanteSri(guiaremision: GuiaRemisionDTO): Promise<any>
  {
    try
    {
      let parametros = {
          'claveacceso' : guiaremision.claveacceso
        };
      
      let valor = true;
      let data: any = await lastValueFrom(this.guiaremisionservice.verificarComprobanteSri(parametros));

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