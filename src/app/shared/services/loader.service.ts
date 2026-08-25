import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  iniciarLoader(mensaje: string = 'Cargando...') {
    Swal.fire({
    title: mensaje,
      html: `<div class="spinner-border text-primary" style="width: 3rem; height: 3rem; margin-top: 1rem; margin-bottom: 1rem;"></div>`,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      backdrop: true,
      customClass: {
        popup: 'swal2-loading-popup'
      }
    });
  }

  cerrarLoader() {
    Swal.close();
  }

}
