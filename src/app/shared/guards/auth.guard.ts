import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserSessionService } from '../services/user-session.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(
    private userSession: UserSessionService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let keyMenu = route.data['menu'];
    const permisos = this.userSession.getAllMenu();

    const tipoFormulario = route.params['tipo_formulario'];

    if (tipoFormulario) {
      const reglas: any = {
        membresias: {
          actualizarregistro: 'bloqueoedicionmembresias'
        },
        facturaventa: {
          actualizarregistro: 'bloqueoedicionventas',
          copiarregistro: 'bloqueocopiar'
        },
        notacredito: {
          nuevoregistro: 'bloqueonotacredito',
          actualizarregistro: 'bloqueoedicionnotacredito'
        }
      };

      const regla = reglas[keyMenu]?.[tipoFormulario];
      if (regla) {
        const privilegios = this.userSession.getAllPrivilegios();
        if (privilegios[regla] == 1) {
          this.router.navigate(['/accesodenegado']);
          return false;
        }
      }
    }
    
    if (permisos[keyMenu] == 1) {
      return true;
    }

    this.router.navigate(['/accesodenegado']);
    return false;
  }
}
