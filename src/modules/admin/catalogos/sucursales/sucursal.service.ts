import { Injectable } from '@nestjs/common';
import { IToken } from '../../../../common/decorators/token.decorator';
import { ListFindAllQueryDto } from '../../../../common/dtos/filters.dto';
import {
  CreateSucursalDto,
  UpdateSucursalDto,
  ListSucursalArgsDto,
} from './dto/sucursal.input.dto';
import { SucursalEntity } from './sucursal.entity';
import { PrismaService } from '../../../../global/database/prisma.service';
import {
  dataErrorValidations,
  dataResponseError,
  dataResponseSuccess,
} from '../../../../common/dtos';
import { paginationParamsFormat } from '../../../../helpers/prisma.helper';

@Injectable()
export class SucursalService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreateSucursalDto, session: IToken) {
    // Validar que el nombre sea único
    const existeNombre = await this.prismaService.sucursal.findUnique({
      where: { nombre: inputDto.nombre },
      select: { id: true },
    });
    if (existeNombre)
      return dataErrorValidations({ nombre: ['El nombre de la sucursal ya existe'] });

    // Validar que la abreviación sea única
    const existeAbreviacion = await this.prismaService.sucursal.findUnique({
      where: { abreviacion: inputDto.abreviacion },
      select: { id: true },
    });
    if (existeAbreviacion)
      return dataErrorValidations({ abreviacion: ['La abreviación de la sucursal ya existe'] });

    const result = await this.prismaService.sucursal.create({
      data: {
        ...inputDto,
        userCreateId: session.usuarioId,
      },
    });

    return dataResponseSuccess<SucursalEntity>({ data: result });
  }

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [list, total] = await Promise.all([
      this.prismaService.sucursal.findMany({
        skip,
        take,
        orderBy,
      }),
      pagination ? this.prismaService.sucursal.count() : undefined,
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess<SucursalEntity[]>({
      data: list,
      pagination,
    });
  }

  async filter(inputDto: ListSucursalArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const { where, select } = inputDto;

    const whereInput: any = {};

    // Aplicar filtros
    if (where?.nombre) whereInput.nombre = where.nombre;
    if (where?.abreviacion) whereInput.abreviacion = where.abreviacion;
    if (where?.departamento) whereInput.departamento = where.departamento;
    if (where?.telefono) whereInput.telefono = where.telefono;
    if (where?.email) whereInput.email = where.email;
    if (where?.estaActiva) whereInput.estaActiva = where.estaActiva;

    const [list, total] = await Promise.all([
      this.prismaService.sucursal.findMany({
        skip,
        take,
        where: whereInput,
        orderBy,
        select: select || undefined,
      }),
      pagination
        ? this.prismaService.sucursal.count({
            where: whereInput,
          })
        : undefined,
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess({
      data: list,
      pagination,
    });
  }

  async findOne(id: number) {
    const item = await this.prismaService.sucursal.findUnique({
      where: { id },
    });

    if (!item) return dataResponseError('Sucursal no encontrada');

    return dataResponseSuccess<SucursalEntity>({ data: item });
  }

  async update(id: number, updateDto: UpdateSucursalDto, session: IToken) {
    const exists = await this.prismaService.sucursal.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Sucursal no encontrada');

    // Validar nombre único si se actualiza
    if (updateDto.nombre) {
      const existeNombre = await this.prismaService.sucursal.findFirst({
        where: {
          nombre: updateDto.nombre,
          NOT: { id },
        },
        select: { id: true },
      });
      if (existeNombre)
        return dataErrorValidations({ nombre: ['El nombre de la sucursal ya existe'] });
    }

    // Validar abreviación única si se actualiza
    if (updateDto.abreviacion) {
      const existeAbreviacion = await this.prismaService.sucursal.findFirst({
        where: {
          abreviacion: updateDto.abreviacion,
          NOT: { id },
        },
        select: { id: true },
      });
      if (existeAbreviacion)
        return dataErrorValidations({ abreviacion: ['La abreviación de la sucursal ya existe'] });
    }

    const result = await this.prismaService.sucursal.update({
      where: { id },
      data: {
        ...updateDto,
        userUpdateId: session.usuarioId,
      },
    });

    return dataResponseSuccess<SucursalEntity>({ data: result });
  }

  async remove(id: number) {
    const exists = await this.prismaService.sucursal.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Sucursal no encontrada');

    const result = await this.prismaService.sucursal.delete({
      where: { id },
    });

    return dataResponseSuccess<SucursalEntity>({ data: result });
  }

  // Método adicional para obtener sucursales para select/dropdown
  async getForSelect() {
    const list = await this.prismaService.sucursal.findMany({
      where: { estaActiva: true },
      select: {
        id: true,
        nombre: true,
        abreviacion: true,
      },
      orderBy: { nombre: 'asc' },
    });

    return dataResponseSuccess({ data: list });
  }
}
