import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { ContactoMensajeDto } from './dto/contacto.input.dto';
import { InfoService } from '../info/info.service';

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

  async getInformacionContacto() {
    // Obtener información desde la base de datos usando el servicio
    const informacionCompleta = await this.obtenerParaPublico();

    // Formatear la información para el formato esperado por el frontend
    const informacionFormateada = {
      telefonos: [
        informacionCompleta.telefono1,
        ...(informacionCompleta.telefono2 ? [informacionCompleta.telefono2] : []),
      ].filter(Boolean),
      email: informacionCompleta.email,
      direccion: `${informacionCompleta.direccionCompleta}, ${informacionCompleta.ciudad}`,
      horarios: {
        lunes_viernes: informacionCompleta.horarioLunesViernes,
        sabado: informacionCompleta.horarioSabado,
        domingo: informacionCompleta.horarioDomingo,
      },
      redesSociales: {
        ...(informacionCompleta.facebook && { facebook: informacionCompleta.facebook }),
        ...(informacionCompleta.instagram && { instagram: informacionCompleta.instagram }),
        ...(informacionCompleta.whatsapp && { whatsapp: informacionCompleta.whatsapp }),
        ...(informacionCompleta.tiktok && { tiktok: informacionCompleta.tiktok }),
        ...(informacionCompleta.youtube && { youtube: informacionCompleta.youtube }),
        ...(informacionCompleta.website && { website: informacionCompleta.website }),
      },
      informacionAdicional:
        informacionCompleta.informacionAdicional ||
        'Contamos con los mejores productos y servicios para tu mascota.',
    };

    return {
      error: false,
      message: 'Información de contacto obtenida exitosamente',
      response: { data: informacionFormateada },
      status: 200,
    };
  }

  async obtenerParaPublico() {
    // Retornar datos por defecto
    const datosDefault = {
      nombre: 'PetStore - Tu Tienda de Mascotas',
      email: 'contacto@petstore.com',
      telefono1: '+591 2 2345678',
      telefono2: '+591 76543210',
      whatsapp: '+59176543210',
      direccionCompleta: 'Av. 6 de Agosto #1234',
      ciudad: 'La Paz, Bolivia',
      horarioLunesViernes: '8:00-19:00',
      horarioSabado: '8:00-17:00',
      horarioDomingo: '9:00-15:00',
      facebook: '@PetStoreLaPaz',
      instagram: '@petstore_oficial',
      tiktok: '@petstore_pets',
      youtube: '@PetStoreOficial',
      website: 'https://petstore.com',
      informacionAdicional:
        'Contamos con servicio de entrega a domicilio gratuita para compras mayores a 100 Bs. También ofrecemos servicios veterinarios y de peluquería canina.',
    };

    return datosDefault;
  }
}
