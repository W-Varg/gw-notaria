import { Injectable } from '@nestjs/common';
import {
  CreatePagosIngresosDto,
  UpdatePagosIngresosDto,
  ListPagosIngresosArgsDto,
} from './dto/pagos-ingresos.input.dto';
import { PrismaService } from '../../../../global/database/prisma.service';

import {
  dataErrorValidations,
  dataResponseError,
  dataResponseSuccess,
} from '../../../../common/dtos/response.dto';
import { Prisma } from '../../../../generated/prisma/client';
import { PagosIngresos } from './pagos-ingresos.entity';
import { paginationParamsFormat } from '../../../../helpers/prisma.helper';
import { ListFindAllQueryDto } from '../../../../common/dtos/filters.dto';
import { IToken } from '../../../../common/decorators/token.decorator';
import { PdfService } from '../../../pdf/pdf.service';

@Injectable()
export class PagosIngresosService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly _pdfService: PdfService,
  ) {}

  async create(inputDto: CreatePagosIngresosDto, session: IToken) {
    // Validar servicio si se proporciona
    if (inputDto.servicioId) {
      const servicioExists = await this.prismaService.servicio.findUnique({
        where: { id: inputDto.servicioId },
        select: { id: true, saldoPendiente: true },
      });
      if (!servicioExists) return dataErrorValidations({ servicioId: ['El servicio no existe'] });
    }

    // Validar cuenta bancaria si se proporciona
    if (inputDto.cuentaBancariaId) {
      const cuentaExists = await this.prismaService.cuentaBancaria.findUnique({
        where: { id: inputDto.cuentaBancariaId },
        select: { id: true },
      });
      if (!cuentaExists)
        return dataErrorValidations({ cuentaBancariaId: ['La cuenta bancaria no existe'] });
    }

    // Validar usuario de registro si se proporciona
    if (inputDto.usuarioRegistroId) {
      const usuarioExists = await this.prismaService.usuario.findUnique({
        where: { id: inputDto.usuarioRegistroId },
        select: { id: true },
      });
      if (!usuarioExists)
        return dataErrorValidations({ usuarioRegistroId: ['El usuario de registro no existe'] });
    }

    const result = await this.prismaService.pagosIngresos.create({
      data: {
        ...inputDto,
        usuarioRegistroId: inputDto.usuarioRegistroId || session.usuarioId,
      },
      include: {
        servicio: true,
        cuentaBancaria: true,
        usuarioRegistro: true,
      },
    });

    // Actualizar saldo pendiente del servicio si aplica
    if (inputDto.servicioId) {
      await this.prismaService.servicio.update({
        where: { id: inputDto.servicioId },
        data: {
          saldoPendiente: {
            decrement: inputDto.monto,
          },
        },
      });
    }

    return dataResponseSuccess<PagosIngresos>({ data: result });
  }

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [list, total] = await Promise.all([
      this.prismaService.pagosIngresos.findMany({
        skip,
        take,
        orderBy,
        include: {
          servicio: true,
          cuentaBancaria: true,
          usuarioRegistro: true,
        },
      }),
      pagination ? this.prismaService.pagosIngresos.count() : undefined,
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess<PagosIngresos[]>({
      data: list,
      pagination,
    });
  }

  async filter(inputDto: ListPagosIngresosArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const {
      servicioId,
      monto,
      tipoPago,
      cuentaBancariaId,
      constanciaTipo,
      numeroConstancia,
      usuarioRegistroId,
    } = inputDto.where || {};
    const whereInput: Prisma.PagosIngresosWhereInput = {};

    if (servicioId) whereInput.servicioId = servicioId;
    if (monto !== undefined) whereInput.monto = monto;
    if (tipoPago) whereInput.tipoPago = tipoPago;
    if (cuentaBancariaId) whereInput.cuentaBancariaId = cuentaBancariaId;
    if (constanciaTipo) whereInput.constanciaTipo = constanciaTipo;
    if (numeroConstancia) whereInput.numeroConstancia = numeroConstancia;
    if (usuarioRegistroId) whereInput.usuarioRegistroId = usuarioRegistroId;

    const [list, total] = await Promise.all([
      this.prismaService.pagosIngresos.findMany({
        where: whereInput,
        skip,
        take,
        orderBy,
        include: {
          servicio: true,
          cuentaBancaria: true,
          usuarioRegistro: true,
        },
      }),
      this.prismaService.pagosIngresos.count({ where: whereInput }),
    ]);

    return dataResponseSuccess<PagosIngresos[]>({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  async findOne(id: number) {
    const item = await this.prismaService.pagosIngresos.findUnique({
      where: { id },
      include: {
        servicio: true,
        cuentaBancaria: true,
        usuarioRegistro: true,
      },
    });
    if (!item) return dataResponseError('Pago/Ingreso no encontrado');
    return dataResponseSuccess<PagosIngresos>({ data: item });
  }

  async update(id: number, updateDto: UpdatePagosIngresosDto, session: IToken) {
    const exists = await this.prismaService.pagosIngresos.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Pago/Ingreso no encontrado');

    // Validar servicio si se actualiza
    if (updateDto.servicioId) {
      const servicioExists = await this.prismaService.servicio.findUnique({
        where: { id: updateDto.servicioId },
        select: { id: true },
      });
      if (!servicioExists) return dataResponseError('El servicio no existe');
    }

    // Validar cuenta bancaria si se actualiza
    if (updateDto.cuentaBancariaId) {
      const cuentaExists = await this.prismaService.cuentaBancaria.findUnique({
        where: { id: updateDto.cuentaBancariaId },
        select: { id: true },
      });
      if (!cuentaExists) return dataResponseError('La cuenta bancaria no existe');
    }

    const result = await this.prismaService.pagosIngresos.update({
      where: { id },
      data: updateDto,
      include: {
        servicio: true,
        cuentaBancaria: true,
        usuarioRegistro: true,
      },
    });

    return dataResponseSuccess<PagosIngresos>({ data: result });
  }

  async remove(id: number) {
    const exists = await this.prismaService.pagosIngresos.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Pago/Ingreso no encontrado');

    await this.prismaService.pagosIngresos.delete({ where: { id } });
    return dataResponseSuccess({ data: 'Pago/Ingreso eliminado' });
  }

  getRecibo() {
    // TODO: viculra con ventas de servicios
    const infoSucursal = [
      ['URBANIZACIÓN: ', 'va1'],
      ['CALLE: ', 'va2'],
      ['NRO: ', 'va3'],
      ['TELEFONO: ', 'va4'],
    ];

    const data = {
      nombreNotaria: 'Notaria 69',
      infoSucursal: infoSucursal.map((v) => v.join('')).join(', '),

      telefono: `Teléfono: ${12321312}`,
      numeroRecibo: `N° Recibo: ${2323}`,
      fecha: `Fecha: ${'15/11/2025'}`,
      nitOCi: `NIT/CI: ${'5677567567'}`,
      nombreCliente: `Nombre: ${'NombreClien'}`,
      detalle: [],
      centavos: 33,

      subtotal: `Subtotal:  ${100}`,
      descuento: `Descuento:  ${0}`,
      total: `Total:  ${100}`,
      totalLiteral: `Son: ${'00'}/100 Bolivinos`,

      items: [
        {
          descripcion: 'Producto A - Cable USB 1 metro',
          cantidad: 2,
          precio: 15.5,
          um: 'PZA',
        },
        {
          descripcion: 'Producto B - Adaptador HDMI',
          cantidad: 1,
          precio: 25.0,
          um: 'PZA',
        },
      ],
    };

    const anchoPagina = 226;

    const detalleBody = data.items.flatMap((item) => [
      // fila descripción (ocupa toda la fila)
      [{ colSpan: 4, text: item.descripcion }, {}, {}, {}],
      // fila con valores
      [
        { text: item.cantidad.toString(), alignment: 'center' },
        { text: item.precio.toFixed(2), alignment: 'right' },
        { text: item.um, alignment: 'right' },
        { text: (item.cantidad * item.precio).toFixed(2), alignment: 'right' },
      ],
    ]);

    const body = [
      // TITULOS
      ['CANT.', 'P.UNIT.', 'U.M.', 'SUBTOTAL'],
      [{ colSpan: 4, stack: [this.separador(anchoPagina)] }, {}, {}, {}],
      ...detalleBody,
      // totalRow,
    ];

    const documento: Parameters<typeof this._pdfService.generarPdf>[0] = {
      pageSize: { width: anchoPagina, height: 'auto' },
      pageMargins: [10, 10, 10, 10],
      defaultStyle: {
        fontSize: 10,
        columnGap: 5,
      },
      content: [
        {
          text: data.nombreNotaria,
          bold: true,
          fontSize: 12,
          alignment: 'center',
        },
        {
          text: 'Casa Matriz',
          alignment: 'center',
        },
        {
          text: 'No, Punto de Venta 0', // TODO: de donde sacar
          alignment: 'center',
        },
        {
          text: data.infoSucursal,
          alignment: 'center',
        },
        {
          text: data.telefono,
          alignment: 'center',
        },
        {
          text: 'Santa Cruz - Bolivia',
          alignment: 'center',
        },
        {
          text: 'RECIBO',
          bold: true,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 10, 0, 0],
        },

        this.separador(anchoPagina),

        {
          text: data.numeroRecibo,
          alignment: 'center',
        },

        this.separador(anchoPagina),

        {
          columns: [
            {
              width: '*',
              text: data.fecha,
              alignment: 'left',
            },
            {
              width: '*',
              text: data.nitOCi,
              alignment: 'right',
            },
          ],
          margin: [0, 5, 0, 5],
        },
        {
          text: data.nombreCliente,
        },

        this.separador(anchoPagina),

        {
          table: {
            widths: ['*', 'auto', 'auto', 'auto'],
            body: body,
          },
          layout: 'noBorders',
        },

        this.separador(anchoPagina),

        {
          text: data.subtotal,
          alignment: 'right',
        },
        {
          text: data.descuento,
          alignment: 'right',
        },
        {
          text: data.total,
          alignment: 'right',
        },

        {
          text: data.totalLiteral,
        },

        {
          text: '¡GRACIAS, VUELVA PRONTO!',
          alignment: 'center',
        },
      ],
    };

    return this._pdfService.generarPdf(documento);
  }

  private separador(anchoPagina: number) {
    return {
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: anchoPagina - 20,
          y2: 0,
          lineWidth: 1,
          dash: { length: 5, space: 3 },
        },
      ],
      margin: [0, 5, 0, 5],
    };
  }
}
