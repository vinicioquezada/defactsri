import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { CategoriaIngresosService } from '../../services/categoria-ingresos.service';
import { CategoriaIngresosFormComponent } from './categoria-ingresos-form/categoria-ingresos-form.component';
import { SwalService } from 'src/app/shared/services/swal.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-categoria-ingresos',
  templateUrl: './categoria-ingresos.component.html',
  styleUrls: ['./categoria-ingresos.component.css']
})
export class CategoriaIngresosComponent implements OnInit {
  @ViewChild(CategoriaIngresosFormComponent) childcategoriaingresos!: CategoriaIngresosFormComponent;
  datos : any;
  filterpost = "";

  cod_categoria_ingresos : string = "";
  categoria_ingresos : string = "";
  loadinglistado : boolean = false;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private categoriaingresossservice: CategoriaIngresosService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService, private router : Router) {
  }

  ngOnInit(): void {
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  async clickEliminar(cod_categoria_ingresos: string, categoria_ingresos: string)
  {
    this.cod_categoria_ingresos = cod_categoria_ingresos;
    this.categoria_ingresos = categoria_ingresos;
    
    const ok = await this.swalservice.alertConfirmRequerido({
          title: "ELIMINAR REGISTRO "  + this.categoria_ingresos,
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
    this.childcategoriaingresos.formularioNormal();
  }

  editar(item : any)
  {
      this.childcategoriaingresos.nombreformulario = "EDITAR";
      this.childcategoriaingresos.editar(item);
      $("#mymodalformcategoriaingresos").modal("show");
  }

  async eliminar()
  {
    this.swalservice.iniciarLoading("Eliminando...");
    try
    {
        const parametros = {
          'cod_categoria_ingresos' : this.cod_categoria_ingresos,
          'estado' : 0,
        };

        let data: any = await lastValueFrom(this.categoriaingresossservice.eliminar(parametros));
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
    this.cod_categoria_ingresos=""
    this.categoria_ingresos="";
    this.filterpost="";


    try
    {
      this.loadinglistado = true;
      await this.listarCategoriaIngresos()
      this.childcategoriaingresos.formularioNormal();
    } catch (err: any) {
        this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
        this.loadinglistado = false;
    }
  }
  
  async listarCategoriaIngresos()
  {
    this.page = 1;
    this.filterpost = "";
    let data: any = await lastValueFrom(this.categoriaingresossservice.listarCategoriaIngresos());
    this.datos = data;
  }

  clickNuevaCategoriaIngresos()
  {
    this.childcategoriaingresos.nombreformulario = "NUEVA";
    this.childcategoriaingresos.formularioNormal();
    $("#mymodalformcategoriaingresos").modal("show");
  }

  recibirDatosCategoriaIngresos(): void
  {
      this.formularioNormal();
      this.childcategoriaingresos.formularioNormal();
      $("#mymodalformcategoriaingresos").modal("hide");
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}