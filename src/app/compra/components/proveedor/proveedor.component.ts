import { Component, OnInit, ViewChild } from '@angular/core';
import { ProveedorService } from '../../services/proveedor.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { ProveedorFormComponent } from './proveedor-form/proveedor-form.component';
declare var $:any;
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ProductosProveedorComponent } from './productos-proveedor/productos-proveedor.component';
import { SwalService } from 'src/app/shared/services/swal.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {
  @ViewChild(ProveedorFormComponent) childproveedorform!: ProveedorFormComponent;
  @ViewChild(ProductosProveedorComponent) childproductoproveedor!: ProductosProveedorComponent;
  tipoformulario: string = "normal";
  cantidad_registros : number = 0;

  datos : any;
  filterpost = "";
  cod_proveedor_eliminar : string = "";
  proveedor_eliminar : string = "";
  loadinglistado : boolean = false;
  
  page = 1;
  count = 0;
  pagesize = 5;
  pagesizes = [3, 6, 9];

  constructor(private proveedorservice: ProveedorService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService) { 
  }

  ngOnInit(): void {
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  async clickEliminar(cod_proveedor_eliminar: string, proveedor_eliminar: string)
  {
    this.cod_proveedor_eliminar = cod_proveedor_eliminar;
    this.proveedor_eliminar = proveedor_eliminar;
    
    const ok = await this.swalservice.alertConfirmRequerido({
      title: "ELIMINAR REGISTRO "  + this.proveedor_eliminar,
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
  
  async eliminar()
  {
    this.swalservice.iniciarLoading("Eliminando...");
    try
    {
      const parametros = {
        'cod_proveedor' : this.cod_proveedor_eliminar,
        'estado' : 0,
      };

      let data: any = await lastValueFrom(this.proveedorservice.eliminar(parametros));
    
      if (data.estado == true)
      {
        this.listarProveedores();
        
        this.toastr.success("Registro eliminado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        const ok = await this.swalservice.alertError("Registro no se pudo Eliminar, vuelva a intertarlo por favor");
      }

    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
      this.swalservice.close();
    }
  }
  
  clickDeshacer()
  {
    this.formularioNormal();
    this.childproveedorform.formularioNormal();
  }
  
  formularioNormal()
  {
    this.cod_proveedor_eliminar = "";
    this.proveedor_eliminar = "";
    this.listarProveedores();
  }

  listarProveedores()
  {
    this.page = 1;
    this.filterpost="";
    this.loadinglistado = true;
    this.proveedorservice.listar().subscribe( (data : any) =>
    {
      this.datos = data;
      this.loadinglistado = false;
      
      this.cantidad_registros = data.length;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
      
    });
  }

  getRequestParams(searchTitle: string, page: number, pagesize: number): any {
    let params: any = {};
    if (searchTitle) {
      params[`title`] = searchTitle;
    }
    if (page) {
      params[`page`] = page - 1;
    }
    if (pagesize) {
      params[`size`] = pagesize;
    }
    return params;
  }

  recibirDatosProveedor(): void {
    this.formularioNormal();
    this.childproveedorform.formularioNormal();
    $("#mymodalformproveedor").modal("hide");
  }

  handlePageChange(event: number): void {
    this.page = event;
  }

  editar(item : any)
  {
      this.childproveedorform.nombreformulario = "EDITAR";
      this.childproveedorform.editar(item);
      $("#mymodalformproveedor").modal("show");
  }

  clickNuevoProveedor()
  {
    this.childproveedorform.nombreformulario = "NUEVO";
    this.childproveedorform.formularioNormal();
    $("#mymodalformproveedor").modal("show");
  }

  revisarProductos(cod_proveedor : string, razon_social : string)
  {
      this.childproductoproveedor.revisarProductos(cod_proveedor, razon_social);
  }

  

}