import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { VERSION_NEUTRAL, StreamableFile } from '@nestjs/common';
// import { createReadStream } from 'fs';
// import { join } from 'path';
// import { SkipResponseFormat } from './common/decorators/interceptor.decorator';

@Controller({ version: VERSION_NEUTRAL })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getPing();
  }

  // // Manejar solicitud de favicon
  // @Get('favicon.ico')
  // // @HttpCode(HttpStatus.NO_CONTENT)
  // @SkipResponseFormat()
  // getFavicon(): StreamableFile {
  //   // Retorna 204 No Content - silenciosamente ignora la solicitud
  //   const file = createReadStream(join(__dirname, '..', '..', 'public/assets/favicon.ico'));
  //   return new StreamableFile(file);
  // }

  // // Manejar solicitud de favicon en assets
  // @Get('public/assets/favicon.ico')
  // @SkipResponseFormat()
  // getAssetsFavicon(): StreamableFile {
  //   const file = createReadStream(join(__dirname, '..', '..', 'public/assets/favicon.ico'));
  //   return new StreamableFile(file);
  // }

  // // Manejar solicitudes de Chrome DevTools
  // @Get('.well-known/appspecific/com.chrome.devtools.json')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // getChromeDevTools(): void {
  //   // Retorna 204 No Content - silenciosamente ignora la solicitud
  // }
}
