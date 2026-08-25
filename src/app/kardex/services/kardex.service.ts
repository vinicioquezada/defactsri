import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class KardexService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/almacen/kardex/";
  }

  listarMovimientosPorProducto(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_producto : string)
  {
    return this.http.get(this.api + "listarmovimientosporproducto?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_producto=" + cod_producto);
  }

  listarCostosProductos(cod_sucursal: string, cod_categoria: string, cod_subcategoria: string, cod_producto: string){
    return this.http.get(this.api + "listarcostosproductos?cod_sucursal=" + cod_sucursal + "&cod_categoria=" + cod_categoria + "&cod_subcategoria=" + cod_subcategoria + "&cod_producto=" + cod_producto);
  }

  listarMargenGanancia(fechadesde: string, fechahasta: string, cod_sucursal : string, cod_usuario : string, tipo_venta : string, id_forma_pago : string, tipo_deuda : string, cod_cliente : string)
  {
    return this.http.get(this.api + "listarmargenganancia?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_usuario=" + cod_usuario + "&tipo_venta=" + tipo_venta + "&id_forma_pago=" + id_forma_pago + "&tipo_deuda=" + tipo_deuda + "&cod_cliente=" + cod_cliente);
  }

  listarIngresosManuales(fechadesde: string, fechahasta: string, cod_sucursal: string, cod_categoria: string, cod_subcategoria: string, cod_producto: string, cod_tipo_ingreso_mercaderia : string){
    return this.http.get(this.api + "listaringresosmanuales?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_categoria=" + cod_categoria + "&cod_subcategoria=" + cod_subcategoria + "&cod_producto=" + cod_producto + "&cod_tipo_ingreso_mercaderia=" + cod_tipo_ingreso_mercaderia);
  }

  listarSalidasManuales(fechadesde: string, fechahasta: string, cod_sucursal: string, cod_categoria: string, cod_subcategoria: string, cod_producto: string, cod_tipo_salida_mercaderia : string) {
    return this.http.get(this.api + "listarsalidasmanuales?fechadesde=" + fechadesde + "&fechahasta=" + fechahasta + "&cod_sucursal=" + cod_sucursal + "&cod_categoria=" + cod_categoria + "&cod_subcategoria=" + cod_subcategoria + "&cod_producto=" + cod_producto + "&cod_tipo_salida_mercaderia=" + cod_tipo_salida_mercaderia);
  }

  buscarFacturaProductosKardex(cod_factura_compra : string)
  {
    return this.http.get(this.api + "buscarfacturaproductoskardex?cod_factura_compra=" + cod_factura_compra);
  }

  buscarIngresosProductosKardex(cod_ingreso_mercaderia : string)
  {
    return this.http.get(this.api + "buscaringresosproductoskardex?cod_ingreso_mercaderia=" + cod_ingreso_mercaderia);
  }

  guardarFechasCaducidad(parametros: any){
    return this.http.post(this.api + "guardarfechascaducidad", parametros);
  }

  listarProductosCaducidad(cod_sucursal: string, cod_categoria: string, cod_subcategoria: string, cod_producto: string, fechahasta: string){
    return this.http.get(this.api + "listarproductoscaducidad?cod_sucursal=" + cod_sucursal + "&cod_categoria=" + cod_categoria + "&cod_subcategoria=" + cod_subcategoria + "&cod_producto=" + cod_producto + "&fechahasta=" + fechahasta);
  }

  crearInventarioInicial(parametros: any){
    return this.http.post(this.api + "crearinventarioinicial", parametros);
  }

  verificarSalidasKardex(cod_movimiento: string, transaccion: string, id_detalle: number)
  {
    return this.http.get(this.api + "verificarsalidaskardex?cod_movimiento=" + cod_movimiento + "&transaccion=" + transaccion + "&id_detalle=" + id_detalle);
  }
}