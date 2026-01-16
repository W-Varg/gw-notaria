import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../global/database/prisma.service';

// import { CategoriaPublica } from './dto/public.response';
import { ContactoMensajeDto, FAQsDto } from './dto/public.input';
import { dataResponseSuccess } from 'src/common/dtos/response.dto';
import dayjs from 'dayjs';
import { ConfiguracionAplicacionClaveEnum } from 'src/enums/configuraciones.enum';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  // getCategorias(): Promise<CategoriaPublica[]> {
  //   return this.prisma.categoria.findMany({
  //     where: { estaActiva: true },
  //     select: {
  //       id: true,
  //       nombre: true,
  //       descripcion: true,
  //       imagen: true,
  //     },
  //     orderBy: { nombre: 'asc' },
  //   });
  // }

  /* ---------------------------------------------------------------------------------------------------------------- */
  /*                                                     Contacto                                                     */
  /* ---------------------------------------------------------------------------------------------------------------- */

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

    return dataResponseSuccess(
      { data: mensaje },
      {
        message: 'Mensaje enviado correctamente. Te contactaremos pronto.',
        status: 201,
      },
    );
  }

  /* ---------------------------------------------------------------------------------------------------------------- */
  /*                                                    Información                                                   */
  /* ---------------------------------------------------------------------------------------------------------------- */

  async getPoliticas() {
    // Obtener políticas desde configuración del sistema
    const configuraciones = await this.prisma.configuracionAplicacion.findMany({
      where: {
        clave: {
          in: [
            'politica_terminos',
            'politica_privacidad',
            'politica_devoluciones',
            'politica_envios',
          ],
        },
      },
    });

    const politicas = configuraciones.map((config) => ({
      tipo: config.clave.replace('politica_', ''),
      titulo: this.getTituloPolitica(config.clave),
      contenido: config.valor,
      fechaActualizacion: config.fechaActualizacion,
    }));

    return dataResponseSuccess({ data: politicas });
  }

  private getTituloPolitica(clave: string): string {
    const titulos = {
      politica_terminos: 'Términos y Condiciones',
      politica_privacidad: 'Política de Privacidad',
      politica_devoluciones: 'Política de Devoluciones',
      politica_envios: 'Política de Envíos',
    };
    return titulos[clave] || 'Política';
  }

  async getFAQs(input: FAQsDto) {
    const { categoria, limit = 50 } = input;

    // Obtener FAQs desde configuración
    const configuraciones = await this.prisma.configuracionAplicacion.findMany({
      where: {
        clave: ConfiguracionAplicacionClaveEnum.FAQ,
      },
      orderBy: {
        fechaCreacion: 'desc',
      },
    });

    // Parsear y filtrar FAQs
    let faqs = configuraciones
      .map((config) => {
        try {
          const data = JSON.parse(config.valor);
          return {
            id: config.id,
            pregunta: data.pregunta,
            respuesta: data.respuesta,
            categoria: data.categoria || null,
            orden: data.orden || 0,
            estaActiva: data.estaActiva !== undefined ? data.estaActiva : true,
          };
        } catch {
          return null;
        }
      })
      .filter((faq) => faq !== null && faq.estaActiva);

    // Filtrar por categoría si se especifica
    if (categoria) {
      faqs = faqs.filter((f) => f.categoria === categoria);
    }

    // Ordenar por orden y limitar
    faqs.sort((a, b) => a.orden - b.orden);
    faqs = faqs.slice(0, limit);

    return dataResponseSuccess({
      data: faqs,
    });
  }

  async getInformacionCompleta() {
    // Información estática de la empresa
    // TODO: Mover a configuración del sistema en el futuro
    const informacionEmpresa = {
      nombre: 'PetStore - Tu Tienda de Mascotas',
      descripcion:
        'Somos una empresa dedicada al cuidado y bienestar de las mascotas, ofreciendo productos de alta calidad y servicios especializados.',
      mision:
        'Brindar productos y servicios de calidad para el cuidado integral de las mascotas, promoviendo su salud y felicidad.',
      vision:
        'Ser la tienda de mascotas líder en la región, reconocida por la excelencia en productos y servicios.',
      valores: [
        'Amor por los animales',
        'Calidad en productos y servicios',
        'Compromiso con el cliente',
        'Responsabilidad social',
        'Innovación constante',
      ],
      historia: {
        anoFundacion: 2020,
        fundadores: ['María González', 'Carlos Rodríguez'],
        hitos: [
          { ano: 2020, evento: 'Fundación de la empresa' },
          { ano: 2022, evento: 'Lanzamiento de la tienda online' },
          { ano: 2024, evento: 'Certificación ISO de calidad' },
        ],
      },
      estadisticas: {
        clientesSatisfechos: 10000,
        productosVendidos: 50000,
        anosExperiencia: dayjs().year() - 2020,
        sucursales: 5,
      },
    };

    // Información de contacto de la tienda
    const informacionContacto = {
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

    // Combinar ambas informaciones
    const informacionCompleta = {
      ...informacionEmpresa,
      ...informacionContacto,
    };

    return dataResponseSuccess({ data: informacionCompleta });
  }
}
