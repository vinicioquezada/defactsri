import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ProveedorProductoService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  private get api() {
    return this.configService.settings.baseUrl + "/api/compras/proveedorproducto/";
  }

  listarProveedorProducto(cod_proveedor: string)
  {
    return this.http.get(this.api + "listarproveedorproducto?cod_proveedor=" + cod_proveedor);
  }

  listarProductoProveedor(cod_producto: string)
  {
    return this.http.get(this.api + "listarproductoproveedores?cod_producto=" + cod_producto);
  }

  eliminar(parametros: any){
    return this.http.post(this.api + "eliminar", parametros);
  }

  buscar(cod_producto: string, cod_proveedor: string)
  {
    return this.http.get(this.api + "buscar?cod_producto=" + cod_producto + "&cod_proveedor=" + cod_proveedor);
  }

  guardar(parametros: any){
    return this.http.post(this.api + "guardar", parametros);
  }
}