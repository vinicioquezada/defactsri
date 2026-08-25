import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { TipoClienteService } from 'src/app/venta/services/tipo-cliente.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-tipo-cliente-form',
  templateUrl: './tipo-cliente-form.component.html',
  styleUrls: ['./tipo-cliente-form.component.css']
})
export class TipoClienteFormComponent implements OnInit {
  @Output() datosenvio: EventEmitter<any> = new EventEmitter<any>();
  nombreformulario: string = "";
  cod_tipo_cliente : string = "";
  tipo_cliente : string = "";
  observacion : string = "";

  flagocultarboton : boolean = false;
  flagtipocliente : boolean = false;

  ban : number = 0;
  codigotemporal : string = "";
  
  constructor(private tipoclientesservice: TipoClienteService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService) { }

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
        if(this.tipo_cliente==this.codigotemporal)
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

    this.flagtipocliente = false;

    if(this.tipo_cliente.length==0)
    {
      this.flagtipocliente=true;
      valor=true;
    }

    return valor;
  }

  flagNormal()
  {
    this.flagtipocliente = false;
  }

  async buscar()
  {
      let data: any = await lastValueFrom(this.tipoclientesservice.buscar(this.tipo_cliente));

      if (data.cod_tipo_cliente == false)//No existe
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
          const ok = await this.swalservice.alertAviso("Tipo cliente ya se encuentra registrado");
      }
  }


  async guardar()
  {
      const parametros = {
        'cod_tipo_cliente' : this.cod_tipo_cliente,
        'tipo_cliente' :this.tipo_cliente,
        'observacion' : this.observacion
      };

      let data: any = await lastValueFrom(this.tipoclientesservice.guardar(parametros));

      if (data.estado == true)
      {
        const parametrosenviar = {
          'cod_tipo_cliente' : this.cod_tipo_cliente,
          'tipo_cliente' : this.tipo_cliente,
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
        'cod_tipo_cliente' : this.cod_tipo_cliente,
        'tipo_cliente' :this.tipo_cliente,
        'observacion' : this.observacion
      };

      let data: any = await lastValueFrom(this.tipoclientesservice.actualizar(parametros));

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
      this.cod_tipo_cliente = item.cod_tipo_cliente;
      this.tipo_cliente = item.tipo_cliente;
      this.observacion = item.observacion;

      this.flagNormal();
      this.flagocultarboton = true;
      this.codigotemporal=this.tipo_cliente;
      this.ban=1;
  }

  formularioNormal()
  {
    this.cod_tipo_cliente=moment().unix().toString();
    this.tipo_cliente="";
    this.observacion="";
    this.swalservice.close();
    this.flagocultarboton = false;
    this.flagNormal();
    this.codigotemporal="";
    this.ban=0;
  }

}