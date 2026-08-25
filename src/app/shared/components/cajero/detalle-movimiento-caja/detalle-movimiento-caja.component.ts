import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-movimiento-caja',
  templateUrl: './detalle-movimiento-caja.component.html',
  styleUrls: ['./detalle-movimiento-caja.component.css']
})
export class DetalleMovimientoCajaComponent implements OnInit {
  @Input() efectivo: number = 0;
  @Input() deposito: number = 0;
  @Input() debito: number = 0;
  @Input() credito: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
