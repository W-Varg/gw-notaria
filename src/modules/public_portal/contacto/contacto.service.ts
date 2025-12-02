import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../global/database/prisma.service';
import { ContactoMensajeDto } from './dto/contacto.input.dto';

@Injectable()
export class ContactoService {
  constructor(private readonly prisma: PrismaService) {}

  async enviarMensaje(dto: ContactoMensajeDto) {
    const mensaje = await this.prisma.mensajeContacto.create({
      data: {
        nombre: dto.nombre,
        correo: dto.email,
        asunto: dto.asunto,
        mensaje: dto.mensaje,
        telefono: dto.telefono,
        categoria: 'consulta',
        estado: 'no_leido',
      },
    });

    return {
      error: false,
      message: 'Mensaje enviado correctamente. Te contactaremos pronto.',
      response: { data: mensaje },
      status: 201,
    };
  }
}
