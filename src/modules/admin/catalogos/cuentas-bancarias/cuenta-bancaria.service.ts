import { Injectable } from '@nestjs/common';
import {
  CreateCuentaBancariaDto,
  UpdateCuentaBancariaDto,
  ListCuentaBancariaArgsDto,
} from './dto/cuenta-bancaria.input.dto';
import { PrismaService } from '../../../../global/database/prisma.service';
import {
  dataErrorValidations,
  dataResponseError,
  dataResponseSuccess,
} from '../../../../common/dtos/response.dto';
import { Prisma } from '../../../../generated/prisma/client';
import { CuentaBancaria } from './cuenta-bancaria.entity';
import { paginationParamsFormat } from '../../../../helpers/prisma.helper';
import { ListFindAllQueryDto } from '../../../../common/dtos/filters.dto';
import { IToken } from '../../../../common/decorators/token.decorator';

@Injectable()
export class CuentaBancariaService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreateCuentaBancariaDto, session: IToken) {
    // Verificar que el banco existe
    const bancoExists = await this.prismaService.banco.findUnique({
      where: { id: inputDto.bancoId },
      select: { id: true },
    });
    if (!bancoExists) return dataErrorValidations({ bancoId: ['El banco no existe'] });

    // Verificar que no exista una cuenta con el mismo número
    const exists = await this.prismaService.cuentaBancaria.findFirst({
      where: { numeroCuenta: inputDto.numeroCuenta },
      select: { id: true },
    });
    if (exists)
      return dataErrorValidations({
        numeroCuenta: ['Ya existe una cuenta bancaria con ese número'],
      });

    const result = await this.prismaService.cuentaBancaria.create({
      data: {
        ...inputDto,
        userCreateId: session.usuarioId,
      },
      include: { banco: true },
    });
    return dataResponseSuccess<CuentaBancaria>({ data: result });
  }

  /**
   * Obtener todas las cuentas bancarias con paginación
   * @param query parámetros de paginación, ordenamiento y filtrado
   * @returns una respuesta con la lista de cuentas bancarias y la paginación
   */

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    // Ejecutar queries en paralelo cuando sea necesario
    const [list, total] = await Promise.all([
      this.prismaService.cuentaBancaria.findMany({
        skip,
        take,
        orderBy,
        include: { banco: true },
      }),
      pagination ? this.prismaService.cuentaBancaria.count() : undefined,
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess<CuentaBancaria[]>({
      data: list,
      pagination,
    });
  }

  async getForSelect() {
    const list = await this.prismaService.cuentaBancaria.findMany({
      select: {
        id: true,
        numeroCuenta: true,
        tipoCuenta: true,
        banco: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    return dataResponseSuccess({
      data: list,
    });
  }

  async filter(inputDto: ListCuentaBancariaArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const { numeroCuenta, tipoCuenta } = inputDto.where || {};
    const whereInput: Prisma.CuentaBancariaWhereInput = {};

    if (numeroCuenta) {
      whereInput.numeroCuenta = {
        contains: numeroCuenta.contains || '',
        mode: 'insensitive',
      };
    }

    if (tipoCuenta) {
      whereInput.tipoCuenta = {
        contains: tipoCuenta.contains || '',
        mode: 'insensitive',
      };
    }

    const [list, total] = await Promise.all([
      this.prismaService.cuentaBancaria.findMany({
        where: whereInput,
        skip,
        take,
        orderBy,
        include: { banco: true },
      }),
      this.prismaService.cuentaBancaria.count({ where: whereInput }),
    ]);

    return dataResponseSuccess<CuentaBancaria[]>({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  async findOne(id: number) {
    const item = await this.prismaService.cuentaBancaria.findUnique({
      where: { id },
      include: { banco: true },
    });
    if (!item) return dataResponseError('Cuenta bancaria no encontrada');
    return dataResponseSuccess<CuentaBancaria>({ data: item });
  }

  async update(id: number, updateCuentaBancariaDto: UpdateCuentaBancariaDto, session: IToken) {
    const exists = await this.prismaService.cuentaBancaria.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Cuenta bancaria no encontrada');

    // Si se actualiza el bancoId, verificar que el banco existe
    if (updateCuentaBancariaDto.bancoId) {
      const bancoExists = await this.prismaService.banco.findUnique({
        where: { id: updateCuentaBancariaDto.bancoId },
        select: { id: true },
      });
      if (!bancoExists) return dataErrorValidations({ bancoId: ['El banco no existe'] });
    }

    // Si se actualiza el número de cuenta, verificar que no exista otro con ese número
    if (updateCuentaBancariaDto.numeroCuenta) {
      const numberExists = await this.prismaService.cuentaBancaria.findFirst({
        where: { numeroCuenta: updateCuentaBancariaDto.numeroCuenta, id: { not: id } },
        select: { id: true },
      });
      if (numberExists)
        return dataErrorValidations({ numeroCuenta: ['Ya existe una cuenta con ese número'] });
    }

    const result = await this.prismaService.cuentaBancaria.update({
      where: { id },
      data: {
        ...updateCuentaBancariaDto,
        userUpdateId: session.usuarioId,
      },
      include: { banco: true },
    });

    return dataResponseSuccess<CuentaBancaria>({ data: result });
  }

  async remove(id: number) {
    // Verificar si existe al menos un pago o transacción asociada
    const hasPayments = await this.prismaService.pagosIngresos.count({
      where: { cuentaBancariaId: id },
    });

    const hasTransactions = await this.prismaService.transaccionesEgresos.count({
      where: { cuentaBancariaId: id },
    });

    if (hasPayments > 0 || hasTransactions > 0) {
      return dataResponseError(
        'La cuenta bancaria tiene movimientos asociados (pagos o transacciones)',
      );
    }

    const exists = await this.prismaService.cuentaBancaria.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Cuenta bancaria no encontrada');

    await this.prismaService.cuentaBancaria.delete({ where: { id } });
    return dataResponseSuccess({ data: 'Cuenta bancaria eliminada' });
  }
}
