import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaGastosService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/gastosingresos/categoriagastos/";
  }

  listarCategoriaGastos()
  {
    return this.http.get(this.api + "listarcategoriagastos");
  }

  buscar(categoria_gastos: string)
  {
    return this.http.get(this.api + "buscar?categoria_gastos=" + categoria_gastos);
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