import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { empty, lastValueFrom } from 'rxjs';
import { RucEmpresa } from 'src/app/administrar/interfaces/ruc-empresa.interface';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { WsService } from 'src/app/shared/services/ws.service';
import { RucEmpresaService } from 'src/app/usuario/services/ruc-empresa.service';

@Component({
  selector: 'app-ruc-form',
  templateUrl: './ruc-form.component.html',
  styleUrls: ['./ruc-form.component.css']
})
export class RucFormComponent implements OnInit {
  @Output() datosenvio: EventEmitter<any> = new EventEmitter<any>();
  nombreformulario: string = "";
  rucempresa: RucEmpresa = {
    cod_ruc: 0,
    cod_sucursal: 1,
    tipo_ambiente: 2,
    empresa: '',
    ruc_sucursal: '',
    razonsocial: '',
    nombrecomercial: '',
    nombrecomercial1: '',
    serieestab: 1,
    ptoemi: 1,
    contabilidad: 'NO',
    direccion_matriz: '',
    direccion_establecimiento: '',
    celular_establecimiento: '',
    telefono_establecimiento: '',
    ciudad_establecimiento: '',
    correo_establecimiento: '',
    tipo_ruc: 'EMPRENDEDOR',
    tipo_contribuyente: 'RIMPE',
    contribuyente: 'CONTRIBUYENTE RÉGIMEN RIMPE',
    leyenda: '',
    firmap12: '',
    clavep12: '',
    pk12: 1,
    firmapublica: '0',
    firmaprivada: '0',
    certificado: '',
    estado: 1,
    facturaversion: 110,
    fecha_caducidad_firma: '2000-01-01 00:00:00'
  };

  datostipoambiente : any = [
    {
        "cod_tipo_ambiente" : 1,
        "tipo_ambiente" : "PRUEBA"
    },
    {
        "cod_tipo_ambiente" : 2,
        "tipo_ambiente" : "PRODUCCIÓN"
    }
  ];

  datostiporuc : any = [
    {
        "cod_tipo_ruc" : "POPULAR",
        "tipo_ruc" : "POPULAR"
    },
    {
        "cod_tipo_ruc" : "EMPRENDEDOR",
        "tipo_ruc" : "EMPRENDEDOR"
    },
    {
        "cod_tipo_ruc" : "GENERAL",
        "tipo_ruc" : "GENERAL"
    }
  ];

  datoscontabilidad : any = [
    {
        "cod_contabilidad" : "NO",
        "contabilidad" : "NO"
    },
    {
        "cod_contabilidad" : "SI",
        "contabilidad" : "SI"
    }
  ];

  flagcodruc: boolean = false;
  flagcodsucursal: boolean = false;
  flagempresa: boolean = false;
  flagrucsucursal: boolean = false;
  flagrazonsocial: boolean = false;
  flagnombrecomercial: boolean = false;
  flagdireccionmatriz: boolean = false;
  flagserieestab: boolean = false;
  flagptoemi: boolean = false;
  flagdireccionestablecimiento: boolean = false;
  flagcelularestablecimiento: boolean = false;
  flagtelefonoestablecimiento: boolean = false;
  flagciudadestablecimiento: boolean = false;
  flagcorreoestablecimiento: boolean = false;
  flagfirmap12: boolean = false;
  flagclavep12: boolean = false;
  flagcertificado: boolean = false;
  flagfechacaducidadfirma: boolean = false;

  cod_ruc: string = "";

  flagocultarboton : boolean = false;
  ban : number = 0;
  loadingform : boolean = false;

  constructor(private swalservice: SwalService, private toastr: ToastrService, private rucempresaservice: RucEmpresaService, private error:ErrorService, private rutaActiva: ActivatedRoute, private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.formularioNormal();
  }

  changeTipoAmbiente(event: any): void {
    const elemento = event.target.value;
    this.rucempresa.tipo_ambiente = elemento;
  }

  changeTipoRuc(event: any): void {
    const elemento = event.target.value;
    this.rucempresa.tipo_ruc = elemento;

    if(this.rucempresa.tipo_ruc=="POPULAR")
    {
      this.rucempresa.tipo_contribuyente = "RIMPE";
      this.rucempresa.contribuyente = "CONTRIBUYENTE NEGOCIO POPULAR - RÉGIMEN RIMPE";
    }

    if(this.rucempresa.tipo_ruc=="EMPRENDEDOR")
    {
      this.rucempresa.tipo_contribuyente = "RIMPE";
      this.rucempresa.contribuyente = "CONTRIBUYENTE RÉGIMEN RIMPE";
    }

    if(this.rucempresa.tipo_ruc=="GENERAL")
    {
      this.rucempresa.tipo_contribuyente = "GENERAL";
      this.rucempresa.contribuyente = "CONTRIBUYENTE RÉGIMEN GENERAL";
    }
  }

  changeContabilidad(event: any): void {
    const elemento = event.target.value;
    this.rucempresa.contabilidad = elemento;
  }

  formularioNormal(): void
  {

    
      this.flagNormal();

      this.rucempresa = {
        cod_ruc: 0,
        cod_sucursal: 1,
        tipo_ambiente: 2,
        empresa: '',
        ruc_sucursal: '',
        razonsocial: '',
        nombrecomercial: '',
        nombrecomercial1: '',
        serieestab: 1,
        ptoemi: 1,
        contabilidad: 'NO',
        direccion_matriz: '',
        direccion_establecimiento: '',
        celular_establecimiento: '',
        telefono_establecimiento: '',
        ciudad_establecimiento: '',
        correo_establecimiento: '',
        tipo_ruc: 'EMPRENDEDOR',
        tipo_contribuyente: 'RIMPE',
        contribuyente: 'CONTRIBUYENTE RÉGIMEN RIMPE',
        leyenda: '',
        firmap12: '',
        clavep12: '',
        pk12: 1,
        firmapublica: '0',
        firmaprivada: '0',
        certificado: '',
        estado: 1,
        facturaversion: 1,
        fecha_caducidad_firma: '2000-01-01 00:00:00'
      };

      this.ban = 0;
      this.flagocultarboton = false;
    

  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  clickGuardar()
  {
    let valor : Boolean = this.verificarCampos();
    if(valor)
    {
      this.toastr.warning("Algunos campos no estan llenos, son obligatorios", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      this.guardar();
    }
  }
  
  clickActualizar()
  {
    let valor : Boolean = this.verificarCampos();
    if(valor)
    {
      this.toastr.warning("Algunos campos no estan llenos, son obligatorios", "INFORMACIÓN DEL SISTEMA");
    }
    else
    {
      this.actualizar();
    }
  }

  verificarCampos()
  {
    let valor : Boolean = false;

    this.flagNormal();

    if(this.rucempresa.cod_ruc==0)
    {
      this.flagcodruc=true;
      valor=true;
    }

    if(this.rucempresa.empresa.length==0)
    {
      this.flagempresa=true;
      valor=true;
    }
    
    if(this.rucempresa.ruc_sucursal.length==0)
    {
      this.flagrucsucursal=true;
      valor=true;
    }

    if(this.rucempresa.razonsocial.length==0)
    {
      this.flagrazonsocial=true;
      valor=true;
    }

    if(this.rucempresa.nombrecomercial.length==0)
    {
      this.flagnombrecomercial=true;
      valor=true;
    }

    if(this.rucempresa.direccion_matriz.length==0)
    {
      this.flagdireccionmatriz=true;
      valor=true;
    }

    if(this.rucempresa.serieestab==0)
    {
      this.flagserieestab=true;
      valor=true;
    }

    if(this.rucempresa.ptoemi==0)
    {
      this.flagptoemi=true;
      valor=true;
    }

    if(this.rucempresa.direccion_establecimiento.length==0)
    {
      this.flagdireccionestablecimiento=true;
      valor=true;
    }

    /*
    if(this.rucempresa.celular_establecimiento.length==0)
    {
      this.flagcelularestablecimiento=true;
      valor=true;
    }

    if(this.rucempresa.telefono_establecimiento.length==0)
    {
      this.flagtelefonoestablecimiento=true;
      valor=true;
    }
    */

    if(this.rucempresa.ciudad_establecimiento.length==0)
    {
      this.flagciudadestablecimiento=true;
      valor=true;
    }

    if(this.rucempresa.correo_establecimiento.length==0)
    {
      this.flagcorreoestablecimiento=true;
      valor=true;
    }

    if(this.rucempresa.firmap12.length==0)
    {
      this.flagfirmap12=true;
      valor=true;
    }

    if(this.rucempresa.clavep12.length==0)
    {
      this.flagclavep12=true;
      valor=true;
    }

    if(this.rucempresa.certificado.length==0)
    {
      this.flagcertificado=true;
      valor=true;
    }

    if(this.rucempresa.fecha_caducidad_firma.length==0)
    {
      this.flagfechacaducidadfirma=true;
      valor=true;
    }
    

   
    return valor;
  }

  flagNormal()
  {
    this.flagcodruc = false;
    this.flagcodsucursal = false;
    this.flagempresa = false;
    this.flagrucsucursal = false;
    this.flagrazonsocial = false;
    this.flagnombrecomercial = false;
    this.flagdireccionmatriz = false;
    this.flagserieestab = false;
    this.flagptoemi = false;
    this.flagdireccionestablecimiento = false;
    this.flagcelularestablecimiento = false;
    this.flagtelefonoestablecimiento = false;
    this.flagciudadestablecimiento = false;
    this.flagcorreoestablecimiento = false;
    this.flagfirmap12 = false;
    this.flagclavep12 = false;
    this.flagcertificado = false;
    this.flagfechacaducidadfirma = false;
  }

  guardar()
  {
    this.swalservice.iniciarLoading("Almacenando...");
    
    this.rucempresaservice.guardar(this.rucempresa).subscribe( (data : any) =>
    {
      if (data.estado == true)
      {
        this.toastr.success("Registro Almacenado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        this.datosenvio.emit();
      }
      else
      {
        this.toastr.error("Registro no se pudo Almacenar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
      this.swalservice.close();
    }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.swalservice.close(); 
    });
  }

  actualizar()
  {
    this.swalservice.iniciarLoading("Actualizando...");
    
    this.rucempresaservice.actualizar(this.rucempresa).subscribe( (data : any) =>
    {
      if (data.estado == true)
      {
        this.toastr.success("Registro Actualizado Satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
        this.datosenvio.emit();
      }
      else
      {
        this.toastr.error("Registro no se pudo Actualizar, vuelva a intertarlo por favor", "INFORMACIÓN DEL SISTEMA");
      }
      this.swalservice.close();
    }, err => {
        this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
        this.swalservice.close(); 
    });
  }

  async buscarRuc()
  {
    try
    {
      this.ban=1;
      this.loadingform = true;
      let data: any = await lastValueFrom(this.rucempresaservice.buscarRuc(this.cod_ruc));
      this.loadingform = false;
      this.rucempresa = data;
    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
      this.loadingform = false;
    }
  }

}
