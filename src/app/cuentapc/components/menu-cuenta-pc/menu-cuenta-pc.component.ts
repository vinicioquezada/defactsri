import { Component, OnInit } from '@angular/core';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
declare var $:any;

@Component({
  selector: 'app-menu-cuenta-pc',
  templateUrl: './menu-cuenta-pc.component.html',
  styleUrls: ['./menu-cuenta-pc.component.css']
})
export class MenuCuentaPcComponent implements OnInit {
  
  opcionesmenu : any;
  constructor(private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.opcionesmenu = this.usersession.getAllMenu();
  }

  clickReportePorCobrar()
  {
    $("#mymodalopcionesreportecuentasporcobrar").modal("show");
  }

  clickReportePorPagar()
  {
    $("#mymodalopcionesreportecuentasporpagar").modal("show");
  }

  permisosProcesosOperativos(): boolean
  {
    if (this.opcionesmenu['credito'] == 1 || this.opcionesmenu['abonoventa'] == 1 || this.opcionesmenu['abonocompra'] == 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  permisosInformesReportes(): boolean
  {
    if (this.opcionesmenu['reporteabonoventa'] == 1 || this.opcionesmenu['reporteabonocompra'] == 1 || this.opcionesmenu['reporteventaporcobrar'] == 1 || this.opcionesmenu['reportecorteporcobrar'] == 1 || this.opcionesmenu['reporteformapagovencimiento'] == 1 || this.opcionesmenu['reportecuentascobrarconsolidado'] == 1 || this.opcionesmenu['reportecompraporpagar'] == 1 || this.opcionesmenu['reportecuentaspagarconsolidado'] == 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  permisosBotonReportePorCobrar(): boolean
  {
    if (this.opcionesmenu['reporteventaporcobrar'] == 1 || this.opcionesmenu['reportecorteporcobrar'] == 1 || this.opcionesmenu['reporteformapagovencimiento'] == 1 || this.opcionesmenu['reportecuentascobrarconsolidado'] == 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  permisosBotonReportePorPagar(): boolean
  {
    if (this.opcionesmenu['reportecompraporpagar'] == 1 || this.opcionesmenu['reportecuentaspagarconsolidado'] == 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

}