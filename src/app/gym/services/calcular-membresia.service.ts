import { Injectable } from '@angular/core';
import * as moment from 'moment';

export interface EstadoPlan {
  activo: boolean;
  estado: 'CADUCADO' | 'POR INICIAR' | 'ACTIVO' | 'POR CADUCAR';
  dias: number;
}

export interface EstadoHorario {
  enHorario: boolean;
  estado: 'EN HORARIO' | 'FUERA DE HORARIO';
}

@Injectable({
  providedIn: 'root'
})

export class CalcularMembresiaService {
private readonly FORMATO_FECHA = 'YYYY-MM-DD HH:mm:ss';
  private readonly FORMATO_HORA = 'HH:mm:ss';

  constructor() { }

  verificarPlanActivo(fechaInicio: string, fechaFin: string): EstadoPlan
  {
    const ahora = moment();
    const inicio = moment(fechaInicio, this.FORMATO_FECHA);
    const fin = moment(fechaFin, this.FORMATO_FECHA);

    if (!inicio.isValid() || !fin.isValid()) {
      console.error('Fechas inválidas', fechaInicio, fechaFin);
      return {
        activo: false,
        estado: 'CADUCADO',
        dias: 0
      };
    }

    const hoy = ahora.clone().startOf('day');
    const inicioDia = inicio.clone().startOf('day');
    const finDia = fin.clone().startOf('day');

    if (hoy.isBefore(inicioDia)) {
      return {
        activo: false,
        estado: 'POR INICIAR',
        dias: finDia.diff(inicioDia, 'days') + 1
      };
    }

    if (hoy.isAfter(finDia)) {
      return {
        activo: false,
        estado: 'CADUCADO',
        dias: 0
      };
    }

    const diasRestantes = finDia.diff(hoy, 'days') + 1;

    return {
      activo: true,
      estado: diasRestantes <= 2 ? 'POR CADUCAR' : 'ACTIVO',
      dias: diasRestantes
    };
  }

  obtenerHorarioPlan(
    lunes: number, martes: number, miercoles: number,
    jueves: number, viernes: number, sabado: number, domingo: number
  ): string {
    const dias: string[] = [];
    if (lunes) dias.push('L');
    if (martes) dias.push('M');
    if (miercoles) dias.push('Mi');
    if (jueves) dias.push('J');
    if (viernes) dias.push('V');
    if (sabado) dias.push('S');
    if (domingo) dias.push('D');
    return dias.join(', ');
  }

  verificarHorarioPlan(
    lunes: number, martes: number, miercoles: number,
    jueves: number, viernes: number, sabado: number, domingo: number,
    horaInicio: string, horaFin: string
  ): EstadoHorario
  {
    const ahora = moment();
    const horaActual = moment(ahora.format(this.FORMATO_HORA), this.FORMATO_HORA);
    const inicio = moment(horaInicio, this.FORMATO_HORA);
    const fin = moment(horaFin, this.FORMATO_HORA);

    const diaSemana = ahora.day(); // 0=Domingo ... 6=Sábado
    const diasPermitidos = [domingo, lunes, martes, miercoles, jueves, viernes, sabado];

    const dentroHorario = horaActual.isBetween(inicio, fin, undefined, '[]');
    const diaPermitido = diasPermitidos[diaSemana] === 1;

    if (dentroHorario && diaPermitido) {
      return {
        enHorario: true,
        estado: 'EN HORARIO'
      };
    }

    if (!dentroHorario && (
      (diaSemana == 0 && domingo == 1) ||
      (diaSemana == 6 && sabado == 1)
    )) {
      return {
        enHorario: true,
        estado: 'EN HORARIO'
      };
    }

    return {
      enHorario: false,
      estado: 'FUERA DE HORARIO'
    };
  }
}