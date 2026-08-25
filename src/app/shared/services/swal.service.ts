import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {

  constructor() { }

  iniciarLoading(titulo: string)
  {
    Swal.fire({
      title: titulo,
      html: `
        <div class="d-flex flex-column align-items-center">
          <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
          <p style="margin-top:10px;">Por favor espere...</p>
        </div>
      `,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      backdrop: true,
      customClass: {
        popup: 'swal2-loading-popup'
      }
    });
  }

  async alertConfirmRequerido(options?: {
    title?: string;
    text?: string;
    icon?: 'warning' | 'question' | 'info' | 'error' | 'success';
    confirmText?: string;
    cancelText?: string;
  }): Promise<boolean> {
    const result = await Swal.fire({
      title: options?.title || '¿Estás seguro?',
      text: options?.text || '',
      icon: options?.icon || 'question',
      showCancelButton: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: options?.confirmText || 'Sí',
      cancelButtonText: options?.cancelText || 'Cancelar'
    });

    return result.isConfirmed;
  }

  async alertConfirmNoRequerido(options?: {
    title?: string;
    text?: string;
    icon?: 'warning' | 'question' | 'info' | 'error' | 'success';
    confirmText?: string;
    cancelText?: string;
  }): Promise<boolean> {
    const result = await Swal.fire({
      title: options?.title || '¿Estás seguro?',
      text: options?.text || '',
      icon: options?.icon || 'question',
      showCancelButton: true,
      allowEscapeKey: true,
      allowOutsideClick: true,
      confirmButtonText: options?.confirmText || 'Sí',
      cancelButtonText: options?.cancelText || 'Cancelar'
    });

    return result.isConfirmed;
  }

  async alertOkRequerido(options?: {
    title?: string;
    text?: string;
    icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
    confirmText?: string;
  }): Promise<boolean> {

    const result = await Swal.fire({
      title: options?.title || 'Información',
      text: options?.text || '',
      icon: options?.icon || 'info',
      confirmButtonText: options?.confirmText || 'OK',
      allowEscapeKey: false,//Bloqueado ESC
      allowOutsideClick: false//Bloqueado Click Fuera
    });

    return result.isConfirmed;
  }

  alertOkSimple(options?: {
    title?: string;
    text?: string;
    icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
    confirmText?: string;
  }): void {

    Swal.fire({
      title: options?.title || 'Información',
      text: options?.text || '',
      icon: options?.icon || 'info',
      confirmButtonText: options?.confirmText || 'OK',
      allowEscapeKey: true,//Habilita ESC
      allowOutsideClick: true//Habilita Click Fuera
    });
  }

   async alertOkNoRequerido(options?: {
    title?: string;
    text?: string;
    icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
    confirmText?: string;
  }): Promise<boolean> {

    const result = await Swal.fire({
      title: options?.title || 'Información',
      text: options?.text || '',
      icon: options?.icon || 'info',
      confirmButtonText: options?.confirmText || 'OK',
      allowEscapeKey: true,//Habilita ESC
      allowOutsideClick: true//Habilita Click Fuera
    });

    return result.isConfirmed;
  }

  async alertPasswordRequerido(options?: {
    title?: string;
    text?: string;
    confirmText?: string;
    cancelText?: string;
  }): Promise<string | null> {

    const result = await Swal.fire({
      title: options?.title || 'Supervisión',
      text: options?.text || 'Ingrese contraseña',
      icon: 'info',
      input: 'password',
      inputAttributes: {
        autocapitalize: 'off'
      },
      confirmButtonText: options?.confirmText || 'Aceptar',
      cancelButtonText: options?.cancelText || 'Cancelar',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      allowEscapeKey: false,

      preConfirm: (password: string) => {
        if (!password) {
          Swal.showValidationMessage('Debe ingresar la contraseña');
          return null;
        }

        return password;
      }
    });

    if (result.isConfirmed) {
      return result.value;
    }

    return null;
  }

  async alertNumberRequerido(options?: {
    title?: string;
    text?: string;
    confirmText?: string;
    cancelText?: string;
  }): Promise<number | null> {

    const result = await Swal.fire({
      title: options?.title || 'Ingrese valor',
      text: options?.text || '',
      icon: 'info',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      confirmButtonText: options?.confirmText || 'Aceptar',
      cancelButtonText: options?.cancelText || 'Cancelar',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      allowEscapeKey: false,

      preConfirm: (valor: string): number | null => {        
        const numero = Number(valor);
        return numero;
      }
    });

    if (result.isConfirmed) {
      return result.value; // number
    }

    return null; // cancelado
  }

  async alertRecaudacion(item: {
    numero_factura: string;
    cliente: string;
    importetotal: number;
  }): Promise<number | null> {

    const result = await Swal.fire({
      html: `
        <div class="container text-left">
          <div class="row mb-2">
            <div class="col text-center">
              <h3 class="mb-0"><strong>VENTA Nº ${item.numero_factura}</strong></h3>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col">
              <h5 class="text-center"><strong>${item.cliente}</strong></h5>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col text-right">
              <h5 class="mb-0 text-success">
                <strong>TOTAL: ${item.importetotal}</strong>
              </h5>
            </div>
          </div>
          <label class="font-weight-bold">
            Ingresa el valor para guardar y dar el cambio
          </label>
        </div>
      `,
      icon: 'info',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      confirmButtonText: 'Guardar y Dar Cambio',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      allowEscapeKey: false,

      preConfirm: (valor: string): number | null => {

        if (!valor || valor.trim() === '') {
          Swal.showValidationMessage('Debe ingresar un valor');
          return null;
        }

        const numero = Number(valor);

        if (Number.isNaN(numero)) {
          Swal.showValidationMessage('Debe ingresar un número válido');
          return null;
        }

        if (numero < item.importetotal) {
          Swal.showValidationMessage(
            'La cantidad recibida debe ser mayor o igual al Importe Total'
          );
          return null;
        }

        return numero;
      }
    });

    if (result.isConfirmed) {
      return result.value;
    }

    return null;
  }

  alertCloseOk(options?: {
    title?: string;
    text?: string;
    icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
    timer?: number;
  }): void {

    Swal.fire({
      title: options?.title || 'Información',
      text: options?.text || '',
      icon: options?.icon || 'success',
      timer: options?.timer || 3000,
      timerProgressBar: true,
      showConfirmButton: true,
      allowOutsideClick: true,
    allowEscapeKey: true
    });
  }

  alertAutoClose(options?: {
    title?: string;
    text?: string;
    icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
    timer?: number;
  }): void {

    Swal.fire({
      title: options?.title || 'Información',
      text: options?.text || '',
      icon: options?.icon || 'success',
      timer: options?.timer || 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false
    });
  }

  close() {
    Swal.close();
  }

  async alertInfo(text: string): Promise<boolean>
  {
    const result = await Swal.fire({
      title: 'Información del Sistema',
      text: text,
      icon: 'info',
      confirmButtonText: 'OK',
      allowEscapeKey: false,//Bloqueado ESC
      allowOutsideClick: false//Bloqueado Click Fuera
    });

    return result.isConfirmed;
  }

  async alertError(text: string): Promise<boolean>
  {
    const result = await Swal.fire({
      title: 'Información del Sistema',
      text: text,
      icon: 'error',
      confirmButtonText: 'OK',
      allowEscapeKey: false,//Bloqueado ESC
      allowOutsideClick: false//Bloqueado Click Fuera
    });

    return result.isConfirmed;
  }

  async alertAviso(text: string): Promise<boolean>
  {
    const result = await Swal.fire({
      title: 'Información del Sistema',
      text: text,
      icon: 'warning',
      confirmButtonText: 'OK',
      allowEscapeKey: false,//Bloqueado ESC
      allowOutsideClick: false//Bloqueado Click Fuera
    });

    return result.isConfirmed;
  }

  async alertNumberConValorInicial(options?: {
    title?: string;
    text?: string;
    valorInicial?: string;
    confirmText?: string;
    cancelText?: string;
  }): Promise<number | null> {

    const result = await Swal.fire({
      title: options?.title || 'Ingrese valor',
      text: options?.text || '',
      icon: 'info',
      input: 'text',
      inputValue: options?.valorInicial || '1',
      inputAttributes: {
        autocapitalize: 'off'
      },
      confirmButtonText: options?.confirmText || 'Aceptar',
      cancelButtonText: options?.cancelText || 'Cancelar',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      allowEscapeKey: false,

      preConfirm: (valor: string): number | null => {

        if (!valor || valor.trim() === '') {
          Swal.showValidationMessage('Debe ingresar un valor');
          return null;
        }

        const numero = Number(valor);

        if (Number.isNaN(numero)) {
          Swal.showValidationMessage('Debe ingresar un número válido');
          return null;
        }

        if (numero <= 0) {
          Swal.showValidationMessage('Debe ingresar un valor mayor a 0');
          return null;
        }

        return numero;
      }
    });

    if (result.isConfirmed) {
      return result.value;
    }

    return null;
  }

  async alertTextoIngreso(options?: {
    title?: string;
    text?: string;
    valorInicial?: string;
    confirmText?: string;
    cancelText?: string;
  }): Promise<string | null> {

    const result = await Swal.fire<string>({
      title: options?.title || 'Ingrese valor',
      text: options?.text || '',
      icon: 'info',
      input: 'text',
      inputValue: options?.valorInicial || '',
      inputAttributes: {
        autocapitalize: 'off'
      },
      confirmButtonText: options?.confirmText || 'Aceptar',
      cancelButtonText: options?.cancelText || 'Cancelar',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      allowEscapeKey: false,

      preConfirm: (valor: string): string | null => {
        if (!valor || valor.trim() === '') {
          Swal.showValidationMessage('Debe ingresar un valor');
          return null;
        }

        return valor.trim(); // Se retorna 'valor' en lugar de 'numero'
      }
    });

    if (result.isConfirmed && result.value) {
      return result.value;
    }

    return null;
  }


}


