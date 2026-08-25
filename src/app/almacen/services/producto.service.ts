import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/almacen/producto/";
  }

  listarProductosGenerales()
  {
    return this.http.get(this.api + "listarproductosgenerales");
  }

  listarProductos(cod_sucursal: string)
  {
    return this.http.get(this.api + "listarproductos?cod_sucursal=" + cod_sucursal);
  }

  buscar(codigo: string, codigo_adicional: string)
  {
    return this.http.get(this.api + "buscar?codigo=" + codigo + "&codigo_adicional=" + codigo_adicional);
  }

  buscarCodigo(codigo: string)
  {
    return this.http.get(this.api + "buscarcodigo?codigo=" + codigo);
  }

  originarCodigoProducto()
  {
    return this.http.get(this.api + "originarcodigoproducto");
  }

  buscarProducto(cod_producto: string)
  {
    return this.http.get(this.api + "buscarproducto?cod_producto=" + cod_producto);
  }

  guardar(parametros: any){
    return this.http.post(this.api + "guardar", parametros);
  }

  actualizar(parametros: any){
    return this.http.post(this.api + "actualizar", parametros);
  }

  eliminar(parametros: any){
    return this.http.post(this.api + "eliminar", parametros);
  }

  /*
  listarProductosExplorador(cod_categoria: string, cod_subcategoria: string){
    return this.http.get(this.api + "listarproductosexplorador?cod_categoria=" + cod_categoria + "&cod_subcategoria=" + cod_subcategoria);
  }
  */

  listarProductosInventarios(cod_sucursal: string){
    return this.http.get(this.api + "listarproductosinventarios?cod_sucursal=" + cod_sucursal);
  }

  listarProductosVentasPorSucursal(cod_sucursal: string){
    return this.http.get(this.api + "listarproductosventasporsucursal?cod_sucursal=" + cod_sucursal);
  }

  listarProductosComprasPorSucursal(cod_sucursal: string){
    return this.http.get(this.api + "listarproductoscomprasporsucursal?cod_sucursal=" + cod_sucursal);
  }

  listarProductosComprasGastosPorSucursal(cod_sucursal: string){
    return this.http.get(this.api + "listarproductoscomprasgastosporsucursal?cod_sucursal=" + cod_sucursal);
  }

  generarCodigoBarra(codigo: string){
    return this.http.get(this.api + "generarcodigobarra?codigo=" + codigo);
  }

  listarProductosStock(cod_sucursal: string, cantidad: string, cod_categoria: string, cod_subcategoria: string, inventario_minimo: string){
    return this.http.get(this.api + "listarproductosstock?cod_sucursal=" + cod_sucursal + "&cantidad=" + cantidad + "&cod_categoria=" + cod_categoria + "&cod_subcategoria=" + cod_subcategoria + "&inventario_minimo=" + inventario_minimo);
  }

  listarProductosPorSucursal(cod_sucursal: string){
    return this.http.get(this.api + "listarproductosporsucursal?cod_sucursal=" + cod_sucursal);
  }

  listarTarifasProductosPorSucursal(cod_sucursal: string){
    return this.http.get(this.api + "listartarifasproductosporsucursal?cod_sucursal=" + cod_sucursal);
  }

  buscarCodigosProducto(cod_producto: string)
  {
    return this.http.get(this.api + "buscarcodigosproducto?cod_producto=" + cod_producto);
  }

  listarCodigosProductos(cod_sucursal: string){
    return this.http.get(this.api + "listarcodigosproductos?cod_sucursal=" + cod_sucursal);
  }

  eliminarProductoSucursal(parametros: any){
    return this.http.post(this.api + "eliminarproductosucursal", parametros);
  }

  buscarDetalleIngresoPorId(id_detalle_ingreso_mercaderia: string, cod_producto: string)
  {
    return this.http.get(this.api + "buscardetalleingresoporid?id_detalle_ingreso_mercaderia=" + id_detalle_ingreso_mercaderia + "&cod_producto=" + cod_producto);
  }

  buscarDetalleCompraPorId(id_detalle_compra: string, cod_producto: string)
  {
    return this.http.get(this.api + "buscardetallecompraporid?id_detalle_compra=" + id_detalle_compra + "&cod_producto=" + cod_producto);
  }

  buscarMovimientosGeneralesProductos(fechadesde: string, cod_producto: string, cod_sucursal: string)
  {
    return this.http.get(this.api + "buscarmovimientosgeneralesproductos?fechadesde=" + fechadesde + "&cod_producto=" + cod_producto + "&cod_sucursal=" + cod_sucursal);
  }
}