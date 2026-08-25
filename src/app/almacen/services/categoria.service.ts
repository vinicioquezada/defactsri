import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/almacen/categoria/";
  }

  listarCategorias()
  {
    return this.http.get(this.api + "listarcategorias");
  }

  buscar(categoria: string)
  {
    return this.http.get(this.api + "buscar?categoria=" + categoria);
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
}