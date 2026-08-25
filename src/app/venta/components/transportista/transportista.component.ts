import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { TransportistaService } from '../../services/transportista.service';
import { AbonoVentaService } from 'src/app/cuentapc/services/abono-venta.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
import * as moment from 'moment';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { TransportistaFormComponent } from './transportista-form/transportista-form.component';
import { SwalService } from 'src/app/shared/services/swal.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-transportista',
  templateUrl: './transportista.component.html',
  styleUrls: ['./transportista.component.css']
})
export class TransportistaComponent implements OnInit {
  @ViewChild(TransportistaFormComponent) childtransportistaform!: TransportistaFormComponent;
  @Output()
  datosenviar: EventEmitter<any> = new EventEmitter<any>();
  datos : any;
  filterpost = "";
  loadinglistado : boolean = false;
  cantidad_registros : number = 0;
  cod_sucursal : string = "";

  cod_transportista : string = "";
  transportista: string = "";

  page = 1;
  count = 0;
  pagesize = 5;

  cod_transportista_eliminar : string = "";
  transportista_eliminar : string = "";

  opcionesprivilegios : any;

  estado_suspendido: number = 0;

  constructor(private transportistaservice:TransportistaService, private toastr: ToastrService, private error:ErrorService, private abonoventaservice : AbonoVentaService,private usersession: UserSessionService, private router : Router, private swalservice: SwalService) { 
  }

  ngOnInit(): void {
    this.opcionesprivilegios = this.usersession.getAllPrivilegios();
    this.cod_sucursal = this.usersession.getConfiguracion("cod_sucursal");
    this.formularioNormal();
  }

  keyFiltrado()
  {
    this.page = 1;
  }

  listarTransportistas()
  {
    this.loadinglistado = true;
    

    this.transportistaservice.listar().subscribe( (data : any) =>
    {
      this.datos = data;
      this.cantidad_registros = data.length;
      this.loadinglistado = false;
    }, err => {
      this.toastr.error(this.error.getClienteStatus(err.status), "INFORMACIÓN DEL SISTEMA");
      this.loadinglistado = false;
    });
  }

  clickDeshacer()
  {
    this.formularioNormal();
  }

  formularioNormal()
  {
    this.page = 1;
    this.filterpost = "";
    this.listarTransportistas();
  }

  async visualizarListadoVentaTransportista()
  {
    const params = {
      cod_sucursal: String(this.cod_sucursal || "").trim(),
      cod_transportista: String(this.cod_transportista || "").trim(),
      transportista: String(this.transportista || "").trim(),
      fechadesde: String(moment().subtract(1, 'year').format('YYYY-MM-DD')|| "").trim(),
      fechahasta: String(moment().format('YYYY-MM-DD')|| "").trim()
    };

    const hash = await this.generarHash(params);

    this.router.navigate(["/menuventa/visualizarlistadoventatransportista"], {
      queryParams: {
        ...params,
        firma: hash
      }
    });
  }

  async visualizarListadoPedidoTransportista()
  {
    const params = {
      cod_sucursal: String(this.cod_sucursal || "").trim(),
      cod_transportista: String(this.cod_transportista || "").trim(),
      transportista: String(this.transportista || "").trim(),
      fechadesde: String(moment().subtract(1, 'year').format('YYYY-MM-DD')|| "").trim(),
      fechahasta: String(moment().format('YYYY-MM-DD')|| "").trim()
    };

    const hash = await this.generarHash(params);

    this.router.navigate(["/menuventa/visualizarlistadopedidotransportista"], {
      queryParams: {
        ...params,
        firma: hash
      }
    });
  }

  generarHash(data: any): string {
    return CryptoJS.SHA256(JSON.stringify(data)).toString(CryptoJS.enc.Hex);
  }

  handlePageChange(event: number): void {
    this.page = event;
  }

  clickNuevoTransportista()
  {
    this.childtransportistaform.nombreformulario = "NUEVA";
    this.childtransportistaform.formularioNormal();
    $("#mymodalformtransportista").modal("show");
  }

  recibirDatosTransportista(): void {
    this.formularioNormal();
    this.childtransportistaform.formularioNormal();
    $("#mymodalformtransportista").modal("hide");
  }

  editar(item : any)
  {
      this.childtransportistaform.nombreformulario = "EDITAR";
      this.childtransportistaform.cedula = item.cedula;
      this.childtransportistaform.buscarTransportistaNormal();
      $("#mymodalformtransportista").modal("show");
  }

  async clickEliminar(cod_transportista_eliminar: string, transportista_eliminar: string)
  {
    this.cod_transportista_eliminar = cod_transportista_eliminar;
    this.transportista_eliminar = transportista_eliminar;
    
    const ok = await this.swalservice.alertConfirmRequerido({
      title: "ELIMINAR REGISTRO "  + this.transportista_eliminar,
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

  async eliminar()
  {
    this.swalservice.iniciarLoading("Eliminando...");
    try
    {
      const parametros = {
        'cod_transportista' : this.cod_transportista_eliminar,
        'estado' : 0,
      };

      let data: any = await lastValueFrom(this.transportistaservice.eliminar(parametros));

      if (data.estado == true)
      {
          this.listarTransportistas();
        

        this.toastr.success("Registro eliminado satisfactoriamente", "INFORMACIÓN DEL SISTEMA");
      }
      else
      {
        const ok = await this.swalservice.alertError("Registro no se pudo Eliminar, vuelva a intertarlo por favor");
      }
    } catch (err: any) {
      const ok = await this.swalservice.alertError(this.error.getClienteStatus(err?.status));
    } finally {
      this.swalservice.close();
    }
    
  }




 
}
