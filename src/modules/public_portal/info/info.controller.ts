import { Controller, Get, Param, Query } from '@nestjs/common';
import { InfoService } from './info.service';
import { PromocionesActivasDto, FAQsDto } from './dto/info.input.dto';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ResponseHorariosType,
  ResponsePoliticasType,
  ResponsePromocionesType,
  ResponseFAQsType,
  ResponseInformacionCompletaType,
} from './dto/info.response';

@ApiTags('[public] Información')
@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Get('sucursales/:id/horarios')
  @ApiDescription('Obtener horarios de atención por sucursal', [])
  @ApiResponse({ status: 200, type: () => ResponseHorariosType })
  getHorariosSucursal(@Param('id') id: string) {
    return this.infoService.getHorariosSucursal(id);
  }

  @Get('politicas')
  @ApiDescription('Obtener políticas de la tienda (términos, privacidad, devoluciones)', [])
  @ApiResponse({ status: 200, type: () => ResponsePoliticasType })
  getPoliticas() {
    return this.infoService.getPoliticas();
  }

  @Get('promociones-activas')
  @ApiDescription('Obtener promociones y ofertas activas', [])
  @ApiResponse({ status: 200, type: () => ResponsePromocionesType })
  getPromocionesActivas(@Query() query: PromocionesActivasDto) {
    return this.infoService.getPromocionesActivas(query);
  }

  @Get('faqs')
  @ApiDescription('Obtener preguntas frecuentes', [])
  @ApiResponse({ status: 200, type: () => ResponseFAQsType })
  getFAQs(@Query() query: FAQsDto) {
    return this.infoService.getFAQs(query);
  }

  @Get('sobre-nosotros')
  @ApiDescription('Obtener información completa sobre la empresa y tienda', [])
  @ApiResponse({ status: 200, type: () => ResponseInformacionCompletaType })
  getSobreNosotros() {
    return this.infoService.getInformacionCompleta();
  }
}
