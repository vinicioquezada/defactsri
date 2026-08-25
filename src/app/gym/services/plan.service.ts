import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(private http:HttpClient, private configService: ConfigService) {
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/gym/plangym/";
  }

  listarPlanes()
  {
    return this.http.get(this.api + "listarplanes");
  }

  guardarPlan(parametros: any){
    return this.http.post(this.api + "guardarplan", parametros);
  }

  buscarPlan(cod_producto: string)
  {
    return this.http.get(this.api + "buscarplan?cod_producto=" + cod_producto);
  }

  actualizarPlan(parametros: any){
    return this.http.post(this.api + "actualizarplan", parametros);
  }

  listarPlanesActivos(cod_sucursal: string)
  {
    return this.http.get(this.api + "listarplanesactivos?cod_sucursal=" + cod_sucursal);
  }

  listarSubcategoriasPlanActivo()
  {
    return this.http.get(this.api + "listarsubcategoriasplanactivo");
  }
  
  listarPlanesDiariosActivos(cod_sucursal: string)
  {
    return this.http.get(this.api + "listarplanesdiariosactivos?cod_sucursal=" + cod_sucursal);
  }

  listarPlanActividad(cod_producto: string)
  {
    return this.http.get(this.api + "listarplanactividad?cod_producto=" + cod_producto);
  }
}