import { Controller, Get } from '@nestjs/common';
import { PublicService } from './public.service';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { CategoriasTypePublic, TiposProductosTypePublic } from './dto/public.response';
import { UseCache } from 'src/common/decorators/cache.decorator';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('categorias')
  @UseCache({ ttl: 5 * 60, keyPrefix: 'categorias' }) // Cache for 5 minutes
  @ApiDescription('Obtener categorías activas')
  @ApiResponse({ status: 200, type: () => CategoriasTypePublic })
  async getCategorias() {
    return this.publicService.getCategorias();
  }

  @Get('tipos-productos')
  @UseCache({ ttl: 15 * 60, keyPrefix: 'tipos-productos' }) // Cache for 15 minutes
  @ApiDescription('Obtener tipos de productos disponibles')
  @ApiResponse({ status: 200, type: () => TiposProductosTypePublic })
  async getTiposProductos() {
    return this.publicService.getTiposProductos();
  }
}
