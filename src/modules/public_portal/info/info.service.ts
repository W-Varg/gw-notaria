import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { dataResponseError, dataResponseSuccess } from 'src/common/dtos/response.dto';
import { PromocionesActivasDto, FAQsDto } from './dto/info.input.dto';

@Injectable()
export class InfoService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHorariosSucursal(sucursalId: string) {
    const sucursal = await this.prismaService.sucursal.findUnique({
      where: { id: sucursalId },
      select: {
        id: true,
        nombre: true,
        estaActiva: true,
        horarios: {
          select: {
            diaSemana: true,
            horaApertura: true,
            horaCierre: true,
            estaActivo: true,
          },
          orderBy: { diaSemana: 'asc' },
        },
      },
    });

    if (!sucursal) return dataResponseError('Sucursal no encontrada');
    if (!sucursal.estaActiva) return dataResponseError('Sucursal no está activa');

    const horarios = {
      sucursalId: sucursal.id,
      nombreSucursal: sucursal.nombre,
      horarios: sucursal.horarios,
    };

    return dataResponseSuccess({ data: horarios });
  }

  async getPoliticas() {
    // Obtener políticas desde configuración del sistema
    const configuraciones = await this.prismaService.configuracionSistema.findMany({
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

  async getPromocionesActivas(input: PromocionesActivasDto) {
    const { categoria, limit = 10 } = input;

    // Por ahora retornamos datos mock ya que no hay tabla de promociones
    // NOTA: implementar cuando se cree la tabla de promociones
    const promociones = [
      {
        id: '1',
        titulo: '20% OFF en Alimento para Perros',
        descripcion: 'Descuento especial en toda la línea de alimentos premium para perros',
        tipo: 'descuento',
        descuento: 20,
        fechaInicio: new Date('2024-01-01'),
        fechaFin: new Date('2024-12-31'),
        categorias: ['alimentos', 'perros'],
      },
      {
        id: '2',
        titulo: '2x1 en Juguetes para Gatos',
        descripcion: 'Lleva 2 juguetes y paga solo 1 en toda la sección de gatos',
        tipo: '2x1',
        fechaInicio: new Date('2024-01-01'),
        fechaFin: new Date('2024-12-31'),
        categorias: ['juguetes', 'gatos'],
      },
    ];

    let promocionesFiltradas = promociones;

    if (categoria) {
      promocionesFiltradas = promociones.filter((p) =>
        p.categorias.includes(categoria.toLowerCase()),
      );
    }

    return dataResponseSuccess({
      data: promocionesFiltradas.slice(0, limit),
    });
  }

  async getFAQs(input: FAQsDto) {
    const { categoria, limit = 20 } = input;

    // Por ahora retornamos datos mock ya que no hay tabla de FAQs
    // NOTA: implementar cuando se cree la tabla de FAQs
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
    ];

    let faqsFiltradas = faqs.filter((f) => f.estaActiva);

    if (categoria) {
      faqsFiltradas = faqsFiltradas.filter((f) => f.categoria === categoria);
    }

    return dataResponseSuccess({
      data: faqsFiltradas.slice(0, limit),
    });
  }

  async getSobreNosotros() {
    // Información estática de la empresa
    // NOTA: mover a configuración del sistema en el futuro
    const informacion = {
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
        anosExperiencia: new Date().getFullYear() - 2020,
        sucursales: 5,
      },
    };

    return dataResponseSuccess({ data: informacion });
  }

  async getInformacionCompleta() {
    // Información estática de la empresa
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
        anosExperiencia: new Date().getFullYear() - 2020,
        sucursales: 5,
      },
    };

    // Obtener información de contacto de la tienda
    const informacionTienda = await this.obtenerParaPublico();

    // Datos por defecto si no existe información de tienda
    const datosTiendaDefault = {
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
      ...(informacionTienda || datosTiendaDefault),
    };

    return dataResponseSuccess({ data: informacionCompleta });
  }

  async obtenerParaPublico() {
    const informacion = await this.prismaService.informacionTienda.findFirst({
      where: { estaActivo: true },
    });

    if (!informacion) {
      // Si no existe información, retornar datos por defecto completos
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

    return informacion;
  }
}
