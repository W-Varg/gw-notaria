import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getPing();
  }

  // Manejar solicitud de favicon
  @Get('favicon.ico')
  @HttpCode(HttpStatus.NO_CONTENT)
  getFavicon(): void {
    // Retorna 204 No Content - silenciosamente ignora la solicitud
  }

  // Manejar solicitud de favicon en assets
  @Get('assets/favicon.ico')
  @HttpCode(HttpStatus.NO_CONTENT)
  getAssetsFavicon(): void {
    // Retorna 204 No Content - silenciosamente ignora la solicitud
  }

  // Manejar solicitudes de Chrome DevTools
  @Get('.well-known/appspecific/com.chrome.devtools.json')
  @HttpCode(HttpStatus.NO_CONTENT)
  getChromeDevTools(): void {
    // Retorna 204 No Content - silenciosamente ignora la solicitud
  }
}
