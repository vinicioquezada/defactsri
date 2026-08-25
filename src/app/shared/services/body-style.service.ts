import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BodyStyleService {

  resetBodyStyles(): void {
    document.body.classList.remove('modal-open'); // Elimina la clase modal-open
    document.body.style.overflow = ""; // Restablece el scroll
    document.body.style.paddingRight = ""; // Restablece el relleno derecho
    document.body.style.marginLeft = ""; // Corrige el margen acumulado
  }
  
}
