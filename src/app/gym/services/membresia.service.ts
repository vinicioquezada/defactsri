import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class MembresiaService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/gym/membresia/";
  }

  buscarultimoplan(cod_cliente: string)
  {
    return this.http.get(this.api + "buscarultimoplan?cod_cliente=" + cod_cliente);
  }

  calcularFechasDiarios(fecha_inicio_plan: string, cantidad_dias: number)
  {
    return this.http.get(this.api + "calcularfechasdiarios?fecha_inicio_plan=" + fecha_inicio_plan + "&cantidad_dias=" + cantidad_dias);
  }

  calcularFechasMensuales(fecha_inicio_plan: string, cantidad_meses: number)
  {
    return this.http.get(this.api + "calcularfechasmensuales?fecha_inicio_plan=" + fecha_inicio_plan + "&cantidad_meses=" + cantidad_meses);
  }

  guardarMembresia(parametros: any){
    return this.http.post(this.api + "guardarmembresia", parametros);
  }

  actualizarMembresia(parametros: any){
    return this.http.post(this.api + "actualizarmembresia", parametros);
  }

  actualizarMembresiaDiario(parametros: any){
    return this.http.post(this.api + "actualizarmembresiadiario", parametros);
  }

  calcularFechadesCongelamientoMembresia(fecha_inicio: string, fecha_fin: string, fecha_congelamiento : string)
  {
    return this.http.get(this.api + "calcularfechadescongelamientomembresia?fecha_inicio=" + fecha_inicio + "&fecha_fin=" + fecha_fin + "&fecha_congelamiento=" + fecha_congelamiento);
  }

  guardarMembresiaDiario(parametros: any){
    return this.http.post(this.api + "guardarmembresiadiario", parametros);
  }

  listarFacturasGym(fechadesde: string, fechahasta: string, opcion : string, cod_sucursal : string, estado_comprobante : string){
    return this.http.get(this.api + "listarfacturasgym?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&opcion=" + opcion + "&cod_sucursal=" + cod_sucursal + "&estado_comprobante=" + estado_comprobante);
  }

  buscarFacturaMembresia(cod_factura_venta: string)
  {
    return this.http.get(this.api + "buscarfacturamembresia?cod_factura_venta=" + cod_factura_venta);
  }

  buscarMembresiaSocio(cod_factura_venta: string)
  {
    return this.http.get(this.api + "buscarmembresiasocio?cod_factura_venta=" + cod_factura_venta);
  }

  anularFacturaVentaMembresia(parametros: any){
    return this.http.post(this.api + "anularfacturaventamembresia", parametros);
  }

  anularMembresia(parametros: any){
    return this.http.post(this.api + "anularmembresia", parametros);
  }

  listarEstadosMembresias(cod_sucursal : string, cod_estado_membresia: string)
  {
    return this.http.get(this.api + "listarestadosmembresias?cod_sucursal=" + cod_sucursal + "&cod_estado_membresia=" + cod_estado_membresia);
  }

  listarVentasSocios(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_venta : string, tipo_deuda : string, cod_cliente : string, cod_identificacion: string, cod_empleado : string, cod_ruc: any, cod_categoria: string, cod_subcategoria: string)
  {
    return this.http.get(this.api + "listarventassocios?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_venta=" + tipo_venta + "&tipo_deuda=" + tipo_deuda + "&cod_cliente=" + cod_cliente + "&cod_identificacion=" + cod_identificacion + "&cod_empleado=" + cod_empleado + "&cod_ruc=" + cod_ruc + "&cod_categoria=" + cod_categoria + "&cod_subcategoria=" + cod_subcategoria);
  }

}