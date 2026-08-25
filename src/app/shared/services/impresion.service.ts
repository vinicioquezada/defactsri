import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImpresionService {
// URL de tu servidor Express local
  private readonly URL_PRINTER_LOCAL = 'http://localhost:3000/imprimir';

  constructor(private http: HttpClient) {}

  enviarAImpresoraLocal(urlReporte: string): Observable<any> {
    return this.http.get(urlReporte, { responseType: 'blob' }).pipe(
      switchMap((blob: Blob) => {
        const headers = new HttpHeaders({
          'Content-Type': 'application/pdf'
        });
        
        return this.http.post(this.URL_PRINTER_LOCAL, blob, { headers });
      })
    );
  }
}
