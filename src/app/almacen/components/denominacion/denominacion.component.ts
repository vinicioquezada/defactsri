import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { DenominacionService } from '../../services/denominacion.service';
import { DenominacionFormComponent } from './denominacion-form/denominacion-form.component';
import { SwalService } from 'src/app/shared/services/swal.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-denominacion',
  templateUrl: './denominacion.component.html',
  styleUrls: ['./denominacion.component.css']
})
export class DenominacionComponent implements OnInit {
  @ViewChild(DenominacionFormComponent) childdenominacion!: DenominacionFormComponent;
  datos : any;
  filterpost = "";

  cod_denominacion : string = "";
  denominacion : string = "";

  loadinglistado : boolean = false;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private denominacionservice: DenominacionService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService, private router : Router) {
  }

  ngOnInit(): void {
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  async clickEliminar(cod_denominacion: string, denominacion: string)
  {
    this.cod_denominacion = cod_denominacion;
    this.denominacion = denominacion;
    
    const ok = await this.swalservice.alertConfirmRequerido({
          title: "ELIMINAR REGISTRO "  + this.denominacion,
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
    this.childdenominacion.formularioNormal();
  }

  editar(item : any)
  {
      this.childdenominacion.nombreformulario = "EDITAR";
      this.childdenominacion.editar(item);
      $("#mymodalformdenominacion").modal("show");
  }
 
  async eliminar()
  {
    this.swalservice.iniciarLoading("Eliminando...");
    try
    {
        const parametros = {
          'cod_denominacion' : this.cod_denominacion,
          'estado' : 0,
        };

        let data: any = await lastValueFrom(this.denominacionservice.eliminar(parametros));
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
    this.cod_denominacion=""
    this.denominacion="";
    this.filterpost="";
    
    try
    {
      this.loadinglistado = true;
      await this.listarDenominaciones();
      this.childdenominacion.formularioNormal();
    } catch (err: any) {
        this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
        this.loadinglistado = false;
    }
  }
  
  async listarDenominaciones()
  {
    this.page = 1;
    this.filterpost = "";
    let data: any = await lastValueFrom(this.denominacionservice.listarDenominaciones());
    this.datos = data;
  }

  clickNuevaDenominacion()
  {
    this.childdenominacion.nombreformulario = "NUEVA";
    this.childdenominacion.formularioNormal();
    $("#mymodalformdenominacion").modal("show");
  }

  recibirDatosDenominacion(): void
  {
      this.formularioNormal();
      this.childdenominacion.formularioNormal();
      $("#mymodalformdenominacion").modal("hide");
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}