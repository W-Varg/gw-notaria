import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto, UpdateFaqDto, ListFaqArgsDto } from './dto/faq.input.dto';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateFaqsType, ResponseFaqType, ResponseFaqsType } from './dto/faq.response';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';

@ApiTags('[admin] FAQs')
@Controller('faqs')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.FAQS_CREAR])
  @ApiDescription('Crear una nueva FAQ', [PermisoEnum.FAQS_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseFaqType })
  create(@Body() inputDto: CreateFaqDto) {
    return this.faqService.create(inputDto);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.FAQS_VER])
  @ApiDescription('Listar todas las FAQs', [PermisoEnum.FAQS_VER])
  @ApiResponse({ type: ResponseFaqsType })
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
  findOne(@Param('id') id: string) {
    return this.faqService.findOne(id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.FAQS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseFaqType })
  @ApiDescription('Actualizar una FAQ por ID', [PermisoEnum.FAQS_EDITAR])
  update(@Param('id') id: string, @Body() updateDto: UpdateFaqDto) {
    return this.faqService.update(id, updateDto);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.FAQS_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseFaqType })
  @ApiDescription('Eliminar una FAQ por ID', [PermisoEnum.FAQS_ELIMINAR])
  remove(@Param('id') id: string) {
    return this.faqService.remove(id);
  }
}
