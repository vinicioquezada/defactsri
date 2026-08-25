import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import { CuponService } from '../../services/cupon.service';
import { CuponFormComponent } from './cupon-form/cupon-form.component';
import { SwalService } from 'src/app/shared/services/swal.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-cupon',
  templateUrl: './cupon.component.html',
  styleUrls: ['./cupon.component.css']
})
export class CuponComponent implements OnInit {
  @ViewChild(CuponFormComponent) childcupon!: CuponFormComponent;
  datos : any;
  filterpost = "";

  cod_cupon : string = "";
  cupon : string = "";

  cod_sucursal: string = "";

  chkcupon: boolean = false;
  loadinglistado : boolean = false;

  page = 1;
  count = 0;
  pagesize = 5;

  constructor(private cuponservice: CuponService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService, private usersession: UserSessionService) {
  }

  ngOnInit(): void {
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  async clickEliminar(cod_cupon: string, cupon: string)
  {
    this.cod_cupon = cod_cupon;
    this.cupon = cupon;
    
    const ok = await this.swalservice.alertConfirmRequerido({
          title: "ELIMINAR REGISTRO "  + this.cupon,
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
    this.childcupon.formularioNormal();
  }

  editar(item : any)
  {
      this.childcupon.nombreformulario = "EDITAR";
      this.childcupon.editar(item);
      $("#mymodalformcupon").modal("show");
  }

  async eliminar()
  {
    this.swalservice.iniciarLoading("Eliminando...");
    try
    {
        const parametros = {
          'cod_cupon' : this.cod_cupon,
          'estado' : 0,
        };

        let data: any = await lastValueFrom(this.cuponservice.eliminar(parametros));
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
    this.cod_cupon=""
    this.cupon="";
    this.filterpost="";

    try
    {
      this.loadinglistado = true;
      await this.buscarActivarCupon();
      await this.listarCupones();
      this.childcupon.formularioNormal();
    } catch (err: any) {
        this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
        this.loadinglistado = false;
    }
  }
  
  async listarCupones()
  {
    this.page = 1;
    this.filterpost = "";
    let data: any = await lastValueFrom(this.cuponservice.listarCupones());
    this.datos = data;
  }

  async buscarActivarCupon()
  {
    let data: any = await lastValueFrom(this.cuponservice.buscarActivarCupon(this.cod_sucursal));
    this.chkcupon = data.cupon;
  }

  changeChkActiviarCupon()
  {
    if(this.chkcupon==true){
      this.activarCupon(false);
    }else{
      this.activarCupon(true);
    }
  }

  

  clickNuevaCupon()
  {
    this.childcupon.nombreformulario = "NUEVA";
    this.childcupon.formularioNormal();
    $("#mymodalformcupon").modal("show");
  }

  recibirDatosCupon(): void
  {
      this.formularioNormal();
      this.childcupon.formularioNormal();
      $("#mymodalformcupon").modal("hide");
  }

  handlePageChange(event: number): void {
    this.page = event;
  }

  async fijarCupon(cod_cupon: number)
  {
    this.swalservice.iniciarLoading("Fijando Cupon...");
    try
    {
        const parametros = {
          'cod_cupon' : cod_cupon
        };

        let data: any = await lastValueFrom(this.cuponservice.fijarCupon(parametros));
        this.swalservice.close();
        if (data.estado == true)
        {
          this.toastr.success("Cupón fijado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
          await this.formularioNormal();
        }
        else
        {
          const ok = await this.swalservice.alertError("Cupon no se pudo fijar, vuelva a intertarlo por favor");
        }
    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
      this.swalservice.close();
    }
  }

  async activarCupon(estado: boolean)
  {
    this.swalservice.iniciarLoading("Activando Cupon en Sucursal...");
    try
    {
        const parametros = {
          "cod_sucursal" : this.cod_sucursal,
          "estado" : estado
        };

        let data: any = await lastValueFrom(this.cuponservice.activarCupon(parametros));
        this.chkcupon = estado;
        
    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
      this.swalservice.close();
    }
  }
}
