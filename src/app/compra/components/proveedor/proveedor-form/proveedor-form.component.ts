import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ProveedorService } from 'src/app/compra/services/proveedor.service';
import { TipoIdentificacionService } from 'src/app/venta/services/tipo-identificacion.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { SwalService } from 'src/app/shared/services/swal.service';

@Component({
  selector: 'app-proveedor-form',
  templateUrl: './proveedor-form.component.html',
  styleUrls: ['./proveedor-form.component.css']
})
export class ProveedorFormComponent implements OnInit {
  @Output() datosenvio: EventEmitter<any> = new EventEmitter<any>();
  @Output() datosenvioexistente: EventEmitter<any> = new EventEmitter<any>();
  nombreformulario: string = "";
  cantidad_registros : number = 0;

  datosidentificacion : any;
  datostipoproveedor : any;

  cod_proveedor : string = "";
  cod_identificacion : string = "0";
  identificacion: string = "";
  ruc : string = "";
  razon_social : string = "";
  nombre_comercial : string = "";
  convencional : string = "";
  celular : string = "";
  correo : string = "";
  direccion : string = "";
  //cod_tipo_proveedor : string = "0";
  //tipo_proveedor: string = "";

  flagocultarboton : boolean = false;

  flagidentificacion : boolean = false;
  flagruc : boolean = false;
  flagrazonsocial : boolean = false;
  /*
  flagnombrecomercial : boolean = false;
  flagconvencional : boolean = false;
  flagcelular : boolean = false;
  flagcorreo : boolean = false;
  flagdireccion : boolean = false;
  */
  flagtipoproveedor : boolean = false;

  ban : number = 0;
  codigotemporal : string = "";

  loadingform : boolean = false;

  flagocultarbotonagregar : boolean = false;

  constructor(private proveedorservice: ProveedorService, private toastr: ToastrService, private error:ErrorService, private tipoidentificacionservice:TipoIdentificacionService, private swalservice: SwalService) { 
  }

  ngOnInit(): void {
    this.formularioNormal();
    this.cargarListas();
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
        await this.validarRuc();
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
      try
      {
        if(this.ruc==this.codigotemporal)
        {
          await this.actualizar();
        }
        else
        {
          await this.validarRuc();
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

    this.flagNormal();

    if(this.cod_identificacion=="0")
    {
      this.flagidentificacion=true;
      valor=true;
    }

    if(this.ruc.length==0)
    {
      this.flagruc=true;
      valor=true;
    }

    if(this.razon_social.length==0)
    {
      this.flagrazonsocial = true;
      valor=true;
    }

    /*
    if(this.nombre_comercial.length==0)
    {
      this.flagnombrecomercial = true;
      valor=true;
    }

    if(this.convencional.length==0)
    {
      this.flagconvencional = true;
      valor=true;
    }

    if(this.celular.length==0)
    {
      this.flagcelular = true;
      valor=true;
    }

    if(this.correo.length==0)
    {
      this.flagcorreo = true;
      valor=true;
    }

    if(this.direccion.length==0)
    {
      this.flagdireccion = true;
      valor=true;
    }
    */

    /*
    if(this.cod_tipo_proveedor=="0")
    {
      this.flagtipoproveedor=true;
      valor=true;
    }
    */
    return valor;
  }

  flagNormal()
  {
    this.flagidentificacion = false;
    this.flagruc = false;
    this.flagrazonsocial = false;
    /*
    this.flagnombrecomercial = false;
    this.flagconvencional = false;
    this.flagcelular = false;
    this.flagcorreo = false;
    this.flagdireccion = false;
    */
    this.flagtipoproveedor=false;
  }
  
  changeIdentificacion(event: any): void {
    const elemento = event.target.value;
    this.cod_identificacion = elemento;
  }
  /*
  changeTipoProveedor(event: any): void {
    const elemento = event.target.value;
    this.cod_tipo_proveedor = elemento;
  }
  */

  async validarRuc()
  {
    this.flagruc = false;
    
    let data: any = await lastValueFrom(this.proveedorservice.validarRuc(this.cod_identificacion, this.ruc)); 

    if (data.estado == true)
    { 
        await this.buscar();
    }
    else
    {
      this.flagruc = true;
      const ok = await this.swalservice.alertError("Identificación Incorrecta, ingrese una identificación válida por favor");
    } 
  }

  async buscar()
  {
    let data: any = await lastValueFrom(this.proveedorservice.buscar(this.ruc));

    if (data.cod_cod_proveedor == false)//No existe
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
      const ok = await this.swalservice.alertAviso("Proveedor se encuentra registrado, vuelva a intertarlo por favor");    
    }
  }
  
  async guardar()
  {
    const parametros = {
      'cod_proveedor' : this.cod_proveedor,
      'cod_identificacion' : this.cod_identificacion,
      'ruc' : this.ruc,
      'razon_social' : this.razon_social,
      'nombre_comercial' : this.nombre_comercial,
      'convencional' : this.convencional,
      'celular' : this.celular,
      'correo' : this.correo,
      'direccion' : this.direccion
      //'cod_tipo_proveedor' :this.cod_tipo_proveedor
    };

    let data: any = await lastValueFrom(this.proveedorservice.guardar(parametros));


      if (data.estado == true)
      {
        const parametrosenviar = {
          'cod_proveedor' : this.cod_proveedor,
          'cod_identificacion' : this.cod_identificacion,
          'ruc' : this.ruc,
          'razon_social' : this.razon_social,
          'nombre_comercial' : this.nombre_comercial,
          'convencional' : this.convencional,
          'celular' : this.celular,
          'correo' : this.correo,
          'direccion' : this.direccion,
          //'cod_tipo_proveedor' :this.cod_tipo_proveedor,
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
        'cod_proveedor' : this.cod_proveedor,
        'cod_identificacion' : this.cod_identificacion,
        'ruc' : this.ruc,
        'razon_social' : this.razon_social,
        'nombre_comercial' : this.nombre_comercial,
        'convencional' : this.convencional,
        'celular' : this.celular,
        'correo' : this.correo,
        'direccion' : this.direccion
        //'cod_tipo_proveedor' :this.cod_tipo_proveedor
      };

      let data: any = await lastValueFrom(this.proveedorservice.actualizar(parametros));

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
  
  formularioNormal()
  {
    this.cod_proveedor = moment().unix().toString();
    this.cod_identificacion = "0";
    this.identificacion = "";
    this.ruc = "";
    this.razon_social = "";
    this.nombre_comercial = "";
    this.convencional = "";
    this.celular = "";
    this.correo = "";
    this.direccion = "";
    //this.cod_tipo_proveedor = "0";
    //this.tipo_proveedor = "";
    

    this.flagocultarboton = false;

    this.flagNormal();
  
    this.codigotemporal="";
    
    //this.listarTipoProveedores();

    this.ban=0;

    this.flagocultarbotonagregar = false;
  }

  cargarListas()
  {
    this.listarIdentificacion();
  }

  listarIdentificacion()
  {
    this.loadingform = true;
    
    this.tipoidentificacionservice.listar().subscribe( (data : any) =>
    {
      this.loadingform = false;
      this.datosidentificacion = data;
      //console.log("Datos:", this.datosidentificacion);
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingform = false;
    });
    
  }

  /*
  listarTipoProveedores()
  {    
    this.loading = true;
    

    this.tipoproveedorservice.listar().subscribe( (data : any) =>
    {
      this.datostipoproveedor = data;
      this.loading = false;
      
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loading = false;
      
    });
    
  }
  */

  async buscarProveedor()
  {
    try
    {
      this.swalservice.iniciarLoading("Vertificando...");

      let data: any = await lastValueFrom(this.proveedorservice.buscar(this.ruc));

      if (data.cod_proveedor == false)//No existe
      {
        this.toastr.info("Proveedor no se encuentra registrado", "INFORMACIÓN DEL SISTEMA");
        this.cod_proveedor = moment().unix().toString();
        this.razon_social = "";
        this.nombre_comercial = "";
        this.convencional = "";
        this.celular = "";
        this.correo = "";
        this.direccion = "";

    
        this.flagocultarboton = false;
        this.flagocultarbotonagregar = false;
    
        this.flagNormal();
      
        this.codigotemporal="";
        
        this.ban=0;

        const parametrosenviar = {
          'estado_existente' : false,
          'estado' : 1
        };

        this.datosenvioexistente.emit(parametrosenviar);
      }
      else
      {
          this.toastr.success("Proveedor se encuentra registrado", "INFORMACIÓN DEL SISTEMA");
          this.cod_proveedor = data.cod_proveedor;
          this.cod_identificacion = data.cod_identificacion;
          this.identificacion = data.identificacion;
          this.ruc = data.ruc;
          this.razon_social = data.razon_social;
          this.nombre_comercial = data.nombre_comercial;
          this.convencional = data.convencional;
          this.celular = data.celular;
          this.correo = data.correo;
          this.direccion = data.direccion;
          //this.cod_tipo_proveedor = data.cod_tipo_proveedor;
          //this.tipo_proveedor = data.tipo_proveedor;

          this.flagocultarboton = true;
          this.flagocultarbotonagregar = true;
          
          this.flagNormal();
        
          this.codigotemporal=this.ruc;
          
          this.ban=1;
          const parametrosenviar = {
            'cod_proveedor' : this.cod_proveedor,
            'cod_identificacion' : this.cod_identificacion,
            'ruc' : this.ruc,
            'razon_social' : this.razon_social,
            'nombre_comercial' : this.nombre_comercial,
            'convencional' : this.convencional,
            'celular' : this.celular,
            'correo' : this.correo,
            'direccion' : this.direccion,
            //'cod_tipo_proveedor' :this.cod_tipo_proveedor,
            'estado_existente' : true,
            'estado' : 1
          };
  
          this.datosenvioexistente.emit(parametrosenviar);
      }

    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
      this.swalservice.close();
    } 

  }

  clickAgregar() {
    const parametrosenviar = {
      'cod_proveedor' : this.cod_proveedor,
      'cod_identificacion' : this.cod_identificacion,
      'ruc' : this.ruc,
      'razon_social' : this.razon_social,
      'nombre_comercial' : this.nombre_comercial,
      'convencional' : this.convencional,
      'celular' : this.celular,
      'correo' : this.correo,
      'direccion' : this.direccion,
      //'cod_tipo_proveedor' :this.cod_tipo_proveedor,
      'estado' : 1
    };

    this.datosenvio.emit(parametrosenviar);
    this.toastr.success("Proveedor Agregado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
  }

  clickLimpiar()
  {
    this.formularioNormal();
  }

  editar(item : any)
  {
      this.flagNormal();

      this.cod_proveedor = item.cod_proveedor;
      this.cod_identificacion = item.cod_identificacion;
      this.identificacion = item.identificacion;
      this.ruc = item.ruc;
      this.razon_social = item.razon_social;
      this.nombre_comercial = item.nombre_comercial;
      this.direccion = item.direccion;
      this.convencional = item.convencional;
      this.celular = item.celular;
      this.correo = item.correo;
      
      this.flagocultarboton = true;
      this.codigotemporal = this.ruc;
      this.ban=1;
  }

}