import { Injectable } from '@nestjs/common';
import { CreateClienteDto, UpdateClienteDto, ListClienteArgsDto } from './dto/cliente.input.dto';
import { PrismaService } from 'src/global/database/prisma.service';
import {
  dataErrorValidations,
  dataResponseError,
  dataResponseSuccess,
} from 'src/common/dtos/response.dto';
import { Prisma } from 'src/generated/prisma/client';
import { ClienteEntity } from './cliente.entity';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { IToken } from 'src/common/decorators/token.decorator';
import { TipoClienteEnum } from 'src/enums/tipo-cliente.enum';

@Injectable()
export class ClienteService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreateClienteDto, session: IToken) {
    // Validar correo único
    const emailExists = await this.prismaService.cliente.findFirst({
      where: { email: inputDto.email },
      select: { id: true },
    });
    if (emailExists)
      return dataErrorValidations({ email: ['El correo electrónico ya está registrado'] });

    // Validar que se proporcionen los datos específicos según el tipo
    if (inputDto.tipo === TipoClienteEnum.NATURAL && !inputDto.personaNatural) {
      return dataErrorValidations({
        personaNatural: ['Debe proporcionar los datos de persona natural'],
      });
    }
    if (inputDto.tipo === TipoClienteEnum.JURIDICA && !inputDto.personaJuridica) {
      return dataErrorValidations({
        personaJuridica: ['Debe proporcionar los datos de persona jurídica'],
      });
    }

    // Validar CI único si se proporciona
    if (inputDto.personaNatural?.numeroDocumento) {
      const ciExists = await this.prismaService.personaNatural.findUnique({
        where: { numeroDocumento: inputDto.personaNatural.numeroDocumento },
        select: { clienteId: true },
      });
      if (ciExists)
        return dataErrorValidations({ 'personaNatural.ci': ['El CI ya está registrado'] });
    }

    // Validar NIT único si se proporciona
    if (inputDto.personaJuridica?.nit) {
      const nitExists = await this.prismaService.personaJuridica.findUnique({
        where: { nit: inputDto.personaJuridica.nit },
        select: { clienteId: true },
      });
      if (nitExists)
        return dataErrorValidations({ 'personaJuridica.nit': ['El NIT ya está registrado'] });
    }

    const result = await this.prismaService.cliente.create({
      data: {
        tipo: inputDto.tipo,
        email: inputDto.email,
        telefono: inputDto.telefono,
        direccion: inputDto.direccion,
        userCreateId: session.usuarioId,
        ...(inputDto.tipo === TipoClienteEnum.NATURAL && {
          personaNatural: {
            create: {
              ...inputDto.personaNatural,
              userCreateId: session.usuarioId,
            },
          },
        }),
        ...(inputDto.tipo === TipoClienteEnum.JURIDICA && {
          personaJuridica: {
            create: {
              ...inputDto.personaJuridica,
              userCreateId: session.usuarioId,
            },
          },
        }),
      },
      include: {
        personaNatural: true,
        personaJuridica: true,
      },
    });

    return dataResponseSuccess<ClienteEntity>({ data: result });
  }

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [list, total] = await Promise.all([
      this.prismaService.cliente.findMany({
        skip,
        take,
        orderBy,
        include: {
          personaNatural: true,
          personaJuridica: true,
        },
      }),
      pagination ? this.prismaService.cliente.count() : undefined,
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess<ClienteEntity[]>({
      data: list,
      pagination,
    });
  }

  async filter(inputDto: ListClienteArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const { tipo, email, telefono, direccion } = inputDto.where || {};
    const whereInput: Prisma.ClienteWhereInput = {};

    if (tipo) whereInput.tipo = tipo;
    if (email) whereInput.email = email;
    if (telefono) whereInput.telefono = telefono;
    if (direccion) whereInput.direccion = direccion;

    const [list, total] = await Promise.all([
      this.prismaService.cliente.findMany({
        where: whereInput,
        skip,
        take,
        orderBy,
        include: {
          personaNatural: true,
          personaJuridica: true,
        },
      }),
      this.prismaService.cliente.count({ where: whereInput }),
    ]);

    return dataResponseSuccess<ClienteEntity[]>({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  async findOne(id: string) {
    const item = await this.prismaService.cliente.findUnique({
      where: { id },
      include: {
        personaNatural: true,
        personaJuridica: true,
      },
    });
    if (!item) return dataResponseError('Cliente no encontrado');
    return dataResponseSuccess<ClienteEntity>({ data: item });
  }

  async update(id: string, updateDto: UpdateClienteDto, session: IToken) {
    const exists = await this.prismaService.cliente.findUnique({
      where: { id },
      select: { id: true, tipo: true },
    });
    if (!exists) return dataResponseError('Cliente no encontrado');

    // Validar correo único si se cambia
    if (updateDto.email) {
      const emailDup = await this.prismaService.cliente.findFirst({
        where: {
          email: updateDto.email,
          NOT: { id },
        },
        select: { id: true },
      });
      if (emailDup)
        return dataErrorValidations({ email: ['El correo electrónico ya está registrado'] });
    }

    // Validar CI único si se actualiza
    if (updateDto.personaNatural?.numeroDocumento) {
      const ciExists = await this.prismaService.personaNatural.findFirst({
        where: {
          numeroDocumento: updateDto.personaNatural.numeroDocumento,
          NOT: { clienteId: id },
        },
        select: { clienteId: true },
      });
      if (ciExists)
        return dataErrorValidations({ 'personaNatural.ci': ['El CI ya está registrado'] });
    }

    // Validar NIT único si se actualiza
    if (updateDto.personaJuridica?.nit) {
      const nitExists = await this.prismaService.personaJuridica.findFirst({
        where: {
          nit: updateDto.personaJuridica.nit,
          NOT: { clienteId: id },
        },
        select: { clienteId: true },
      });
      if (nitExists)
        return dataErrorValidations({ 'personaJuridica.nit': ['El NIT ya está registrado'] });
    }

    const result = await this.prismaService.cliente.update({
      where: { id },
      data: {
        tipo: updateDto.tipo,
        email: updateDto.email,
        telefono: updateDto.telefono,
        direccion: updateDto.direccion,
        userUpdateId: session.usuarioId,
        ...(updateDto.personaNatural && {
          personaNatural: {
            update: {
              ...updateDto.personaNatural,
              userUpdateId: session.usuarioId,
            },
          },
        }),
        ...(updateDto.personaJuridica && {
          personaJuridica: {
            update: {
              ...updateDto.personaJuridica,
              userUpdateId: session.usuarioId,
            },
          },
        }),
      },
      include: {
        personaNatural: true,
        personaJuridica: true,
      },
    });

    return dataResponseSuccess<ClienteEntity>({ data: result });
  }

  async remove(id: string) {
    const exists = await this.prismaService.cliente.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Cliente no encontrado');

    await this.prismaService.cliente.delete({ where: { id } });
    return dataResponseSuccess({ data: 'Cliente eliminado' });
  }
}
