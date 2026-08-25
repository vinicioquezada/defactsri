import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MovimientoMercaderiaService } from 'src/app/almacen/services/movimiento-mercaderia.service';
import { ErrorService } from 'src/app/shared/services/error.service';

@Component({
  selector: 'app-detalle-productos-revision',
  templateUrl: './detalle-productos-revision.component.html',
  styleUrls: ['./detalle-productos-revision.component.css']
})
export class DetalleProductosRevisionComponent implements OnInit {
  @Input() datosproducto = [];
  @Input() datostarifasproducto = [];

  @ViewChild("scrolly") scrolly: ElementRef;
  enfocar : boolean = true;

  datosdetalles : any = [];

  tipo_formulario: string = "";

  loading : boolean = false;
  loadingalmacenar : boolean = false;
  cod_sucursal : string = "";
  cod_sucursal_receptar : string = "";
  
  constructor(private movimientomercaderiaservice: MovimientoMercaderiaService, private toastr: ToastrService, private error: ErrorService) { }

  ngOnInit(): void {
  }

  keyPendiente(index: number): void {
    this.datosdetalles[index].fila_error = true;
  }

  keySumar(item: any): void {
    if(item.cantidad_comprar_revisado.length==0 || item.cantidad_paquete_revisado.length==0 || item.cantidad_ajuste_revisado.length==0)
    {
      this.toastr.error("No puede dejar un valor vacio para calcular", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      let cantidad_unidad_revisado = (parseFloat(item.cantidad_comprar_revisado) * parseFloat(item.cantidad_paquete_revisado)) + parseFloat(item.cantidad_ajuste_revisado);

      if(cantidad_unidad_revisado > item.cantidad_unidad)
      {
        this.toastr.error("No puede tener mas cantidad de unidades del registro", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        item.fila_error = false;
        item.modificable = 1;
        item.cantidad_unidad_revisado = cantidad_unidad_revisado;
      }
    }
  }

  keyConfirmar(item: any): void {
    item.fila_error = false;
  }

  clickSubirInventario(item: any)
  {
      Swal.fire({
        title: item.descripcion,
        text: '¿Estás seguro de subir producto en inventario?',
        icon: 'info',//'warning'
        showCancelButton: true,
        confirmButtonText: 'Si, Subir',
        cancelButtonText: 'No, Cerrar'
      }).then((result) => {
        if (result.value) {
          this.subirInventario(item);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          
        }
      });
  }

  subirInventario(item: any)
  {
    this.loadingalmacenar = true;
    this.movimientomercaderiaservice.subirInventario(item).subscribe( (data : any) =>
    {
      this.loadingalmacenar = false; 
      if (data.estado == true)
      {
        item.estado_movimiento = "REVISADO";
        this.toastr.success("Registro Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        this.toastr.error("Registro no se pudo Almacenar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
    }, err => {
      this.loadingalmacenar = false;
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    });
  }

}