import { Component, OnInit } from '@angular/core';

import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-menu-gym',
  templateUrl: './menu-gym.component.html',
  styleUrls: ['./menu-gym.component.css']
})
export class MenuGymComponent implements OnInit {
  opcionesmenu : any;
  compartido_extension: string = "";
  constructor(private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.opcionesmenu = this.usersession.getAllMenu();
    this.compartido_extension = this.usersession.getConfiguracion("compartido_extension");
  }

  primeraPantalla()
  {
    const ancho = screen.availWidth;
    const alto = screen.availHeight;

    const ventana = window.open('menugym/monitor', 'Monitor Principal', `width=${ancho},height=${alto},left=0,top=0,toolbar=no,menubar=no,location=no,status=no`);

    ventana?.focus();
  }

  segundaPantalla()
  {
    let miVentana = window.open("menugym/monitorsecundario", "Monitor Secundario", 'width=600,height=400,left=300,top=100');
    miVentana.focus();
  }

  permisosProcesosOperativos(): boolean
  {
    if (this.opcionesmenu['monitor'] == 1 || this.opcionesmenu['gestion_socios'] == 1 || this.opcionesmenu['socios'] == 1 || this.opcionesmenu['planes'] == 1 || this.opcionesmenu['membresias'] == 1 || this.opcionesmenu['ventadiario'] == 1 || this.opcionesmenu['exploradorventamembresias'] == 1)
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
    if (this.opcionesmenu['reportesocios'] == 1 || this.opcionesmenu['reporteestadomembresia'] == 1 || this.opcionesmenu['reportepromocionalmes'] == 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

}