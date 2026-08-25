import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { MarcaService } from '../../services/marca.service';
import { MarcaFormComponent } from './marca-form/marca-form.component';
import { SwalService } from 'src/app/shared/services/swal.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-marca',
  templateUrl: './marca.component.html',
  styleUrls: ['./marca.component.css']
})
export class MarcaComponent implements OnInit {
  @ViewChild(MarcaFormComponent) childmarca!: MarcaFormComponent;
  datos : any;
  filterpost = "";

  cod_marca : string = "";
  marca : string = "";

  loadinglistado : boolean = false;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private marcaservice: MarcaService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService, private router : Router) {
  }

  ngOnInit(): void {
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  async clickEliminar(cod_marca: string, marca: string)
  {
    this.cod_marca = cod_marca;
    this.marca = marca;
    
    const ok = await this.swalservice.alertConfirmRequerido({
          title: "ELIMINAR REGISTRO "  + this.marca,
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
    this.childmarca.formularioNormal();
  }

  editar(item : any)
  {
      this.childmarca.nombreformulario = "EDITAR";
      this.childmarca.editar(item);
      $("#mymodalformmarca").modal("show");
  }

  async eliminar()
  {
    this.swalservice.iniciarLoading("Eliminando...");
    try
    {
        const parametros = {
          'cod_marca' : this.cod_marca,
          'estado' : 0,
        };

        let data: any = await lastValueFrom(this.marcaservice.eliminar(parametros));
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
    this.cod_marca=""
    this.marca="";
    this.filterpost="";
    

    try
    {
      this.loadinglistado = true;
      await this.listarMarcas();
      this.childmarca.formularioNormal();
    } catch (err: any) {
        this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
        this.loadinglistado = false;
    }

  }
  
  async listarMarcas()
  {
    this.page = 1;
    this.filterpost = "";
    let data: any = await lastValueFrom(this.marcaservice.listarMarcas());
    this.datos = data;  
  }

  clickNuevaMarca()
  {
    this.childmarca.nombreformulario = "NUEVA";
    this.childmarca.formularioNormal();
    $("#mymodalformmarca").modal("show");
  }

  recibirDatosMarca(): void
  {
      this.formularioNormal();
      this.childmarca.formularioNormal();
      $("#mymodalformmarca").modal("hide");
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}