import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ServiciosHotelService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/hotel/serviciohotel/";
  }

  listarTiposServicios()
  {
    return this.http.get(this.api + "listartiposservicios");
  }

  listarServicios()
  {
    return this.http.get(this.api + "listarservicios");
  }

  buscar(codigo: string)
  {
    return this.http.get(this.api + "buscar?codigo=" + codigo);
  }

  buscarProducto(cod_producto: string)
  {
    return this.http.get(this.api + "buscarproducto?cod_producto=" + cod_producto);
  }

  guardarServicio(parametros: any){
    return this.http.post(this.api + "guardarservicio", parametros);
  }

  actualizarServicio(parametros: any){
    return this.http.post(this.api + "actualizarservicio", parametros);
  }

  listarProductosInventarios(cod_sucursal: string){
    return this.http.get(this.api + "listarproductosinventarios?cod_sucursal=" + cod_sucursal);
  }

  listarProductosVentasPorSucursal(cod_sucursal: string){
    return this.http.get(this.api + "listarproductosventasporsucursal?cod_sucursal=" + cod_sucursal);
  }

  listarProductosComprasPorSucursal(cod_sucursal: string){
    return this.http.get(this.api + "listarproductoscomprasporsucursal?cod_sucursal=" + cod_sucursal);
  }

  generarCodigoBarra(codigo: string){
    return this.http.get(this.api + "generarcodigobarra?codigo=" + codigo);
  }

  listarProductosStock(cod_sucursal: string, cantidad: string, cod_categoria: string, cod_subcategoria: string, inventario_minimo: string){
    return this.http.get(this.api + "listarproductosstock?cod_sucursal=" + cod_sucursal + "&cantidad=" + cantidad + "&cod_categoria=" + cod_categoria + "&cod_subcategoria=" + cod_subcategoria + "&inventario_minimo=" + inventario_minimo);
  }

  
}