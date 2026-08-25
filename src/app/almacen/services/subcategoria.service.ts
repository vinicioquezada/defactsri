import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriaService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/almacen/subcategoria/";
  }

  listarSubCategorias() {
    return this.http.get(this.api + "listarsubcategorias");
  }

  buscar(cod_categoria:string, subcategoria: string) {
    return this.http.get(this.api + "buscar?cod_categoria=" + cod_categoria + "&" + "subcategoria=" + subcategoria);
  }

  guardar(parametros: any) {
    return this.http.post(this.api + "guardar", parametros);
  }

  actualizar(parametros: any) {
    return this.http.post(this.api + "actualizar", parametros);
  }

  eliminar(parametros: any) {
    return this.http.post(this.api + "eliminar", parametros);
  }

  listarSubCategoriasPorCategoria(cod_categoria:string) {
    return this.http.get(this.api + "listarsubcategoriasporcategoria?cod_categoria=" + cod_categoria);
  }

  listarSubCategoriasCategoria() {
    return this.http.get(this.api + "listarsubcategoriascategoria");
  }
}