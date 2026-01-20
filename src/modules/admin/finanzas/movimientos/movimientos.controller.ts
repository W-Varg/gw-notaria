import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { MovimientosService } from './movimientos.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MovimientoResponseDto } from './dto/movimiento-response.dto';
import { dataResponseFormat } from '../../../../common/dtos';
import { FiltroInputDto } from './dto/filtro.input.dto';

@ApiTags('[finanzas] Movimientos')
@Controller('movimientos')
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: MovimientoResponseDto })
  async get(@Query() query: FiltroInputDto) {
    return dataResponseFormat(await this.movimientosService.get(query));
  }
}
