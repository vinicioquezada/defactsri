export interface RucEmpresa {
  cod_ruc: number;
  cod_sucursal: number;
  tipo_ambiente: number;
  empresa: string;
  ruc_sucursal: string;
  razonsocial: string;
  nombrecomercial: string;
  nombrecomercial1: string;
  serieestab: number;
  ptoemi: number;
  contabilidad: string | null;
  direccion_matriz: string | null;
  direccion_establecimiento: string;
  celular_establecimiento: string;
  telefono_establecimiento: string;
  ciudad_establecimiento: string;
  correo_establecimiento: string;
  tipo_ruc: string;
  tipo_contribuyente: string;
  contribuyente: string | null;
  leyenda: string;
  firmap12: string;
  clavep12: string;
  pk12: number;
  firmapublica: string;
  firmaprivada: string;
  certificado: string;
  estado: number;
  facturaversion: number;
  fecha_caducidad_firma: string; // o Date
}