import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto } from 'src/common/dtos/response.dto';
import { Categoria } from 'src/modules/admin/catalogos/categorias/categoria.entity';
import { ResponseTipoProductoType } from 'src/modules/admin/catalogos/tipos-producto/dto/tipos-producto.response';
import { Expose, Type } from 'class-transformer';

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                   categoria types                                                  */
/* ------------------------------------------------------------------------------------------------------------------ */
export class CategoriaPublica extends OmitType(Categoria, [
  'estaActiva',
  'fechaCreacion',
  'fechaActualizacion',
]) {}

class CategoriaDataPublic {
  @ApiProperty({ type: [CategoriaPublica] })
  data: CategoriaPublica[];
}

export class CategoriasTypePublic extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: CategoriaDataPublic })
  response: CategoriaDataPublic;
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                 tipo producto types                                                */
/* ------------------------------------------------------------------------------------------------------------------ */

export class TiposProductosTypePublic extends ResponseTipoProductoType {}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                    Contacto Types                                                  */
/* ------------------------------------------------------------------------------------------------------------------ */

export class MensajeEnviadoEntity {
  @ApiProperty({ description: 'ID único del mensaje', example: 'cly123456789' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Nombre del remitente', example: 'Juan Pérez' })
  @Expose()
  nombre: string;

  @ApiProperty({ description: 'Email del remitente', example: 'juan@email.com' })
  @Expose()
  correo: string;

  @ApiProperty({ description: 'Asunto del mensaje', example: 'Consulta sobre productos' })
  @Expose()
  asunto: string;

  @ApiProperty({ description: 'Contenido del mensaje', example: 'Necesito información sobre...' })
  @Expose()
  mensaje: string;

  @ApiPropertyOptional({ description: 'Teléfono del remitente', example: '123456789' })
  @Expose()
  telefono?: string;

  @ApiProperty({ description: 'Fecha de envío del mensaje', example: '2024-01-15T10:30:00Z' })
  @Expose()
  fechaEnvio: Date;

  @ApiProperty({ description: 'Estado del mensaje', example: 'no_leido' })
  @Expose()
  estado: string;

  @ApiProperty({ description: 'Categoría del mensaje', example: 'consulta' })
  @Expose()
  categoria: string;
}

class ResponseMensajeDataType {
  @ApiProperty({ type: () => MensajeEnviadoEntity })
  @Type(() => MensajeEnviadoEntity)
  @Expose()
  data: MensajeEnviadoEntity;
}

export class ResponseMensajeType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: () => ResponseMensajeDataType })
  @Type(() => ResponseMensajeDataType)
  @Expose()
  response: ResponseMensajeDataType;
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                 Información Types                                                  */
/* ------------------------------------------------------------------------------------------------------------------ */

export class PoliticaTienda {
  @ApiProperty({ type: String, example: 'terminos' })
  tipo: string; // 'terminos', 'privacidad', 'devoluciones', 'envios'

  @ApiProperty({ type: String, example: 'Términos y Condiciones' })
  titulo: string;

  @ApiProperty({ type: String })
  contenido: string;

  @ApiProperty({ type: Date })
  fechaActualizacion: Date;
}

export class PreguntaFrecuente {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String, example: 'productos' })
  categoria: string; // 'productos', 'envios', 'pagos', 'devoluciones', 'general'

  @ApiProperty({ type: String })
  pregunta: string;

  @ApiProperty({ type: String })
  respuesta: string;

  @ApiProperty({ type: Number })
  orden: number;

  @ApiProperty({ type: Boolean })
  estaActiva: boolean;
}

export class InformacionCompletaTienda {
  // Información de la empresa
  @ApiProperty({ type: String })
  nombre: string;

  @ApiProperty({ type: String })
  descripcion: string;

  @ApiProperty({ type: String })
  mision: string;

  @ApiProperty({ type: String })
  vision: string;

  @ApiProperty({ type: [String] })
  valores: string[];

  @ApiProperty({
    type: 'object',
    properties: {
      anoFundacion: { type: 'number' },
      fundadores: { type: 'array', items: { type: 'string' } },
      hitos: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            ano: { type: 'number' },
            evento: { type: 'string' },
          },
        },
      },
    },
  })
  historia: {
    anoFundacion: number;
    fundadores: string[];
    hitos: {
      ano: number;
      evento: string;
    }[];
  };

  @ApiProperty({
    type: 'object',
    properties: {
      clientesSatisfechos: { type: 'number' },
      productosVendidos: { type: 'number' },
      anosExperiencia: { type: 'number' },
      sucursales: { type: 'number' },
    },
  })
  estadisticas: {
    clientesSatisfechos: number;
    productosVendidos: number;
    anosExperiencia: number;
    sucursales: number;
  };

  // Información de contacto de la tienda
  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  telefono1: string;

  @ApiPropertyOptional({ type: String })
  telefono2?: string;

  @ApiPropertyOptional({ type: String })
  whatsapp?: string;

  @ApiProperty({ type: String })
  direccionCompleta: string;

  @ApiProperty({ type: String })
  ciudad: string;

  @ApiPropertyOptional({ type: String })
  codigoPostal?: string;

  @ApiPropertyOptional({ type: Number })
  latitud?: number;

  @ApiPropertyOptional({ type: Number })
  longitud?: number;

  @ApiProperty({ type: String })
  horarioLunesViernes: string;

  @ApiProperty({ type: String })
  horarioSabado: string;

  @ApiProperty({ type: String })
  horarioDomingo: string;

  @ApiPropertyOptional({ type: String })
  facebook?: string;

  @ApiPropertyOptional({ type: String })
  instagram?: string;

  @ApiPropertyOptional({ type: String })
  tiktok?: string;

  @ApiPropertyOptional({ type: String })
  youtube?: string;

  @ApiPropertyOptional({ type: String })
  website?: string;

  @ApiPropertyOptional({ type: String })
  informacionAdicional?: string;

  @ApiPropertyOptional({ type: String })
  logoUrl?: string;
}

class PoliticasData {
  @ApiProperty({ type: [PoliticaTienda] })
  data: PoliticaTienda[];
}

export class ResponsePoliticasType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PoliticasData })
  declare response: PoliticasData;
}

class FAQsData {
  @ApiProperty({ type: [PreguntaFrecuente] })
  data: PreguntaFrecuente[];
}

export class ResponseFAQsType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: FAQsData })
  declare response: FAQsData;
}

class InformacionCompletaData {
  @ApiProperty({ type: InformacionCompletaTienda })
  data: InformacionCompletaTienda;
}

export class ResponseInformacionCompletaType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: InformacionCompletaData })
  declare response: InformacionCompletaData;
}
