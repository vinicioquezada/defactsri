import { Component } from '@angular/core';
import { HeaderMenus } from './shared/models/header-menus.dto';
import { AccessService } from './shared/services/access.service';
import { UserSessionService } from './shared/services/user-session.service';
import { StorageEncryptionService } from './shared/services/storage-encryption.service';
import { Router, NavigationEnd } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ssfact';
  estadologin : boolean = false;
  estadomenu : boolean = false;
  estadomonitor : boolean = false;
  estado_sesion : string = "";
  ultimoSegmento: string = "";
  constructor(private accessservice: AccessService, private usersession: UserSessionService, private storageencryptionservice: StorageEncryptionService, private router: Router)
  {
    this.router.events.subscribe(event =>{
      if (event instanceof NavigationEnd)
      {
        const url = event.urlAfterRedirects.split('?')[0];
        this.ultimoSegmento = url.substring(url.lastIndexOf('/') + 1);
        
        if(this.ultimoSegmento== "monitor" || this.ultimoSegmento== "monitorcompartido" || this.ultimoSegmento== "monitorsecundario")
        {
          this.estadomenu=false;
          this.estadomonitor=true;
        }
      }
    });
  }



    


  ngAfterViewInit() {
  }

  ngOnInit(): void {
    this.accessservice.headerManagement.subscribe(
      (headerInfo: HeaderMenus) => {
        if (headerInfo) {

          this.estadologin = headerInfo.estadologin;
          this.estadomenu = headerInfo.estadomenu;

          this.estado_sesion = JSON.parse(localStorage.getItem("sessionstate")!);
   
          if(this.estado_sesion==null)
          {
            this.estadologin = headerInfo.estadologin;
            this.estadomenu = headerInfo.estadomenu;
            localStorage.clear();
            this.usersession.clear();
            localStorage.setItem('logout-event', Date.now().toString());
          }
          else
          {
            this.estadologin = false;
            this.estadomenu = true;

            let cod_proyecto = this.usersession.getConfiguracion("cod_proyecto");
            
            if(cod_proyecto==undefined)
            {
              let decrytedconfiguracion = this.storageencryptionservice.getDecryptedItem("cu1");
              let decrytedmenu = this.storageencryptionservice.getDecryptedItem("ma001");
              let decrytedprivilegios = this.storageencryptionservice.getDecryptedItem("cpf");
              
              if(decrytedconfiguracion==null || decrytedmenu==null || decrytedprivilegios==null)
              {
                
              }
              else
              {
                this.usersession.setAllConfiguracion(decrytedconfiguracion);
                this.usersession.setAllMenu(decrytedmenu);
                this.usersession.setAllPrivilegios(decrytedprivilegios);
              }
            }

          }
        }
      }
    );
    
    window.addEventListener('storage', (event) => {
      if (event.key === 'logout-event') {
        this.estadologin = true;
        this.estadomenu = false;
      }
    });

    $(document).on('hidden.bs.modal', '.modal', () => {
    if ($('.modal:visible').length > 0) {
      $('body').addClass('modal-open');
    }
  });
    
  }
}