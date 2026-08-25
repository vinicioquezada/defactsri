import { Component, OnInit, ViewChild, ChangeDetectorRef, EventEmitter, Output} from '@angular/core';
import { TarifaService } from 'src/app/almacen/services/tarifa.service';
import { ErrorService } from '../../services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { redondeardecimales } from '../../../shared/js/decimales.js';
declare var $:any;

@Component({
  selector: 'app-detalle-registro-caducidad',
  templateUrl: './detalle-registro-caducidad.component.html',
  styleUrls: ['./detalle-registro-caducidad.component.css']
})
export class DetalleRegistroCaducidadComponent implements OnInit {
  @Output()
  datosenviar: EventEmitter<any> = new EventEmitter<any>();

  datosdetalles : any = [];

  loading : boolean = false;

  constructor(private cd : ChangeDetectorRef) { }

  ngOnInit(): void {

  }

  keyPendiente(index: number): void {
    this.datosdetalles[index].fila_error = true;
  }

  changeFechaCaducidad(index: number): void {
    this.datosdetalles[index].fila_error = false;
  }
}