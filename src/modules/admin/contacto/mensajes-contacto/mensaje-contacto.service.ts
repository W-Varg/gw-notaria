import { Injectable } from '@nestjs/common';
import {
  CreateMensajeContactoDto,
  UpdateMensajeContactoDto,
  ListMensajeContactoArgsDto,
} from './dto/mensaje-contacto.input.dto';
import { PrismaService } from 'src/global/database/prisma.service';
import {
  dataErrorValidations,
  dataResponseError,
  dataResponseSuccess,
} from 'src/common/dtos/response.dto';
import { Prisma } from 'src/generated/prisma/client';
import { MensajeContacto } from './mensaje-contacto.entity';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { IToken } from 'src/common/decorators/token.decorator';

@Injectable()
export class MensajeContactoService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreateMensajeContactoDto, session?: IToken) {
    // Validar usuario si se proporciona
    if (inputDto.usuarioId) {
      const usuarioExists = await this.prismaService.usuario.findUnique({
        where: { id: inputDto.usuarioId },
        select: { id: true },
      });
      if (!usuarioExists) return dataErrorValidations({ usuarioId: ['El usuario no existe'] });
    }

    const result = await this.prismaService.mensajeContacto.create({
      data: {
        ...inputDto,
        userCreateId: session?.usuarioId,
      },
      include: {
        usuario: true,
      },
    });

    return dataResponseSuccess<MensajeContacto>({ data: result });
  }

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [list, total] = await Promise.all([
      this.prismaService.mensajeContacto.findMany({
        skip,
        take,
        orderBy,
        include: {
          usuario: true,
        },
      }),
      pagination ? this.prismaService.mensajeContacto.count() : undefined,
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess<MensajeContacto[]>({
      data: list,
      pagination,
    });
  }

  async filter(inputDto: ListMensajeContactoArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const { usuarioId, nombre, correo, asunto, categoria, estado } = inputDto.where || {};
    const whereInput: Prisma.MensajeContactoWhereInput = {};

    if (usuarioId) whereInput.usuarioId = usuarioId;
    if (nombre) whereInput.nombre = nombre;
    if (correo) whereInput.correo = correo;
    if (asunto) whereInput.asunto = asunto;
    if (categoria) whereInput.categoria = categoria;
    if (estado) whereInput.estado = estado;

    const [list, total] = await Promise.all([
      this.prismaService.mensajeContacto.findMany({
        where: whereInput,
        skip,
        take,
        orderBy,
        include: {
          usuario: true,
        },
      }),
      this.prismaService.mensajeContacto.count({ where: whereInput }),
    ]);

    return dataResponseSuccess<MensajeContacto[]>({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  async findOne(id: string) {
    const item = await this.prismaService.mensajeContacto.findUnique({
      where: { id },
      include: {
        usuario: true,
      },
    });
    if (!item) return dataResponseError('Mensaje de contacto no encontrado');
    return dataResponseSuccess<MensajeContacto>({ data: item });
  }

  async update(id: string, updateDto: UpdateMensajeContactoDto, session: IToken) {
    const exists = await this.prismaService.mensajeContacto.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Mensaje de contacto no encontrado');

    // Validar usuario si se actualiza
    if (updateDto.usuarioId) {
      const usuarioExists = await this.prismaService.usuario.findUnique({
        where: { id: updateDto.usuarioId },
        select: { id: true },
      });
      if (!usuarioExists) return dataResponseError('El usuario no existe');
    }

    const result = await this.prismaService.mensajeContacto.update({
      where: { id },
      data: {
        ...updateDto,
        userUpdateId: session.usuarioId,
      },
      include: {
        usuario: true,
      },
    });

    return dataResponseSuccess<MensajeContacto>({ data: result });
  }

  async remove(id: string) {
    const exists = await this.prismaService.mensajeContacto.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Mensaje de contacto no encontrado');

    await this.prismaService.mensajeContacto.delete({ where: { id } });
    return dataResponseSuccess({ data: 'Mensaje de contacto eliminado' });
  }
}
