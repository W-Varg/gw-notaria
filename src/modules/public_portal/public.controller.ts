import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { PublicService } from './public.service';
import { ApiDescription } from '../../common/decorators/controller.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  // CategoriasTypePublic,
  ResponseMensajeType,
  ResponsePoliticasType,
  ResponseFAQsType,
  ResponseInformacionCompletaType,
} from './dto/public.response';
import { UseCache } from '../../common/decorators/cache.decorator';
import { ContactoMensajeDto, FAQsDto } from './dto/public.input';

@ApiTags('[public] Portal Público')
@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  // @Get('categorias')
  // @UseCache({ ttl: 5 * 60, keyPrefix: 'categorias' }) // Cache for 5 minutes
  // @ApiDescription('Obtener categorías activas')
  // @ApiResponse({ status: 200, type: () => CategoriasTypePublic })
  // async getCategorias() {
  //   return this.publicService.getCategorias();
  // }

  /* ---------------------------------------------------------------------------------------------------------------- */
  /*                                                     Contacto                                                     */
  /* ---------------------------------------------------------------------------------------------------------------- */

  @Post('contacto/enviar-mensaje')
  @ApiDescription('Enviar mensaje de contacto', [])
  @ApiResponse({ status: 201, type: () => ResponseMensajeType })
  enviarMensaje(@Body() dto: ContactoMensajeDto) {
    return this.publicService.enviarMensaje(dto);
  }

  /* ---------------------------------------------------------------------------------------------------------------- */
  /*                                                    Información                                                   */
  /* ---------------------------------------------------------------------------------------------------------------- */

  @Get('info/politicas')
  @UseCache({ ttl: 60 * 60, keyPrefix: 'politicas' }) // Cache for 1 hour
  @ApiDescription('Obtener políticas de la tienda (términos, privacidad, devoluciones)', [])
  @ApiResponse({ status: 200, type: () => ResponsePoliticasType })
  getPoliticas() {
    return this.publicService.getPoliticas();
  }

  @Get('info/faqs')
  @UseCache({ ttl: 30 * 60, keyPrefix: 'faqs' }) // Cache for 30 minutes
  @ApiDescription('Obtener preguntas frecuentes', [])
  @ApiResponse({ status: 200, type: () => ResponseFAQsType })
  getFAQs(@Query() query: FAQsDto) {
    return this.publicService.getFAQs(query);
  }

  @Get('info/sobre-nosotros')
  @UseCache({ ttl: 60 * 60, keyPrefix: 'sobre-nosotros' }) // Cache for 1 hour
  @ApiDescription('Obtener información completa sobre la empresa y tienda', [])
  @ApiResponse({ status: 200, type: () => ResponseInformacionCompletaType })
  getSobreNosotros() {
    return this.publicService.getInformacionCompleta();
  }
}
