export class FacturaVentaDTO {
  cod_factura_venta : string = "";
  numero_factura : string = "";
  claveacceso : string = "0";
  fecha_registro : string = "";
  fecha_registro_hora : string = "";
  tipo_venta : string = "";
  diferenciavalor : string = "";
  recibido : string = "";
  recibidoabono : string = "0";
  diferencia : string = "";
  deudor : number =0;
  tipo_credito : number =0;
  id_forma_pago_abono : string = "";
  pedido : number =0;
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
  tipoambiente: string = "";
  fechaautorizacion: string = "";

  cod_reserva: string = "";
  tipo_pago : number = 0;

  fecha_inicio_plan : string = "";
  fecha_fin_plan : string = "";
  horario : string = "";
  cod_subcategoria : number = 0;
  infomembresia : boolean = false;
  infoestadoplan : string = "";
  infoplan : string = "";
  infofechainicio : string = "";
  infofechafin : string = "";
  cod_tipo_plan : string = "";

  cod_sucursal : string = "";
}