import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { CategoriaService } from '../../services/categoria.service';
import { CategoriaFormComponent } from './categoria-form/categoria-form.component';
import { SwalService } from 'src/app/shared/services/swal.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  @ViewChild(CategoriaFormComponent) childcategoria!: CategoriaFormComponent;
  datos : any;
  filterpost = "";

  cod_categoria : string = "";
  categoria : string = "";

  loadinglistado : boolean = false;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private categoriaservice: CategoriaService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService, private router : Router) {
  }

  ngOnInit(): void {
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  async clickEliminar(cod_categoria: string, categoria: string)
  {
    this.cod_categoria = cod_categoria;
    this.categoria = categoria;
    
    const ok = await this.swalservice.alertConfirmRequerido({
          title: "ELIMINAR REGISTRO "  + this.categoria,
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
    this.childcategoria.formularioNormal();
  }

  editar(item : any)
  {
      this.childcategoria.nombreformulario = "EDITAR";
      this.childcategoria.editar(item);
      $("#mymodalformcategoria").modal("show");
  }

  async eliminar()
  {
    this.swalservice.iniciarLoading("Eliminando...");
    try
    {
        const parametros = {
          'cod_categoria' : this.cod_categoria,
          'estado' : 0,
        };

        let data: any = await lastValueFrom(this.categoriaservice.eliminar(parametros));
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
    this.cod_categoria=""
    this.categoria="";
    this.filterpost="";

    try
    {
      this.loadinglistado = true;
      await this.listarCategorias();
      this.childcategoria.formularioNormal();
    } catch (err: any) {
        this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
        this.loadinglistado = false;
    }
  }
  
  async listarCategorias()
  {
    this.page = 1;
    this.filterpost = "";
    let data: any = await lastValueFrom(this.categoriaservice.listarCategorias());
    this.datos = data;
  }

  

  clickNuevaCategoria()
  {
    this.childcategoria.nombreformulario = "NUEVA";
    this.childcategoria.formularioNormal();
    $("#mymodalformcategoria").modal("show");
  }

  recibirDatosCategoria(): void
  {
      this.formularioNormal();
      this.childcategoria.formularioNormal();
      $("#mymodalformcategoria").modal("hide");
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}