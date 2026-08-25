import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DenominacionService } from 'src/app/almacen/services/denominacion.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-denominacion-form',
  templateUrl: './denominacion-form.component.html',
  styleUrls: ['./denominacion-form.component.css']
})
export class DenominacionFormComponent implements OnInit {
  @Output() datosenvio: EventEmitter<any> = new EventEmitter<any>();
  nombreformulario: string = "";
  cod_denominacion : string = "";
  denominacion : string = "";
  observacion : string = "";

  flagocultarboton : boolean = false;
  flagdenominacion : boolean = false;

  ban : number = 0;
  codigotemporal : string = "";
  
  constructor(private denominacionservice: DenominacionService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService) { }

  ngOnInit(): void {
    this.formularioNormal();
  }

  async clickGuardar()
  {
    let valor : Boolean = this.verificarCampos();
    if(valor)
    {
      const ok = await this.swalservice.alertAviso("Algunos campos no estan llenos, son obligatorios");
    }
    else
    {
      this.swalservice.iniciarLoading("Almacenando...");
      try
      {
        await this.buscar();
      } catch (err: any) {
        const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
      } finally {
        this.swalservice.close();
      }
    }
  }
  
  async clickActualizar()
  {
    let valor : Boolean = this.verificarCampos();
    if(valor)
    {
      const ok = await this.swalservice.alertAviso("Algunos campos no estan llenos, son obligatorios");
    }
    else
    {
      this.swalservice.iniciarLoading("Actualizando...");
      try {
        if(this.denominacion==this.codigotemporal)
        {
          await this.actualizar();
        }
        else
        {
          await this.buscar();
        }
      } catch (err: any) {
        const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
      } finally {
        this.swalservice.close();
      }
    }
  }

  verificarCampos()
  {
    let valor : Boolean = false;

    this.flagdenominacion = false;

    if(this.denominacion.length==0)
    {
      this.flagdenominacion=true;
      valor=true;
    }

    return valor;
  }

  flagNormal()
  {
    this.flagdenominacion = false;
  }

  async buscar()
  {
      let data: any = await lastValueFrom(this.denominacionservice.buscar(this.denominacion));

      if (data.cod_denominacion == false)//No existe
      {
          if (this.ban == 0)
          {
            await this.guardar();
          }
          else
          {
            await this.actualizar();         
          }
      }
      else
      {
          const ok = await this.swalservice.alertAviso("Denominación ya se encuentra registrado");
      }
  }


  async guardar()
  {
      const parametros = {
        'cod_denominacion' : this.cod_denominacion,
        'denominacion' :this.denominacion,
        'observacion' : this.observacion
      };

      let data: any = await lastValueFrom(this.denominacionservice.guardar(parametros));

      if (data.estado == true)
      {
        const parametrosenviar = {
          'cod_denominacion' : this.cod_denominacion,
          'denominacion' : this.denominacion,
          'observacion' : this.observacion,
          'estado' : 1
        };
        this.datosenvio.emit(parametrosenviar);
        this.toastr.success("Registro Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        const ok = await this.swalservice.alertError("Registro no se pudo Almacenar, vuelva a intertarlo por favor");
      }
  }
  

  async actualizar()
  {
      const parametros = {
        'cod_denominacion' : this.cod_denominacion,
        'denominacion' :this.denominacion,
        'observacion' : this.observacion
      };

      let data: any = await lastValueFrom(this.denominacionservice.actualizar(parametros));

      if (data.estado == true)
      {
        this.datosenvio.emit();
        this.toastr.success("Registro Actualizado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        const ok = await this.swalservice.alertError("Registro no se pudo Actualizar, vuelva a intertarlo por favor");
      }
  }

  editar(item :any)
  {      
      this.cod_denominacion = item.cod_denominacion;
      this.denominacion = item.denominacion;
      this.observacion = item.observacion;

      this.flagNormal();
      this.flagocultarboton = true;
      this.codigotemporal=this.denominacion;
      this.ban=1;
  }

  formularioNormal()
  {
    this.cod_denominacion=moment().unix().toString();
    this.denominacion="";
    this.observacion="";
    this.swalservice.close();
    this.flagocultarboton = false;
    this.flagNormal();
    this.codigotemporal="";
    this.ban=0;
  }

}