import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  token : any;
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //Obtenemos el token del sessioStorage
   
    this.token  = localStorage.getItem("token");

    let request = req;
    //Validamos si el token existe
    if (this.token) {
      //Clonamos el token y lo mandamos en la cabecera de todas las peticiones HTTP
      request = req.clone({
        setHeaders: {
          //Autorizaciòn de tipo Bearer + token
          //El tipo de autorizaciòn depende del back
          Authorization: `Bearer ${this.token}`
        }
    
      });
    }
    //return next.handle(request);
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        //alert(err.status);
        console.log(err);
        if (err.status === 401) {
          //alert(err.status);
          localStorage.clear();
        }

        return throwError( err );

      })
    );
  }
}