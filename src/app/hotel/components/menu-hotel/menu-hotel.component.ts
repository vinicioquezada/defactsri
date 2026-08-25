import { Component, OnInit } from '@angular/core';

import { UserSessionService } from 'src/app/shared/services/user-session.service';

@Component({
  selector: 'app-menu-hotel',
  templateUrl: './menu-hotel.component.html',
  styleUrls: ['./menu-hotel.component.css']
})
export class MenuHotelComponent implements OnInit {
  
  opcionesmenu : any;
  constructor(private usersession: UserSessionService) { }

  ngOnInit(): void {
    this.opcionesmenu = this.usersession.getAllMenu();
  }

  permisosProcesosOperativos(): boolean
  {
    if (this.opcionesmenu['servicioshotel'] == 1 || this.opcionesmenu['exploradordepartamentos'] == 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

}