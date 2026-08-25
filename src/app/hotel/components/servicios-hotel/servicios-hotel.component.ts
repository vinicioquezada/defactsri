import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from 'src/app/almacen/services/producto.service';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { ExistenciasService } from 'src/app/almacen/services/existencias.service';
import { ServiciosHotelService } from '../../services/servicios-hotel.service';
import { SubcategoriaService } from 'src/app/almacen/services/subcategoria.service';
import { MarcaService } from 'src/app/almacen/services/marca.service';
import { UnidadMedidaService } from 'src/app/almacen/services/unidad-medida.service';
import { IvaCompraService } from 'src/app/almacen/services/iva-compra.service';
import { IvaService } from 'src/app/almacen/services/iva.service';
import { DenominacionService } from 'src/app/almacen/services/denominacion.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { redondeardecimales } from '../../../shared/js/decimales.js';
declare var $:any;
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { lastValueFrom } from 'rxjs';
import { SwalService } from 'src/app/shared/services/swal.service';
import { ServiciosHotelFormComponent } from './servicios-hotel-form/servicios-hotel-form.component';

@Component({
  selector: 'app-servicios-hotel',
  templateUrl: './servicios-hotel.component.html',
  styleUrls: ['./servicios-hotel.component.css']
})
export class ServiciosHotelComponent implements OnInit {
  @ViewChild(ServiciosHotelFormComponent) childserviciohotelform: ServiciosHotelFormComponent;
  precios_completos : string = "0";

  cod_producto: string = "";
  datos : any;

  cantidad_registros : Number = 0;

  filterpost = "";

  cod_producto_eliminar : string = "";
  descripcion_eliminar : string = "";

  loadinglistado : boolean = false;
  

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private servicioshotelservice:ServiciosHotelService, private toastr: ToastrService, private error:ErrorService, private subcategoriaservice:SubcategoriaService, private marcaservice:MarcaService, private unidadmedidaservice:UnidadMedidaService, private ivacompraservice:IvaCompraService, private ivaservice:IvaService, private denominacionservice:DenominacionService, private sucursalesservice:SucursalesService, private existenciaservice:ExistenciasService, private usersession: UserSessionService, private productoservice: ProductoService, private swalservice: SwalService) {
  }

  ngOnInit(): void {
    this.precios_completos = this.usersession.getConfiguracion("precios_completos");
    this.cargarFormulario();
  }

  async cargarFormulario()
  {
    await this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  async clickEliminar(cod_producto_eliminar: string, descripcion_eliminar: string)
  {
    this.cod_producto_eliminar = cod_producto_eliminar;
    this.descripcion_eliminar = descripcion_eliminar;

    const ok = await this.swalservice.alertConfirmRequerido({
      title: "ELIMINAR REGISTRO "  + this.descripcion_eliminar,
      text: "Confirmar para eliminar el registro seleccionado",
      icon: "info",
      confirmText: "Si, Eliminar",
      cancelText: "No, Cerrar"
    });

    if (ok)
    {
      await this.eliminar();
    }
  }
  
  clickDeshacer()
  {
    this.formularioNormal();
  }

   async eliminar()
  {
    this.swalservice.iniciarLoading("Eliminando...");
    try
    {
      const parametros = {
        'cod_producto' : this.cod_producto_eliminar,
        'estado' : 0,
      };
      let data: any = await lastValueFrom(this.productoservice.eliminar(parametros));
      this.swalservice.close();
      if (data.estado == true)
      {
        this.formularioNormal();
        this.childserviciohotelform.formularioNormal();      
        this.toastr.success("Registro eliminado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        const ok = await this.swalservice.alertError("Registro no se pudo eliminar e, vuelva a intertarlo por favor");
      }
    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
      this.swalservice.close();
    }
  }

  async formularioNormal()
  {
    this.cod_producto_eliminar=""
    this.descripcion_eliminar="";
    this.filterpost="";
    this.loadinglistado = false;

    this.page = 1;
    this.filterpost = "";

    try
    {
      this.loadinglistado = true;
      
      await this.listarServicios();
      
    } catch (err: any) {
        this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
        this.loadinglistado = false;
    }
  }
  
  async listarServicios()
  {
    this.page = 1;
    this.filterpost = "";
    let data: any = await lastValueFrom(this.servicioshotelservice.listarServicios());
    this.datos = data;
    this.cantidad_registros = data.length;
  }
 
  handlePageChange(event: number): void {
    this.page = event;
  }

  clickNuevoProducto()
  {
    this.childserviciohotelform.nombreformulario = "NUEVA";
    this.childserviciohotelform.formularioNormal();
    this.childserviciohotelform.listarSucursales();
    $("#mymodalformservicioshotel").modal("show");
  }

  recibirDatosProducto(): void {
    this.formularioNormal();
    this.childserviciohotelform.formularioNormal();
    $("#mymodalformservicioshotel").modal("hide");
  }

  editar(item: any)
  {
      this.childserviciohotelform.nombreformulario = "EDITAR";
      let cod_producto = item.cod_producto;
      $("#mymodalformservicioshotel").modal("show");
      this.childserviciohotelform.buscarProducto(cod_producto);
  }

}