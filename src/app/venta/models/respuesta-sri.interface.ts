export interface RespuestaSri {
  estado_sri: boolean;
  cod_factura_venta: string;
  estado: 'CREADA' | 'AUTORIZADO' | 'NO AUTORIZADO' | 'EN PROCESO' | 'DEVUELTA';
  mensaje: string;
  informacionadicional: string;
  fecha_hora: string;
  error_sri: number;
  envio: 'SI' | 'NO';
  confirmar_envio: 'SI' | 'NO';
  confirmar_reenvio: 'SI' | 'NO';
  tiempo_espera_envio: 'SI' | 'NO';
  error_proceso: boolean;
}