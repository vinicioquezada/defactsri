import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/services/config.service';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  urllogo: string = "";

  constructor(private http:HttpClient, private configService: ConfigService) {
    this.urllogo = this.configService.settings.baseUrl + "/images/logo.php";
  }

  private get api() {
    return this.configService.settings.baseUrl + "/api/almacen/categoria/";
  }
  
  async getBase64ImageGeneralFromURL(): Promise<string> {
    const blob = await lastValueFrom(this.http.get(this.urllogo, { responseType: 'blob' }));
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}