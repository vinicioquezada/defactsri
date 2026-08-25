import { Component, OnInit, ViewChild} from '@angular/core';
import { DetalleProductosRevisionComponent } from 'src/app/shared/components/detalle-productos-revision/detalle-productos-revision.component';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { MovimientoMercaderiaService } from '../../services/movimiento-mercaderia.service';
import { TipoSalidaMercaderiaService } from '../../services/tipo-salida-mercaderia.service';
import * as moment from 'moment';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;

import Swal from 'sweetalert2/dist/sweetalert2.js';

import { Router, ActivatedRoute } from '@angular/router';
import { BodyStyleService } from 'src/app/shared/services/body-style.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-movimiento-mercaderia-verificar',
  templateUrl: './movimiento-mercaderia-verificar.component.html',
  styleUrls: ['./movimiento-mercaderia-verificar.component.css']
})
export class MovimientoMercaderiaVerificarComponent implements OnInit {
  multisucursal : string = "0";
  kardex : string = "";
  @ViewChild(DetalleProductosRevisionComponent) childdetalleproductorevision: any;

  datosdetalles : any;

  cod_sucursal : string = "";
  sucursal : string = "";

  cod_movimiento_mercaderia : string = "";
  numero_movimiento : string = "";
  cod_sucursal_receptar : string = "";
  sucursal_receptar : string = "";
  fecha_registro : string = "";

  loading : boolean = false;

  items = [];

  datosproducto : any = [];

  constructor(private rutaActiva: ActivatedRoute, private movimientomercaderiaservice:MovimientoMercaderiaService, private toastr: ToastrService, private error:ErrorService, private tipomovimientomercaderiaservice:TipoSalidaMercaderiaService, private sucursalesservice:SucursalesService, private bodyStyleService: BodyStyleService, private usersession: UserSessionService) {
  }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.kardex = this.usersession.getConfiguracion("kardex");
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.formularioNormal();
    this.bodyStyleService.resetBodyStyles();
  }

  ngAfterViewInit(): void {
    this.childdetalleproductorevision.datosdetalles = [];
  }

  formularioNormal()
  {
    this.cod_movimiento_mercaderia = this.rutaActiva.snapshot.paramMap.get("cod_movimiento_mercaderia")!;
    this.buscarMovimientoMercaderia();
  }

  clickDeshacer()
  {
    this.childdetalleproductorevision.datosdetalles = [];
    this.formularioNormal();
  }

  buscarMovimientoMercaderia()
  {
    this.loading = true;
    

    this.movimientomercaderiaservice.buscarMovimientoMercaderia(this.cod_movimiento_mercaderia).subscribe( (data : any) =>
    {
      this.cod_sucursal = data[0].cod_sucursal;
      this.sucursal = data[0].sucursal;
      this.numero_movimiento = data[0].numero_movimiento;
      this.cod_sucursal_receptar = data[0].cod_sucursal_receptar;
      this.sucursal_receptar = data[0].sucursal_receptar;
      this.fecha_registro = moment(data[0].fecha_hora).format('YYYY-MM-DD');

      data.forEach(element => {
        let descripcion = element.detalle;
        let detalle = {
          fila_error : false,//Para marcar la fila editada con rojo
          cod_producto : element.cod_producto,
          cantidad_comprar : element.cantidad_comprar,
          cantidad_paquete : element.cantidad_empaque,
          cantidad_ajuste : element.cantidad_ajuste,
          cantidad_unidad : element.cantidad_unidad,
          descripcion : descripcion,
          unidades_denominacion :element.unidades_denominacion,
          cantidad_antigua : element.cantidad_unidad,
          modificable : 0,
          id_detalle_movimiento_mercaderia : element.id_detalle_movimiento_mercaderia,
          cantidad_comprar_revisado : element.cantidad_comprar_revisado,
          cantidad_paquete_revisado : element.cantidad_empaque_revisado,
          cantidad_ajuste_revisado : element.cantidad_ajuste_revisado,
          cantidad_unidad_revisado : element.cantidad_unidad_revisado,
          cod_sucursal : this.cod_sucursal,
          cod_sucursal_receptar : this.cod_sucursal_receptar,
          estado_movimiento : element.estado_movimiento,
          kardex :this.kardex,
          cod_movimiento_mercaderia : this.cod_movimiento_mercaderia,
          numero_movimiento : this.numero_movimiento,
          observacion : element.observacion
        }
        this.childdetalleproductorevision.datosdetalles.push(detalle);
      }); 
      this.loading = false;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
    });
  }

}