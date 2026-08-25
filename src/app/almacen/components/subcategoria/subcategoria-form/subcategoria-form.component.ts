import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { SubcategoriaService } from 'src/app/almacen/services/subcategoria.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { lastValueFrom } from 'rxjs';
import { CategoriaFormComponent } from '../../categoria/categoria-form/categoria-form.component';
import { CategoriaService } from 'src/app/almacen/services/categoria.service';
declare var $:any;

@Component({
  selector: 'app-subcategoria-form',
  templateUrl: './subcategoria-form.component.html',
  styleUrls: ['./subcategoria-form.component.css']
})
export class SubcategoriaFormComponent implements OnInit {
  @Output() datosenvio: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(CategoriaFormComponent) categoriaformcomponent!: CategoriaFormComponent;
  
  datoscategoria : any;
  nombreformulario: string = "";

  cod_categoria : string = "";
  categoria : string = "";

  cod_subcategoria : string = "";
  subcategoria : string = "";
  observacion : string = "";

  flagocultarboton : boolean = false;
  flagcategoria : boolean = false;
  flagsubcategoria : boolean = false;

  ban : number = 0;
  codigotemporal : string = "";
  
  constructor(private subcategoriaservice: SubcategoriaService, private toastr: ToastrService, private error:ErrorService, private swalservice: SwalService, private categoriaservice:CategoriaService) { }

  ngOnInit(): void {
    this.formularioNormal();
    this.cargarListas();
  }

  onchangecategoria(event: any): void {
    const elemento = event.target.value;
    this.cod_categoria = elemento;
    const resultado = this.datoscategoria.find( (valor : any) => valor.cod_categoria == this.cod_categoria );
    this.categoria = resultado.categoria;
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
        if(this.subcategoria==this.codigotemporal)
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

    this.flagsubcategoria = false;

    if(this.cod_categoria=="0")
    {
      this.flagcategoria=true;
      valor=true;
    }

    if(this.subcategoria.length==0)
    {
      this.flagsubcategoria=true;
      valor=true;
    }

    return valor;
  }

  flagNormal()
  {
    this.flagcategoria = false;
    this.flagsubcategoria = false;
  }

  async buscar()
  {
      let data: any = await lastValueFrom(this.subcategoriaservice.buscar(this.cod_categoria, this.subcategoria));

      if (data.cod_subcategoria == false)//No existe
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
          const ok = await this.swalservice.alertAviso("Subcategoría ya se encuentra registrado con la misma categoria");
      }
  }


  async guardar()
  {
      const parametros = {
      'cod_subcategoria' : this.cod_subcategoria,
      'cod_categoria' : this.cod_categoria,
      'subcategoria' :this.subcategoria,
      'observacion' : this.observacion
    };

      let data: any = await lastValueFrom(this.subcategoriaservice.guardar(parametros));

      if (data.estado == true)
      {
        const parametrosenviar = {
          'cod_subcategoria' : this.cod_subcategoria,
          'cod_categoria' : this.cod_categoria,
          'subcategoria' :this.subcategoria,
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
      'cod_subcategoria' : this.cod_subcategoria,
      'cod_categoria' : this.cod_categoria,
      'subcategoria' :this.subcategoria,
      'observacion' : this.observacion
    };

      let data: any = await lastValueFrom(this.subcategoriaservice.actualizar(parametros));

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
      this.cod_subcategoria = item.cod_subcategoria;
      this.cod_categoria = item.cod_categoria;
      this.subcategoria = item.subcategoria;
      this.observacion = item.observacion;

      this.flagNormal();
      this.flagocultarboton = true;
      this.codigotemporal=this.subcategoria;
      this.ban=1;
  }

  formularioNormal()
  {
    this.cod_subcategoria=moment().unix().toString();
    this.subcategoria="";
    this.cod_categoria = "0";
    this.categoria = "";
    this.observacion="";
    this.swalservice.close();
    this.flagocultarboton = false;
    this.flagNormal();
    this.codigotemporal="";
    this.ban=0;
  }

  cargarListas()
  {
    this.listarCategorias();
  }

  recibirDatosCategoria(datosrecibidoscategoria: any)
  {
    this.datoscategoria.push(datosrecibidoscategoria);
    this.cod_categoria = datosrecibidoscategoria.cod_categoria;
    this.categoria = datosrecibidoscategoria.categoria;
    $("#mymodalformcategoria").modal("hide");
  }

  clickCategoria()
  {
    this.categoriaformcomponent.formularioNormal();
    $("#mymodalformcategoria").modal("show");
  }

  async listarCategorias()
  {
    this.swalservice.iniciarLoading("Cargando...");
    try {
        let data: any = await lastValueFrom(this.categoriaservice.listarCategorias());
        this.datoscategoria = data;
      } catch (err: any) {
        const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
      } finally {
        this.swalservice.close();
      }
  }

}