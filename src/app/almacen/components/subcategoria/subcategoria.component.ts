import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { SubcategoriaService } from '../../services/subcategoria.service';
import { SubcategoriaFormComponent } from './subcategoria-form/subcategoria-form.component';
import { SwalService } from 'src/app/shared/services/swal.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-subcategoria',
  templateUrl: './subcategoria.component.html',
  styleUrls: ['./subcategoria.component.css']
})
export class SubcategoriaComponent implements OnInit {
  @ViewChild(SubcategoriaFormComponent) childsubcategoria!: SubcategoriaFormComponent;
  datos : any;
  filterpost = "";

  cod_subcategoria : string = "";
  subcategoria : string = "";

  loadinglistado : boolean = false;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private subcategoriaservice: SubcategoriaService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService, private router : Router) {
  }

  ngOnInit(): void {
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  async clickEliminar(cod_subcategoria: string, subcategoria: string)
  {
    this.cod_subcategoria = cod_subcategoria;
    this.subcategoria = subcategoria;
    
    const ok = await this.swalservice.alertConfirmRequerido({
          title: "ELIMINAR REGISTRO "  + this.subcategoria,
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
    this.childsubcategoria.formularioNormal();
  }

  editar(item : any)
  {
      this.childsubcategoria.nombreformulario = "EDITAR";
      this.childsubcategoria.editar(item);
      $("#mymodalformsubcategoria").modal("show");
  }

  async eliminar()
  {
    this.swalservice.iniciarLoading("Eliminando...");
    try
    {
        const parametros = {
          'cod_subcategoria' : this.cod_subcategoria,
          'estado' : 0,
        };
    

        let data: any = await lastValueFrom(this.subcategoriaservice.eliminar(parametros));
        this.swalservice.close();
        if (data.estado == true)
        {
          this.toastr.success("Registro eliminado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
          await this.formularioNormal();
        }
        else
        {
          const ok = await this.swalservice.alertError("Registro no se pudo Eliminar, vuelva a intertarlo por favor");
        }
    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
      this.swalservice.close();
    }
  }
  
  async formularioNormal()
  {
    this.cod_subcategoria=""
    this.subcategoria="";
    this.filterpost="";

    try
    {
      this.loadinglistado = true;
      await this.listarSubCategorias();
      this.childsubcategoria.formularioNormal();
    } catch (err: any) {
        this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
        this.loadinglistado = false;
    }

  }
  
  async listarSubCategorias()
  {
    this.page = 1;
    this.filterpost = "";
    let data: any = await lastValueFrom(this.subcategoriaservice.listarSubCategorias());
    this.datos = data;
  }

  clickNuevaSubCategoria()
  {
    this.childsubcategoria.nombreformulario = "NUEVA";
    this.childsubcategoria.formularioNormal();
    $("#mymodalformsubcategoria").modal("show");
  }

  recibirDatosSubcategoria(): void
  {
      this.formularioNormal();
      this.childsubcategoria.formularioNormal();
      $("#mymodalformsubcategoria").modal("hide");
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}