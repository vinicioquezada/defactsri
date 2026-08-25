import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { TipoSalidaMercaderiaService } from '../../services/tipo-salida-mercaderia.service';
import { TipoSalidaMercaderiaFormComponent } from './tipo-salida-mercaderia-form/tipo-salida-mercaderia-form.component';
import { SwalService } from 'src/app/shared/services/swal.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-tipo-salida-mercaderia',
  templateUrl: './tipo-salida-mercaderia.component.html',
  styleUrls: ['./tipo-salida-mercaderia.component.css']
})
export class TipoSalidaMercaderiaComponent implements OnInit {
  @ViewChild(TipoSalidaMercaderiaFormComponent) childtiposalidamercaderia!: TipoSalidaMercaderiaFormComponent;
  datos : any;
  filterpost = "";

  cod_tipo_salida_mercaderia : string = "";
  tipo_salida_mercaderia : string = "";
  loadinglistado : boolean = false;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private tiposalidamercaderiaservice: TipoSalidaMercaderiaService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService, private router : Router) {
  }

  ngOnInit(): void {
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  async clickEliminar(cod_tipo_salida_mercaderia: string, tipo_salida_mercaderia: string)
  {
    this.cod_tipo_salida_mercaderia = cod_tipo_salida_mercaderia;
    this.tipo_salida_mercaderia = tipo_salida_mercaderia;
    
    const ok = await this.swalservice.alertConfirmRequerido({
          title: "ELIMINAR REGISTRO "  + this.tipo_salida_mercaderia,
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
    this.childtiposalidamercaderia.formularioNormal();
  }

  editar(item : any)
  {
      this.childtiposalidamercaderia.nombreformulario = "EDITAR";
      this.childtiposalidamercaderia.editar(item);
      $("#mymodalformtiposalidamercaderia").modal("show");
  }

  async eliminar()
  {
    this.swalservice.iniciarLoading("Eliminando...");
    try
    {
        const parametros = {
          'cod_tipo_salida_mercaderia' : this.cod_tipo_salida_mercaderia,
          'estado' : 0,
        };

        let data: any = await lastValueFrom(this.tiposalidamercaderiaservice.eliminar(parametros));
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
    this.cod_tipo_salida_mercaderia=""
    this.tipo_salida_mercaderia="";
    this.filterpost="";


    try
    {
      this.loadinglistado = true;
      await this.listarTipoSalidaMercaderias();
      this.childtiposalidamercaderia.formularioNormal();
    } catch (err: any) {
        this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
        this.loadinglistado = false;
    }
  }
  
  async listarTipoSalidaMercaderias()
  {
    this.page = 1;
    this.filterpost = "";
    let data: any = await lastValueFrom(this.tiposalidamercaderiaservice.listarTipoSalidaMercaderias());
    this.datos = data;  
  }

  clickNuevaTipoSalidaMercaderia()
  {
    this.childtiposalidamercaderia.nombreformulario = "NUEVA";
    this.childtiposalidamercaderia.formularioNormal();
    $("#mymodalformtiposalidamercaderia").modal("show");
  }

  recibirDatosTipoSalidaMercaderia(): void
  {
      this.formularioNormal();
      this.childtiposalidamercaderia.formularioNormal();
      $("#mymodalformtiposalidamercaderia").modal("hide");
  }

  handlePageChange(event: number): void {
    this.page = event;
  }
}