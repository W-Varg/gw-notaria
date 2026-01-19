import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CatalogosServiciosService } from './catalogos-servicios.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { CatalogoServiciosResp } from './dto/catalogo-servicios.resp';

@ApiTags('[admin] Bancos')
@Controller('catalogos-servicios')
@UseInterceptors(AuditInterceptor)
export class CatalogosServiciosController {
  constructor(private readonly catalogosServiciosService: CatalogosServiciosService) {}

  @Get()
  @BearerAuthPermision()
  @ApiDescription('Obtiene catalogo de servicios')
  @ApiResponse({ status: 200, type: CatalogoServiciosResp })
  getForSelect() {
    return this.catalogosServiciosService.get();
  }
}
