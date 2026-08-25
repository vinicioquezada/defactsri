import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterGenerico'
})
export class FilterGenericoPipe implements PipeTransform {

  transform(arreglo: any[], texto: string, campos: string[]): any[] {
    if (!arreglo || texto.trim() === '' || !campos || campos.length === 0) {
      return arreglo;
    }

    texto = texto.toLocaleLowerCase();
    let frases = texto.split(' ');

    return arreglo.filter(item => {
      let coincidencias = 0;

      for (let c = 0; c < frases.length; c++) {
        let encontrado = campos.some(campo =>
          item[campo] && item[campo].toString().toLowerCase().includes(frases[c])
        );

        if (encontrado) {
          coincidencias++;
        }
      }

      return coincidencias === frases.length;
    });
  }
}