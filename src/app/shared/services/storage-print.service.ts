import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoragePrintService {

  constructor() {}

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string): any {
    const data = localStorage.getItem(key);

    if (!data) {
      return null;
    }

    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error al obtener los datos', e);
      return null;
    }
  }

  getValorPorId(id_configuracion_documentos: number): any {
    const datos = this.getItem('print');

    if (!datos || !Array.isArray(datos)) {
      return null;
    }

    const registro = datos.find(
      (item: any) =>
        item.id_configuracion_documentos == id_configuracion_documentos
    );

    return registro ? registro.valor : null;
  }

  getValorPorCategoriaOpcion(
    categoria_configuracion: string,
    opciones: string
  ): any {
    const datos = this.getItem('print');

    if (!datos || !Array.isArray(datos)) {
      return null;
    }

    const registro = datos.find(
      (item: any) =>
        item.categoria_configuracion === categoria_configuracion &&
        item.opciones === opciones
    );

    return registro ? registro.valor : null;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clearAll(): void {
    localStorage.clear();
  }
}