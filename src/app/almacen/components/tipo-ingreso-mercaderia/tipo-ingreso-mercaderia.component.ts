import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { TipoIngresoMercaderiaService } from '../../services/tipo-ingreso-mercaderia.service';
import { TipoIngresoMercaderiaFormComponent } from './tipo-ingreso-mercaderia-form/tipo-ingreso-mercaderia-form.component';
import { SwalService } from 'src/app/shared/services/swal.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-tipo-ingreso-mercaderia',
  templateUrl: './tipo-ingreso-mercaderia.component.html',
  styleUrls: ['./tipo-ingreso-mercaderia.component.css']
})
export class TipoIngresoMercaderiaComponent implements OnInit {
  @ViewChild(TipoIngresoMercaderiaFormComponent) childtipoingresomercaderia!: TipoIngresoMercaderiaFormComponent;
  datos : any;
  filterpost = "";

  cod_tipo_ingreso_mercaderia : string = "";
  tipo_ingreso_mercaderia : string = "";
  loadinglistado : boolean = false;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private tipoingresomercaderiaservice: TipoIngresoMercaderiaService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService, private router : Router) {
  }

  ngOnInit(): void {
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  async clickEliminar(cod_tipo_ingreso_mercaderia: string, tipo_ingreso_mercaderia: string)
  {
    this.cod_tipo_ingreso_mercaderia = cod_tipo_ingreso_mercaderia;
    this.tipo_ingreso_mercaderia = tipo_ingreso_mercaderia;
    
    const ok = await this.swalservice.alertConfirmRequerido({
          title: "ELIMINAR REGISTRO "  + this.tipo_ingreso_mercaderia,
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
    this.childtipoingresomercaderia.formularioNormal();
  }

  editar(item : any)
  {
      this.childtipoingresomercaderia.nombreformulario = "EDITAR";
      this.childtipoingresomercaderia.editar(item);
      $("#mymodalformtipoingresomercaderia").modal("show");
  }

  async eliminar()
  {
    this.swalservice.iniciarLoading("Eliminando...");
    try
    {
        const parametros = {
          'cod_tipo_ingreso_mercaderia' : this.cod_tipo_ingreso_mercaderia,
          'estado' : 0,
        };

        let data: any = await lastValueFrom(this.tipoingresomercaderiaservice.eliminar(parametros));
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
    this.cod_tipo_ingreso_mercaderia=""
    this.tipo_ingreso_mercaderia="";
    this.filterpost="";

    try
    {
      this.loadinglistado = true;
      await this.listarTipoIngresoMercaderias();
      this.childtipoingresomercaderia.formularioNormal();
    } catch (err: any) {
        this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
        this.loadinglistado = false;
    }

  }
  
  async listarTipoIngresoMercaderias()
  {
    this.page = 1;
    this.filterpost = "";
    let data: any = await lastValueFrom(this.tipoingresomercaderiaservice.listarTipoIngresoMercaderias());
    this.datos = data;  
  }

  clickNuevaTipoIngresoMercaderia()
  {
    this.childtipoingresomercaderia.nombreformulario = "NUEVA";
    this.childtipoingresomercaderia.formularioNormal();
    $("#mymodalformtipoingresomercaderia").modal("show");
  }

  recibirDatosTipoIngresoMercaderia(): void
  {
      this.formularioNormal();
      this.childtipoingresomercaderia.formularioNormal();
      $("#mymodalformtipoingresomercaderia").modal("hide");
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}