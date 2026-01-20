import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto, UpdateFaqDto, ListFaqArgsDto } from './dto/faq.input.dto';
import { ApiDescription } from '../../../common/decorators/controller.decorator';
import { PermisoEnum } from '../../../enums/permisos.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateFaqsType, ResponseFaqType, ResponseFaqsType } from './dto/faq.response';
import { BearerAuthPermision } from '../../../common/decorators/authorization.decorator';
import { CommonParamsDto } from '../../../common/dtos/common-params.dto';
import { ListFindAllQueryDto } from '../../../common/dtos/filters.dto';
import { Audit } from '../../../common/decorators/audit.decorator';
import { AuditInterceptor } from '../../../common/interceptors/audit.interceptor';
import { TipoAccionEnum } from '../../../enums/tipo-accion.enum';
import { AuthUser, IToken } from '../../../common/decorators/token.decorator';

@ApiTags('[admin] FAQs')
@Controller('faqs')
@UseInterceptors(AuditInterceptor)
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.FAQS_CREAR])
  @ApiDescription('Crear una nueva FAQ', [PermisoEnum.FAQS_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseFaqType })
  @Audit({ accion: TipoAccionEnum.CREATE, modulo: 'faqs', tabla: 'logs_audit_logs' })
  create(@Body() inputDto: CreateFaqDto, @AuthUser() sesion: IToken) {
    return this.faqService.create(inputDto, sesion);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.FAQS_VER])
  @ApiDescription('Listar todas las FAQs', [PermisoEnum.FAQS_VER])
  @ApiResponse({ status: 200, type: ResponseFaqsType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.faqService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.FAQS_VER])
  @ApiDescription('Servicio post con filtros y paginado de FAQs', [PermisoEnum.FAQS_VER])
  @ApiResponse({ status: 200, type: () => PaginateFaqsType })
  list(@Body() inputDto: ListFaqArgsDto) {
    return this.faqService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.FAQS_VER])
  @ApiResponse({ status: 200, type: () => ResponseFaqType })
  @ApiDescription('Obtener una FAQ por ID', [PermisoEnum.FAQS_VER])
  findOne(@Param() params: CommonParamsDto.IdUuid) {
    return this.faqService.findOne(params.id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.FAQS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseFaqType })
  @ApiDescription('Actualizar una FAQ por ID', [PermisoEnum.FAQS_EDITAR])
  @Audit({ accion: TipoAccionEnum.UPDATE, modulo: 'faqs', tabla: 'logs_audit_logs' })
  update(@Param() params: CommonParamsDto.IdUuid, @Body() updateDto: UpdateFaqDto) {
    return this.faqService.update(params.id, updateDto);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.FAQS_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseFaqType })
  @ApiDescription('Eliminar una FAQ por ID', [PermisoEnum.FAQS_ELIMINAR])
  @Audit({ accion: TipoAccionEnum.DELETE, modulo: 'faqs', tabla: 'logs_audit_logs' })
  remove(@Param() params: CommonParamsDto.IdUuid) {
    return this.faqService.remove(params.id);
  }
}
