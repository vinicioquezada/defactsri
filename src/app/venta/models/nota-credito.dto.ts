export class NotaCreditoDTO {
  cod_nota_credito : string = "";
  n_nota_credito : string = "";
  razon_modificacion : string = "";
  claveacceso : string = "0";

  fecha_hora : string = "";
  fecha_registro : string = "";
  fecha_emision_factura : string = "";

  fecha_registro_hora : string = "";
  
  cod_factura_venta: string = "";
  numero_factura: string = "";

  fechaautorizacion: string = "";

  cod_reembolso: string ="T";
  
  id_forma_pago: string = "";
  forma_pago: string = "";
  
  tipo_venta : string = "";
  cod_empleado : string = "";
  iva : number = 0.00;
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