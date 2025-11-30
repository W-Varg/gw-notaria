import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { BancoService } from './banco.service';
import { CreateBancoDto, UpdateBancoDto, ListBancoArgsDto } from './dto/banco.input.dto';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginateBancosType,
  ResponseBancoType,
  ResponseBancoDetailType,
  ResponseBancosType,
} from './dto/banco.response';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';

@ApiTags('[admin] Bancos')
@Controller('bancos')
export class BancoController {
  constructor(private readonly bancoService: BancoService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.BANCOS_CREAR])
  @ApiDescription('Crear un nuevo banco', [PermisoEnum.BANCOS_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseBancoType })
  create(@Body() inputDto: CreateBancoDto) {
    return this.bancoService.create(inputDto);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.BANCOS_VER])
  @ApiDescription('Listar todos los bancos', [PermisoEnum.BANCOS_VER])
  @ApiResponse({ type: ResponseBancosType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.bancoService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.BANCOS_VER])
  @ApiDescription('Servicio post con filtros y paginado de bancos', [PermisoEnum.BANCOS_VER])
  @ApiResponse({ status: 200, type: () => PaginateBancosType })
  list(@Body() inputDto: ListBancoArgsDto) {
    return this.bancoService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.BANCOS_VER])
  @ApiResponse({ status: 200, type: () => ResponseBancoDetailType })
  @ApiDescription('Obtener un banco por ID', [PermisoEnum.BANCOS_VER])
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bancoService.findOne(id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.BANCOS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseBancoType })
  @ApiDescription('Actualizar un banco por ID', [PermisoEnum.BANCOS_EDITAR])
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBancoDto: UpdateBancoDto) {
    return this.bancoService.update(id, updateBancoDto);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.BANCOS_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseBancoType })
  @ApiDescription('Eliminar un banco por ID', [PermisoEnum.BANCOS_ELIMINAR])
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bancoService.remove(id);
  }
}
