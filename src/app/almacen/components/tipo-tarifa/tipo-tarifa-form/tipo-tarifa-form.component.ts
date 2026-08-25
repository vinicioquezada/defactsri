import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { TipoTarifaService } from 'src/app/almacen/services/tipo-tarifa.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-tipo-tarifa-form',
  templateUrl: './tipo-tarifa-form.component.html',
  styleUrls: ['./tipo-tarifa-form.component.css']
})
export class TipoTarifaFormComponent implements OnInit {
  @Output() datosenvio: EventEmitter<any> = new EventEmitter<any>();
  nombreformulario: string = "";
  cod_tipo_tarifa : string = "";
  tipo_tarifa : string = "";
  observacion : string = "";

  flagocultarboton : boolean = false;
  flagtipotarifa : boolean = false;

  ban : number = 0;
  codigotemporal : string = "";
  
  constructor(private tipotarifasservice: TipoTarifaService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService) { }

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
        if(this.tipo_tarifa==this.codigotemporal)
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

    this.flagtipotarifa = false;

    if(this.tipo_tarifa.length==0)
    {
      this.flagtipotarifa=true;
      valor=true;
    }

    return valor;
  }

  flagNormal()
  {
    this.flagtipotarifa = false;
  }

  async buscar()
  {
      let data: any = await lastValueFrom(this.tipotarifasservice.buscar(this.tipo_tarifa));

      if (data.cod_tipo_tarifa == false)//No existe
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
          const ok = await this.swalservice.alertAviso("Tipo tarifa ya se encuentra registrado");
      }
  }


  async guardar()
  {
      const parametros = {
        'cod_tipo_tarifa' : this.cod_tipo_tarifa,
        'tipo_tarifa' :this.tipo_tarifa,
        'observacion' : this.observacion
      };

      let data: any = await lastValueFrom(this.tipotarifasservice.guardar(parametros));

      if (data.estado == true)
      {
        const parametrosenviar = {
          'cod_tipo_tarifa' : this.cod_tipo_tarifa,
          'tipo_tarifa' : this.tipo_tarifa,
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
        'cod_tipo_tarifa' : this.cod_tipo_tarifa,
        'tipo_tarifa' :this.tipo_tarifa,
        'observacion' : this.observacion
      };

      let data: any = await lastValueFrom(this.tipotarifasservice.actualizar(parametros));

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
      this.cod_tipo_tarifa = item.cod_tipo_tarifa;
      this.tipo_tarifa = item.tipo_tarifa;
      this.observacion = item.observacion;

      this.flagNormal();
      this.flagocultarboton = true;
      this.codigotemporal=this.tipo_tarifa;
      this.ban=1;
  }

  formularioNormal()
  {
    this.cod_tipo_tarifa=moment().unix().toString();
    this.tipo_tarifa="";
    this.observacion="";
    this.swalservice.close();
    this.flagocultarboton = false;
    this.flagNormal();
    this.codigotemporal="";
    this.ban=0;
  }

}