import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { SocioService } from 'src/app/gym/services/socio.service';
import { ClienteService } from 'src/app/venta/services/cliente.service';
import { TipoIdentificacionService } from 'src/app/venta/services/tipo-identificacion.service';
import { TipoClienteService } from 'src/app/venta/services/tipo-cliente.service';
import { TipoUsuarioGymService } from 'src/app/gym/services/tipo-usuario-gym.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'src/app/shared/services/config.service';
import { SucursalesService } from 'src/app/usuario/services/sucursales.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
declare var $:any;
import { SwalService } from 'src/app/shared/services/swal.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-socio-form',
  templateUrl: './socio-form.component.html',
  styleUrls: ['./socio-form.component.css']
})
export class SocioFormComponent implements OnInit {
  @Output() datosenvio: EventEmitter<any> = new EventEmitter<any>();
  nombreformulario: string = "";
  cantidad_registros : number = 0;
  multisucursal : string = "0";
  datosidentificacion : any;
  datostipocliente : any;

  cod_sucursal : string = "";
  datos : any;

  
  loadinglistado : boolean = false;
  

  cod_cliente : string = "";
  cod_identificacion : string = "0";
  identificacion: string = "";
  cedula : string = "";
  apellido : string = "";
  nombre : string = "";
  convencional : string = "";
  celular : string = "";
  correo : string = "";
  direccion : string = "";
  cod_tipo_cliente : string = "0";
  tipo_cliente: string = "";
  cod_genero : string = "";
  urlfoto : string = "";
  datosgenero : any[] = [
    {
      "cod_genero" : "",
      "genero" : "SELECCIONE GÉNERO"
    },
    {
      "cod_genero" : "MASCULINO",
      "genero" : "MASCULINO"
    },
    {
      "cod_genero" : "FEMENINO",
      "genero" : "FEMENINO"
    }
  ];
  talla : string = "";
  fecha_nacimiento : string = "";
  cod_tipo_usuario_gym : string = "";
  datostipousuariogym : any = [];
  emparejamiento : number = 0;
  estado_emparejamiento : number = 0;

  flagocultarboton : boolean = false;
  flagocultaremparejamiento : boolean = false;
  flagocultarbotonenparejamiento : boolean = false;

  flagidentificacion : boolean = false;
  flagcedula : boolean = false;
  flaggenero : boolean = false;
  /*
  flagapellido : boolean = false;
  flagnombre : boolean = false;
  flagconvencional : boolean = false;
  flagcelular : boolean = false;
  flagcorreo : boolean = false;
  flagdireccion : boolean = false;
  */
  flagfechanacimiento : boolean = false;
  flagtipocliente : boolean = false;
  flagtipousuariogym : boolean = false;

  ban : number = 0;
  codigotemporal : string = "";

  loading : boolean = false;
  loadingform : boolean = false;

  lblcedula: string = "";
  lblapellido: string = "";
  lblnombre: string = "";

  constructor(private sociossrvice:SocioService, private toastr: ToastrService, private error:ErrorService, private tipoidentificacionservice:TipoIdentificacionService, private tipoclienteservice:TipoClienteService, private tipousuariogymservice : TipoUsuarioGymService, private clienteservice : ClienteService, private sucursalesservice : SucursalesService, private usersession: UserSessionService, private configService: ConfigService,private swalservice: SwalService) { 
  }

  ngOnInit(): void {
    this.multisucursal = this.usersession.getConfiguracion("multisucursal");
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.formularioNormal();
    this.cargarListas();
  }

  changegenero(event: any): void {
    const elemento = event.target.value;
    this.cod_genero = elemento;
  }

  changeIdentificacion(event: any): void {
    const elemento = event.target.value;
    this.cod_identificacion = elemento;
    if(this.cod_identificacion=="04")
    {
      this.lblcedula = "Ruc:";
      this.lblapellido = "Razón Social:";
      this.lblnombre = "Nombre Comercial:";
    }
    else
    {
      if(this.cod_identificacion=="06")
      {
        this.lblcedula = "Pasaporte:";
      }
      else
      {
        if(this.cod_identificacion=="09")
        {
          this.lblcedula = "Placa:";
        }
        else
        {
          if(this.cod_identificacion=="08")
          {
            this.lblcedula = "Código:";
          }
          else
          {
            this.lblcedula = "Cédula:";
          }
        }
      }
      this.lblapellido = "Apellido:";
      this.lblnombre = "Nombre:";
    }
  }

  async clickGuardar()
  {
    let valor : Boolean = this.verificarCampos();
    if(valor)
    {
      this.toastr.warning("Algunos campos no estan llenos, son obligatorios", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      this.swalservice.iniciarLoading("Almacenando...");
      await this.validarCedula();
      this.swalservice.close();
    }
  }
  
  async clickActualizar()
  {
    let valor : Boolean = this.verificarCampos();
    if(valor)
    {
      this.toastr.warning("Algunos campos no estan llenos, son obligatorios", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      this.swalservice.iniciarLoading("Actualizando...");
      if(this.cedula==this.codigotemporal)
      {
        await this.actualizar();
      }
      else
      {
        await this.validarCedula();
      }
      this.swalservice.close();
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

    if(this.cedula.length==0)
    {
      this.flagcedula=true;
      valor=true;
    }

    if(this.cod_genero.length==0)
    {
      this.flaggenero=true;
      valor=true;
    }
    /*
    if(this.apellido.length==0)
    {
      this.flagapellido = true;
      valor=true;
    }

    if(this.nombre.length==0)
    {
      this.flagnombre = true;
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

    if(this.fecha_nacimiento.length == 0)
    {
      this.flagfechanacimiento = true;
      valor = true;
    }

    if(this.cod_tipo_cliente == "0")
    {
      this.flagtipocliente = true;
      valor=true;
    }

    if(this.cod_tipo_usuario_gym == "0")
    {
      this.flagtipousuariogym = true;
      valor=true;
    }

    return valor;
  }

  flagNormal()
  {
    this.flagidentificacion = false;
    this.flagcedula = false;
    this.flaggenero = false;
    /*
    this.flagapellido = false;
    this.flagnombre = false;
    this.flagconvencional = false;
    this.flagcelular = false;
    this.flagcorreo = false;
    this.flagdireccion = false;
    */
    this.flagfechanacimiento = false;
    this.flagtipocliente = false;
    this.flagtipousuariogym = false;
  }
  
  clickDeshacer()
  {
    this.formularioNormal();
  }

  changeTipoCliente(event: any): void {
    const elemento = event.target.value;
    this.cod_tipo_cliente = elemento;
  }

  changeTipoUsuarioGym(event: any): void {
    const elemento = event.target.value;
    this.cod_tipo_usuario_gym = elemento;
  }

  clickBuscarCliente()
  {
    if(this.cedula.length>0)
    {
      if(this.cod_identificacion=="05")
      {
        if(this.cedula.length==10 && /^[0-9]+$/.test(this.cedula))
        {
          this.buscarUsuarioGym();
        }
        else
        {
          this.toastr.warning("Ingrese 10 digitos numéricos para realizar búsqueda", "INFORMACIÓN DEL SISTEMA");
        }
      }
      else
      {
        if(this.cod_identificacion=="04")
        {
          if(this.cedula.length==13 && /^[0-9]+$/.test(this.cedula))
          {
            this.buscarUsuarioGym();
          }
          else
          {
            this.toastr.warning("Ingrese 13 digitos numéricos para realizar búsqueda", "INFORMACIÓN DEL SISTEMA");
          }
        }
        else
        {
          this.buscarUsuarioGym();
        }
      }
    }
    else
    {
      this.toastr.warning("Ingrese numeración para realizar búsqueda", "INFORMACIÓN DEL SISTEMA");
    }
  }

  buscarUsuarioGym() {
    if(this.nombreformulario=="NUEVO")
    {
      this.swalservice.iniciarLoading("Buscando...");
      this.sociossrvice.buscarUsuarioGym(this.cedula).subscribe( (data : any) =>
      {
        if (data.cod_cliente == false)
        {
          this.buscarCliente();
        }
        else
        {
            this.swalservice.close();
            this.toastr.warning("Socio se encuentra registrado", "INFORMACIÓN DEL SISTEMA");
        }
      }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.swalservice.close();
      });
    }
  }

  buscarCliente()
  {
    this.clienteservice.buscar(this.cedula).subscribe( (data : any) =>
    {
      this.swalservice.close();
      if (data.cod_cliente == false)//No existe
      {    
        this.flagocultarboton = false;
        this.flagNormal();
        this.codigotemporal="";
        this.ban=0;
      }
      else
      {
          this.swalservice.close();
          this.toastr.success("Cliente cargado Satisfactoriamente, ubique los datos para gimnasio y actualice", "INFORMACIÓN DEL SISTEMA");
          this.cod_cliente = data.cod_cliente;
          this.cod_identificacion = data.cod_identificacion;
          this.identificacion = data.identificacion;
          this.cedula = data.cedula;
          this.apellido = data.apellido;
          this.nombre = data.nombre;
          this.convencional = data.convencional;
          this.celular = data.celular;
          this.correo = data.correo;
          this.direccion = data.direccion;
          this.cod_tipo_cliente = data.cod_tipo_cliente;

          this.flagocultarboton = true;
          
          this.flagNormal();
        
          this.codigotemporal=this.cedula;
          
          this.ban=1;
      }
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.swalservice.close();
      
    });
  }

  async validarCedula()
  {
    try
    {
      this.flagcedula = false;

      let data: any = await lastValueFrom(this.clienteservice.validarCedula(this.cod_identificacion, this.cedula));

      if (data.estado == true)
      { 
          this.buscar();
      }
      else
      {
        this.toastr.error("Identificación Incorrecta, ingrese una cédula válida por favor", "INFORMACIÓN DEL SISTEMA");
        this.flagcedula = true;
      }

    } catch (err) {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    }
  }

  async buscar()
  {
    try
    {
      let data: any = await lastValueFrom(this.clienteservice.buscar(this.cedula));

      if (data.cod_cliente == false)
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
          this.toastr.warning("Socio se encuentra registrado, revise su numero de indetificación, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }

    } catch (err) {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    }
  }

  async guardar()
  {
    try
    {
      const parametros = {
      'cod_cliente' : this.cod_cliente,
      'cod_identificacion' : this.cod_identificacion,
      'cedula' : this.cedula,
      'apellido' : this.apellido,
      'nombre' : this.nombre,
      'convencional' : this.convencional,
      'celular' : this.celular,
      'correo' : this.correo,
      'direccion' : this.direccion,
      'cod_tipo_cliente' :this.cod_tipo_cliente,
      'genero' : this.cod_genero,
      'fecha_nacimiento' : this.fecha_nacimiento,
      'talla' : this.talla,
      'emparejamiento' : this.emparejamiento,
      'estado_emparejamiento' : this.estado_emparejamiento,
      'cod_tipo_usuario_gym' : this.cod_tipo_usuario_gym
    };

      let data: any = await lastValueFrom(this.sociossrvice.guardar(parametros));

      if (data.estado == true)
      {
        this.toastr.success("Registro Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        this.datosenvio.emit(parametros);
      }
      else
      {
        this.toastr.error("Registro no se pudo Almacenar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }

    } catch (err) {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    }
  }
  
  async actualizar()
  {
    try
    {
      const parametros = {
      'cod_cliente' : this.cod_cliente,
      'cod_identificacion' : this.cod_identificacion,
      'cedula' : this.cedula,
      'apellido' : this.apellido,
      'nombre' : this.nombre,
      'convencional' : this.convencional,
      'celular' : this.celular,
      'correo' : this.correo,
      'direccion' : this.direccion,
      'cod_tipo_cliente' :this.cod_tipo_cliente,
      'genero' : this.cod_genero,
      'fecha_nacimiento' : this.fecha_nacimiento,
      'talla' : this.talla,
      'emparejamiento' : this.emparejamiento,
      'estado_emparejamiento' : this.estado_emparejamiento,
      'cod_tipo_usuario_gym' : this.cod_tipo_usuario_gym
    };

      let data: any = await lastValueFrom(this.sociossrvice.actualizar(parametros));

      if (data.estado == true)
      {
        this.toastr.success("Registro Actualizado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        this.datosenvio.emit(parametros);
      }
      else
      {
        this.toastr.error("Registro no se pudo Actualizar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }

    } catch (err) {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
    }
  }
  
  formularioNormal()
  {
    this.cod_cliente = moment().unix().toString();
    this.cod_identificacion = "0";
    this.identificacion = "";
    this.cedula = "";
    this.apellido = "";
    this.nombre = "";
    this.convencional = "";
    this.celular = "";
    this.correo = "";
    this.direccion = "";
    this.cod_tipo_cliente = "0";
    this.tipo_cliente = "";

    this.lblcedula = "Cédula:";
    this.lblapellido = "Apellido:";
    this.lblnombre = "Nombre:";

    this.cod_genero = "";
    this.talla = "1";
    this.fecha_nacimiento = "";
    this.cod_tipo_usuario_gym = "0";
    this.emparejamiento = 0;//Inicia en estado 0
    this.estado_emparejamiento = 0;//Inicia en estado 0
    this.urlfoto = this.configService.settings.baseUrl + "/fotouser/defecto.png";

    this.loadinglistado = false;
    

    this.flagocultarboton = false;
    this.flagocultaremparejamiento = false;
    this.flagocultarbotonenparejamiento = false;

    this.flagNormal();
  
    this.codigotemporal="";
  
    this.ban=0;
  }

  cargarListas()
  {
    this.listarIdentificacion();
    this.listarTipoClientes();
    this.listarTipoUsuarioGym();
  }

  listarIdentificacion()
  {
    this.loadingform = true;
    

    this.tipoidentificacionservice.listar().subscribe( (data : any) =>
    {
      this.loadingform = false;
      this.datosidentificacion = data;

      const objetoidentificacion = {
        cod_identificacion: "0",
        identificacion: "SELECCIONE UN TIPO DE IDENTIFICACION",
        estado: 1
      };

      this.datosidentificacion.unshift(objetoidentificacion);
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingform = false;
      
    });
    
  }

  listarTipoClientes()
  {    
    this.loadingform = true;
    
    this.tipoclienteservice.listar().subscribe( (data : any) =>
    {
      this.loadingform = false;
      this.datostipocliente = data;

      const objeto = {
        cod_tipo_cliente: "0",
        tipo_cliente: "SELECCIONE UN TIPO DE CLIENTE",
        estado: 1
      };

      this.datostipocliente.unshift(objeto);

    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingform = false;
      
    });
    
  }

  listarTipoUsuarioGym()
  {    
    this.loadingform = true;
    this.tipousuariogymservice.listarTipoUsuarioGym().subscribe( (data : any) =>
    {
      this.loadingform = false;
      this.datostipousuariogym = data;

      const objeto = {
        cod_tipo_usuario_gym: "0",
        tipo_usuario_gym: "SELECCIONE UN TIPO USUARIO",
        estado: 1
      };

      this.datostipousuariogym.unshift(objeto);

    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadingform = false;
    });
  }

  editar(item :any)
  {      
      this.flagNormal();

      this.cod_cliente = item.cod_cliente;
      this.cod_identificacion = item.cod_identificacion;
      this.identificacion = item.identificacion;
      this.cedula = item.cedula;
      this.apellido = item.apellido;
      this.nombre = item.nombre;
      this.direccion = item.direccion;
      this.convencional = item.convencional;
      this.celular = item.celular;
      this.correo = item.correo;
      this.cod_tipo_cliente = item.cod_tipo_cliente;
      this.tipo_cliente = item.tipo_cliente;
      this.flagocultarboton = true;
      this.codigotemporal=this.cedula;
      this.ban=1;
      
      if (item.cod_usuario_gym == null) {
        this.cod_genero = "";
        this.talla = "1";
        this.fecha_nacimiento = "";
        this.cod_tipo_usuario_gym = "0";
        this.emparejamiento = 0;
        this.estado_emparejamiento = 0;
      } else {
        this.cod_genero = item.genero;
        this.talla =  item.talla;
        this.fecha_nacimiento =  item.fecha_nacimiento;
        this.cod_tipo_usuario_gym =  item.cod_tipo_usuario_gym;
        this.emparejamiento = item.emparejamiento;
        this.estado_emparejamiento = item.estado_emparejamiento;
      }

  }
}