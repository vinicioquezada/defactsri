import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { CategoriaGastosService } from '../../services/categoria-gastos.service';
import { CategoriaGastosFormComponent } from './categoria-gastos-form/categoria-gastos-form.component';
import { SwalService } from 'src/app/shared/services/swal.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-categoria-gastos',
  templateUrl: './categoria-gastos.component.html',
  styleUrls: ['./categoria-gastos.component.css']
})
export class CategoriaGastosComponent implements OnInit {
  @ViewChild(CategoriaGastosFormComponent) childcategoriagastos!: CategoriaGastosFormComponent;
  datos : any;
  filterpost = "";

  cod_categoria_gastos : string = "";
  categoria_gastos : string = "";
  loadinglistado : boolean = false;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private categoriagastosservice: CategoriaGastosService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService, private router : Router) {
  }

  ngOnInit(): void {
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  async clickEliminar(cod_categoria_gastos: string, categoria_gastos: string)
  {
    this.cod_categoria_gastos = cod_categoria_gastos;
    this.categoria_gastos = categoria_gastos;
    
    const ok = await this.swalservice.alertConfirmRequerido({
          title: "ELIMINAR REGISTRO "  + this.categoria_gastos,
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
    this.childcategoriagastos.formularioNormal();
  }

  editar(item : any)
  {
      this.childcategoriagastos.nombreformulario = "EDITAR";
      this.childcategoriagastos.editar(item);
      $("#mymodalformcategoriagastos").modal("show");
  }

  async eliminar()
  {
    this.swalservice.iniciarLoading("Eliminando...");
    try
    {
        const parametros = {
          'cod_categoria_gastos' : this.cod_categoria_gastos,
          'estado' : 0,
        };

        let data: any = await lastValueFrom(this.categoriagastosservice.eliminar(parametros));
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
    this.cod_categoria_gastos=""
    this.categoria_gastos="";
    this.filterpost="";


    try
    {
      this.loadinglistado = true;
      await this.listarCategoriaGastos()
      this.childcategoriagastos.formularioNormal();
    } catch (err: any) {
        this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
        this.loadinglistado = false;
    }
  }
  
  async listarCategoriaGastos()
  {
    this.page = 1;
    this.filterpost = "";
    let data: any = await lastValueFrom(this.categoriagastosservice.listarCategoriaGastos());
    this.datos = data;
  }

  clickNuevaCategoriaGastos()
  {
    this.childcategoriagastos.nombreformulario = "NUEVA";
    this.childcategoriagastos.formularioNormal();
    $("#mymodalformcategoriagastos").modal("show");
  }

  recibirDatosCategoriaGastos(): void
  {
      this.formularioNormal();
      this.childcategoriagastos.formularioNormal();
      $("#mymodalformcategoriagastos").modal("hide");
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}