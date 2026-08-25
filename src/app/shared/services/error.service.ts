import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  getClientMessage(error: Error): string {
    if (!navigator.onLine) {
        return 'No Internet Connection';
    }
    return error.message ? error.message : error.toString();
  }

  getClienteStatus(status: number): string {
    if(status==0)
    {
        return "No hay conexión a Internet";
    }

    if(status==404)
    {
        return "Recurso Web no Funciona";
    }

    if(status==401)
    {
        return "Token no proporcionado";
    }

    if(status==429)
    {
        return "Has superado el límite de peticiones. Inténtalo de nuevo más tarde";
    }

    if(status==500)
    {
        return "Error de conexion o de bases de datos";
    }
      return "";
      
  }

  getServerMessage(error: HttpErrorResponse): string {
    return error.message;
  }

  getServerStack(error: HttpErrorResponse): string {
      // handle stack trace
      return 'stack';
  }

}