import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormaPagoDTO } from 'src/app/venta/models/forma-pago.dto';
import { TransaccionTarjetaService } from 'src/app/venta/services/transaccion-tarjeta.service';
import { ErrorService } from '../../services/error.service';
import { TarjetaTarifaService } from 'src/app/venta/services/tarjeta-tarifa.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { RecargoDTO } from 'src/app/venta/models/recargo.dto';

@Component({
  selector: 'app-recargo-factura',
  templateUrl: './recargo-factura.component.html',
  styleUrls: ['./recargo-factura.component.css']
})
export class RecargoFacturaComponent implements OnInit {
  @Input() disabledcmbrecargo : boolean = true;
  recargo: RecargoDTO = new RecargoDTO;
  
  transacciontarjeta : any = [];
  tarifarecargo : any = [];

  @Input() loading : boolean = false;

  @Output() sendChangeRecargo: EventEmitter<any> = new EventEmitter<any>();
  @Output() sendChangeTarjetaTarifa: EventEmitter<any> = new EventEmitter<any>();

  constructor(private tarjetatarifaservice : TarjetaTarifaService, private toastr : ToastrService, private error : ErrorService, private transacciontarjetaservice : TransaccionTarjetaService) { }

  ngOnInit(): void {
    this.listarFormaPagos();
    this.recargo.cod_transaccion_tarjeta = 0;
  }

  changeFormaPago(event: any): void {
    const elemento = event.target.value;
    this.recargo.cod_transaccion_tarjeta = elemento;
    const resultado = this.transacciontarjeta.find( (valor : any) => valor.cod_transaccion_tarjeta == this.recargo.cod_transaccion_tarjeta );
    this.recargo.transaccion_tarjeta = resultado.transaccion_tarjeta;
    

    let envio = {};

    if(resultado.cod_transaccion_tarjeta==0)
    {
      
      this.recargo.cod_tarifa_recargo = 0;
      this.recargo.tarifa_recargo = "";
      this.tarifarecargo = [];
      
     
      envio = {
        "disabledchkcontado" : false,
        "disabledbtncalcular" : false,
        "transaccion_tarjeta" : this.recargo.transaccion_tarjeta
      }
    }
    else
    {
      this.recargo.cod_tarifa_recargo = 0;
      this.recargo.tarifa_recargo = "";
      this.tarifarecargo = [];

      this.listarTarifasRecargo();

      envio = {
        "disabledchkcontado" : true,
        "disabledbtncalcular" : true,
        "transaccion_tarjeta" : this.recargo.transaccion_tarjeta
      }
    }
    this.sendChangeRecargo.emit(envio);
  }
  
  changeTarjetaTarifa(event: any): void {
    
    const elemento = event.target.value;
    this.recargo.cod_tarifa_recargo = elemento;
    if(this.recargo.cod_tarifa_recargo!=0)
    {
      const resultado = this.tarifarecargo.find( (valor : any) => valor.cod_tarifa_recargo == this.recargo.cod_tarifa_recargo );
      this.recargo.tarifa_recargo = resultado.tarifa_recargo;

      Swal.fire({
        title: '¿Incrementar el porcentaje seleccionado?',
        text: 'Todos los items del detalle se incrementará',
        icon: 'info',//'warning'
        showCancelButton: true,
        confirmButtonText: 'Si, Incrementar',
        cancelButtonText: 'No, Incrementar'
      }).then((result) => {
        if (result.value) {

          this.sendChangeTarjetaTarifa.emit(this.recargo.tarifa_recargo);

          Swal.fire(
            'Realizado',
            'Todos los items del detalle se incrementarón el porcentaje seleccionado',
            'success'
          )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelado',
            'No se realizaron cambios',
            'error'
          )
        }
      });
    }
  }
  
  listarFormaPagos()
  {    
    this.loading = true;
    this.transacciontarjetaservice.listarTransaccionTarjeta().subscribe( (data : any) =>
    {
      this.loading = false;

      let transacciontarjeta = {
        "cod_transaccion_tarjeta" : 0,
        "transaccion_tarjeta" : "NO APLICA",
        "cod_tipo_tarjeta" : 0,
        "estado" : 1
      };
      this.transacciontarjeta.push(transacciontarjeta);

      data.forEach(element => {
        transacciontarjeta = {
          "cod_transaccion_tarjeta" : element.cod_transaccion_tarjeta,
          "transaccion_tarjeta" : element.transaccion_tarjeta,
          "cod_tipo_tarjeta" : element.cod_tipo_tarjeta,
          "estado" : element.estado
        }
        this.transacciontarjeta.push(transacciontarjeta);
      });
    }, err => {
      this.loading = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

  listarTarifasRecargo()
  {
    this.loading = true;
    
    this.transacciontarjetaservice.listarTarifasRecargo().subscribe( (data : any) =>
    {
      this.tarifarecargo = data;
      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
  }

}