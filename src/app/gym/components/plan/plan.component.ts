import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from 'src/app/almacen/services/producto.service';
import { PlanService } from '../../services/plan.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { PlanFormComponent } from './plan-form/plan-form.component';
import { SwalService } from 'src/app/shared/services/swal.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {
  @ViewChild(PlanFormComponent) childplanform: PlanFormComponent;
  datos : any;
  filterpost = "";
  cod_producto_eliminar : string = "";
  descripcion_eliminar : string = "";
  codigotemporal : string = "";
  loadinglistado : boolean = false;
  cantidad_registros : number = 0;
  cod_sucursal : string = "";

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private productoservice:ProductoService, private toastr: ToastrService, private error:ErrorService, private planservice : PlanService, private usersession: UserSessionService, private swalservice: SwalService) {
  }

  ngOnInit(): void {
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.formularioNormal();
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
      this.eliminar();
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
    
      if (data.estado == true)
      {
        
        this.formularioNormal();        

        this.toastr.success("Registro eliminado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        const ok = await this.swalservice.alertError("Registro no se pudo eliminar, vuelva a intertarlo por favor");
      }
    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
      this.swalservice.close();
    }
  }
  
  formularioNormal()
  {
    this.cod_producto_eliminar=""
    this.descripcion_eliminar="";
    this.codigotemporal="";
    this.listarservicios();
  }
  
  listarservicios()
  {
    this.page = 1;
    this.filterpost = "";
    this.loadinglistado = true;
    
    this.planservice.listarPlanes().subscribe( (data : any) =>
    {
      this.loadinglistado = false;
      
      this.datos = data;
      this.cantidad_registros = data.length;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
    
  }

  handlePageChange(event: number): void {
    this.page = event;
  }

  clickNuevoProducto()
  {
    this.childplanform.nombreformulario = "NUEVA";
    this.childplanform.formularioNormal();
    this.childplanform.listarSucursales();
    $("#mymodalformplan").modal("show");
  }

  editar(item: any)
  {
      this.childplanform.nombreformulario = "EDITAR";
      this.childplanform.cod_producto = item.cod_producto;
      this.childplanform.buscarProducto();
      $("#mymodalformplan").modal("show");
  }

  recibirDatosPlanForm(): void
  {
    this.formularioNormal();
    this.childplanform.formularioNormal();
    $("#mymodalformplan").modal("hide");
  }

}