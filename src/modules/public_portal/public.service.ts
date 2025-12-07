import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/global/database/prisma.service';
import { CategoriaPublica } from './dto/public.response';
import { ContactoMensajeDto, FAQsDto } from './dto/public.input';
import { dataResponseSuccess } from 'src/common/dtos/response.dto';
import dayjs from 'dayjs';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  /* ---------------------------------------------------------------------------------------------------------------- */
  /*                                              Categorías y Productos                                              */
  /* ---------------------------------------------------------------------------------------------------------------- */

  getCategorias(): Promise<CategoriaPublica[]> {
    return this.prisma.categoria.findMany({
      where: { estaActiva: true },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        imagen: true,
      },
      orderBy: { nombre: 'asc' },
    });
  }

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
    const { categoria, limit = 20 } = input;

    // Por ahora retornamos datos mock ya que no hay tabla de FAQs
    // TODO: Implementar cuando se cree la tabla de FAQs en Prisma
    const faqs = [
      {
        id: '1',
        categoria: 'productos',
        pregunta: '¿Cómo elegir el alimento adecuado para mi mascota?',
        respuesta:
          'Considera la edad, tamaño, raza y necesidades especiales de tu mascota. Consulta con nuestros especialistas para una recomendación personalizada.',
        orden: 1,
        estaActiva: true,
      },
      {
        id: '2',
        categoria: 'envios',
        pregunta: '¿Cuánto tiempo tarda la entrega?',
        respuesta:
          'Los envíos se realizan en un plazo de 1-3 días hábiles dentro de la ciudad y 3-7 días a nivel nacional.',
        orden: 2,
        estaActiva: true,
      },
      {
        id: '3',
        categoria: 'pagos',
        pregunta: '¿Qué métodos de pago aceptan?',
        respuesta:
          'Aceptamos tarjetas de crédito, débito, transferencias bancarias y efectivo contra entrega.',
        orden: 3,
        estaActiva: true,
      },
      {
        id: '4',
        categoria: 'devoluciones',
        pregunta: '¿Puedo devolver un producto?',
        respuesta:
          'Sí, puedes devolver productos en perfecto estado dentro de los primeros 30 días de la compra.',
        orden: 4,
        estaActiva: true,
      },
      {
        id: '5',
        categoria: 'general',
        pregunta: '¿Tienen tienda física?',
        respuesta:
          'Sí, contamos con 5 sucursales en diferentes ubicaciones. Puedes consultar direcciones y horarios en la sección "Sobre Nosotros".',
        orden: 5,
        estaActiva: true,
      },
    ];

    let faqsFiltradas = faqs.filter((f) => f.estaActiva);

    if (categoria) {
      faqsFiltradas = faqsFiltradas.filter((f) => f.categoria === categoria);
    }

    return dataResponseSuccess({
      data: faqsFiltradas.slice(0, limit),
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
          { ano: 2021, evento: 'Apertura de la primera sucursal' },
          { ano: 2022, evento: 'Lanzamiento de la tienda online' },
          { ano: 2023, evento: 'Expansión a 5 sucursales' },
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
