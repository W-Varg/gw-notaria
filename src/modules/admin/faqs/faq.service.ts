import { Injectable } from '@nestjs/common';
import { CreateFaqDto, UpdateFaqDto, ListFaqArgsDto } from './dto/faq.input.dto';
import { PrismaService } from '../../../global/database/prisma.service';
import { dataResponseError, dataResponseSuccess } from 'src/common/dtos/response.dto';
import { Prisma } from 'src/generated/prisma/client';
import { Faq } from './faq.entity';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { ConfiguracionAplicacionClaveEnum } from 'src/enums/configuraciones.enum';
import { IToken } from 'src/common/decorators/token.decorator';

@Injectable()
export class FaqService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreateFaqDto, session: IToken) {
    // Crear el FAQ
    const faq = await this.prismaService.configuracionAplicacion.create({
      data: {
        clave: ConfiguracionAplicacionClaveEnum.FAQ,
        valor: JSON.stringify({
          pregunta: inputDto.pregunta,
          respuesta: inputDto.respuesta,
          categoria: inputDto.categoria,
          orden: inputDto.orden || 0,
          estaActiva: inputDto.estaActiva !== undefined ? inputDto.estaActiva : true,
        }),
        tipo: 'json',
        categoria: 'faqs',
        descripcion: inputDto.pregunta,
        userCreateId: session.usuarioId,
        esEditable: true,
      },
    });

    const faqData = this.parseFaqFromConfig(faq);
    return dataResponseSuccess<Faq>({ data: faqData });
  }

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [list, total] = await Promise.all([
      this.prismaService.configuracionAplicacion.findMany({
        where: {
          clave: ConfiguracionAplicacionClaveEnum.FAQ,
        },
        skip,
        take,
        orderBy: orderBy || { fechaCreacion: 'desc' },
      }),
      pagination
        ? this.prismaService.configuracionAplicacion.count({
            where: { clave: ConfiguracionAplicacionClaveEnum.FAQ },
          })
        : undefined,
    ]);

    const faqs = list.map((config) => this.parseFaqFromConfig(config));

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess<Faq[]>({
      data: faqs,
      pagination,
    });
  }

  async filter(inputDto: ListFaqArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const { pregunta, respuesta, categoria, orden, estaActiva } = inputDto.where || {};

    // Obtener todos los FAQs
    const allFaqs = await this.prismaService.configuracionAplicacion.findMany({
      where: {
        clave: ConfiguracionAplicacionClaveEnum.FAQ,
      },
    });

    // Parsear y filtrar en memoria (debido a que el filtro es sobre JSON)
    let faqs = allFaqs.map((config) => this.parseFaqFromConfig(config));

    // Aplicar filtros
    if (pregunta?.contains) {
      faqs = faqs.filter((faq) =>
        faq.pregunta.toLowerCase().includes(pregunta.contains.toLowerCase()),
      );
    }
    if (respuesta?.contains) {
      faqs = faqs.filter((faq) =>
        faq.respuesta.toLowerCase().includes(respuesta.contains.toLowerCase()),
      );
    }
    if (categoria?.contains) {
      faqs = faqs.filter(
        (faq) =>
          faq.categoria && faq.categoria.toLowerCase().includes(categoria.contains.toLowerCase()),
      );
    }
    if (orden?.equals !== undefined) {
      faqs = faqs.filter((faq) => faq.orden === orden.equals);
    }
    if (estaActiva?.equals !== undefined) {
      faqs = faqs.filter((faq) => faq.estaActiva === estaActiva.equals);
    }

    // Ordenar
    if (orderBy) {
      const [field, direction] = Object.entries(orderBy)[0] || ['orden', 'asc'];
      faqs.sort((a, b) => {
        const aVal = a[field] || '';
        const bVal = b[field] || '';
        return direction === 'asc' ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
      });
    } else {
      faqs.sort((a, b) => a.orden - b.orden);
    }

    const total = faqs.length;
    const paginatedFaqs = faqs.slice(skip, skip + take);

    return dataResponseSuccess<Faq[]>({
      data: paginatedFaqs,
      pagination: { ...pagination, total },
    });
  }

  async findOne(id: string) {
    const config = await this.prismaService.configuracionAplicacion.findUnique({
      where: { id },
    });

    if (!config || config.clave !== ConfiguracionAplicacionClaveEnum.FAQ) {
      return dataResponseError('FAQ no encontrada');
    }

    const faq = this.parseFaqFromConfig(config);
    return dataResponseSuccess<Faq>({ data: faq });
  }

  async update(id: string, updateDto: UpdateFaqDto) {
    const existing = await this.prismaService.configuracionAplicacion.findUnique({
      where: { id },
    });

    if (!existing || existing.clave !== ConfiguracionAplicacionClaveEnum.FAQ) {
      return dataResponseError('FAQ no encontrada');
    }

    const currentData = JSON.parse(existing.valor);
    const updatedData = {
      pregunta: updateDto.pregunta || currentData.pregunta,
      respuesta: updateDto.respuesta || currentData.respuesta,
      categoria: updateDto.categoria !== undefined ? updateDto.categoria : currentData.categoria,
      orden: updateDto.orden !== undefined ? updateDto.orden : currentData.orden,
      estaActiva:
        updateDto.estaActiva !== undefined ? updateDto.estaActiva : currentData.estaActiva,
    };

    const updated = await this.prismaService.configuracionAplicacion.update({
      where: { id },
      data: {
        valor: JSON.stringify(updatedData),
        descripcion: updatedData.pregunta,
      },
    });

    const faq = this.parseFaqFromConfig(updated);
    return dataResponseSuccess<Faq>({ data: faq });
  }

  async remove(id: string) {
    const existing = await this.prismaService.configuracionAplicacion.findUnique({
      where: { id },
    });

    if (!existing || existing.clave !== ConfiguracionAplicacionClaveEnum.FAQ) {
      return dataResponseError('FAQ no encontrada');
    }

    await this.prismaService.configuracionAplicacion.delete({
      where: { id },
    });

    return dataResponseSuccess({ data: { message: 'FAQ eliminada correctamente' } });
  }

  // ==================== HELPER METHODS ====================

  private parseFaqFromConfig(config: any): Faq {
    const data = JSON.parse(config.valor);
    return {
      id: config.id,
      pregunta: data.pregunta,
      respuesta: data.respuesta,
      categoria: data.categoria || null,
      orden: data.orden || 0,
      estaActiva: data.estaActiva !== undefined ? data.estaActiva : true,
      fechaCreacion: config.fechaCreacion,
      fechaActualizacion: config.fechaActualizacion,
    };
  }

  // ==================== MÉTODOS PÚBLICOS ====================

  async findAllActive(categoria?: string) {
    const allFaqs = await this.prismaService.configuracionAplicacion.findMany({
      where: {
        clave: ConfiguracionAplicacionClaveEnum.FAQ,
      },
      orderBy: {
        fechaCreacion: 'desc',
      },
    });

    let faqs = allFaqs
      .map((config) => this.parseFaqFromConfig(config))
      .filter((faq) => faq.estaActiva);

    if (categoria) {
      faqs = faqs.filter((faq) => faq.categoria === categoria);
    }

    // Ordenar por campo orden
    faqs.sort((a, b) => a.orden - b.orden);

    return faqs;
  }
}
