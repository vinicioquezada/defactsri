import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { MarcaService } from 'src/app/almacen/services/marca.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-marca-form',
  templateUrl: './marca-form.component.html',
  styleUrls: ['./marca-form.component.css']
})
export class MarcaFormComponent implements OnInit {
   @Output() datosenvio: EventEmitter<any> = new EventEmitter<any>();
  nombreformulario: string = "";
  cod_marca : string = "";
  marca : string = "";
  observacion : string = "";

  flagocultarboton : boolean = false;
  flagmarca : boolean = false;

  ban : number = 0;
  codigotemporal : string = "";
  
  constructor(private marcaservice: MarcaService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService) { }

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
        if(this.marca==this.codigotemporal)
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

    this.flagmarca = false;

    if(this.marca.length==0)
    {
      this.flagmarca=true;
      valor=true;
    }

    return valor;
  }

  flagNormal()
  {
    this.flagmarca = false;
  }

  async buscar()
  {
      let data: any = await lastValueFrom(this.marcaservice.buscar(this.marca));

      if (data.cod_marca == false)//No existe
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
          const ok = await this.swalservice.alertAviso("Marca ya se encuentra registrado");
      }
  }


  async guardar()
  {
      const parametros = {
        'cod_marca' : this.cod_marca,
        'marca' :this.marca,
        'observacion' : this.observacion
      };

      let data: any = await lastValueFrom(this.marcaservice.guardar(parametros));

      if (data.estado == true)
      {
        const parametrosenviar = {
          'cod_marca' : this.cod_marca,
          'marca' : this.marca,
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
        'cod_marca' : this.cod_marca,
        'marca' :this.marca,
        'observacion' : this.observacion
      };

      let data: any = await lastValueFrom(this.marcaservice.actualizar(parametros));

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
      this.cod_marca = item.cod_marca;
      this.marca = item.marca;
      this.observacion = item.observacion;

      this.flagNormal();
      this.flagocultarboton = true;
      this.codigotemporal=this.marca;
      this.ban=1;
  }

  formularioNormal()
  {
    this.cod_marca=moment().unix().toString();
    this.marca="";
    this.observacion="";
    this.swalservice.close();
    this.flagocultarboton = false;
    this.flagNormal();
    this.codigotemporal="";
    this.ban=0;
  }

}