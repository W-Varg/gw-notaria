import { Injectable } from '@nestjs/common';
import { CreateBancoDto, UpdateBancoDto, ListBancoArgsDto } from './dto/banco.input.dto';
import { PrismaService } from 'src/global/database/prisma.service';
import {
  dataErrorValidations,
  dataResponseError,
  dataResponseSuccess,
} from 'src/common/dtos/response.dto';
import { Prisma } from 'src/generated/prisma/client';
import { Banco } from './banco.entity';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { IToken } from 'src/common/decorators/token.decorator';

@Injectable()
export class BancoService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreateBancoDto, session: IToken) {
    const exists = await this.prismaService.banco.findFirst({
      where: { nombre: inputDto.nombre },
      select: { id: true },
    });
    if (exists) return dataErrorValidations({ nombre: ['El banco ya existe'] });

    const result = await this.prismaService.banco.create({
      data: {
        ...inputDto,
        userCreateId: session.usuarioId,
      },
    });
    return dataResponseSuccess<Banco>({ data: result });
  }

  /**
   * Obtener todos los bancos con paginación
   * @param query parámetros de paginación, ordenamiento y filtrado
   * @returns una respuesta con la lista de bancos y la paginación
   */

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    // Ejecutar queries en paralelo cuando sea necesario
    const [list, total] = await Promise.all([
      this.prismaService.banco.findMany({
        skip,
        take,
        orderBy,
        include: { cuentasBancarias: true },
      }),
      pagination ? this.prismaService.banco.count() : undefined,
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess<Banco[]>({
      data: list,
      pagination,
    });
  }

  async filter(inputDto: ListBancoArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const { nombre } = inputDto.where || {};
    const whereInput: Prisma.BancoWhereInput = {};

    if (nombre) {
      whereInput.nombre = {
        contains: nombre.contains || '',
        mode: 'insensitive',
      };
    }

    const [list, total] = await Promise.all([
      this.prismaService.banco.findMany({
        where: whereInput,
        skip,
        take,
        orderBy,
        include: { cuentasBancarias: true },
      }),
      this.prismaService.banco.count({ where: whereInput }),
    ]);

    return dataResponseSuccess<Banco[]>({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  async findOne(id: number) {
    const item = await this.prismaService.banco.findUnique({
      where: { id },
      include: { cuentasBancarias: true },
    });
    if (!item) return dataResponseError('Banco no encontrado');
    return dataResponseSuccess<Banco>({ data: item });
  }

  async update(id: number, updateBancoDto: UpdateBancoDto, session: IToken) {
    const exists = await this.prismaService.banco.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Banco no encontrado');

    if (updateBancoDto.nombre) {
      const nameExists = await this.prismaService.banco.findFirst({
        where: { nombre: updateBancoDto.nombre, id: { not: id } },
        select: { id: true },
      });
      if (nameExists)
        return dataErrorValidations({ nombre: ['Ya existe un banco con ese nombre'] });
    }

    const result = await this.prismaService.banco.update({
      where: { id },
      data: {
        ...updateBancoDto,
        userUpdateId: session.usuarioId,
      },
    });

    return dataResponseSuccess<Banco>({ data: result });
  }

  async remove(id: number) {
    // Verificar si existe al menos una cuenta bancaria asociada
    const hasCuentas = await this.prismaService.cuentaBancaria.count({
      where: { bancoId: id },
    });

    if (hasCuentas > 0) {
      return dataResponseError('El banco tiene cuentas bancarias asociadas');
    }

    const exists = await this.prismaService.banco.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Banco no encontrado');

    await this.prismaService.banco.delete({ where: { id } });
    return dataResponseSuccess({ data: 'Banco eliminado' });
  }
}
