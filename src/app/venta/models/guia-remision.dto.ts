export class GuiaRemisionDTO {
  cod_guia_remision : string = "";
  n_guia_remision : string = "";
  claveacceso : string = "0";
  fecha_hora : string = "";
  fecha_registro : string = "";
  
  fecha_registro_hora : string = "";

  fechaautorizacion: string = "";

  cod_factura_venta: string = "";
  numero_factura: string = "";

  placa : string = "";
  punto_partida : string = "";
  fecha_inicio_transporte : string = "";
  fecha_fin_transporte : string = "";
  comprobante : string = "FACTURA";
  numero_autorizacion_factura : string = "";
  motivo_translado : string = "VENTA";
  destino : string = "";
  identificacion_destinatario : string = "";
  razon_social_destinatario : string = "";
  documento_aduanero : string = "";
  codigo_establecimiento_destino : string = "";
  ruta : string = "";
  
  codigo_iva : number = 0;
 
  
  
  importetotal : number = 0.00;
  totalsinimpuestos : number = 0.00;
  totaldescuento : number = 0.00;
  totalconimpuestos : number = 0.00;
  subtotal12 : number = 0.00;
  subtotal0 : number = 0.00;
  totalconice : number = 0.00;
  observacion : string = "";
  estado : string = "";
  envio : string = "";
  cod_usuario : string = "";
  cod_sucursal : string = "";
}