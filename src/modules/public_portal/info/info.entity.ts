import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HorariosSucursal {
  @ApiProperty({ type: String })
  sucursalId: string;

  @ApiProperty({ type: String })
  nombreSucursal: string;

  @ApiProperty({ type: Array })
  horarios: {
    diaSemana: string;
    horaApertura: string;
    horaCierre: string;
    estaActivo: boolean;
  }[];
}

export class PoliticaTienda {
  @ApiProperty({ type: String })
  tipo: string; // 'terminos', 'privacidad', 'devoluciones', 'envios'

  @ApiProperty({ type: String })
  titulo: string;

  @ApiProperty({ type: String })
  contenido: string;

  @ApiProperty({ type: Date })
  fechaActualizacion: Date;
}

export class PromocionActiva {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  titulo: string;

  @ApiProperty({ type: String })
  descripcion: string;

  @ApiPropertyOptional({ type: String })
  imagen?: string;

  @ApiProperty({ type: String })
  tipo: string; // 'descuento', 'oferta', '2x1', etc.

  @ApiPropertyOptional({ type: Number })
  descuento?: number;

  @ApiProperty({ type: Date })
  fechaInicio: Date;

  @ApiProperty({ type: Date })
  fechaFin: Date;

  @ApiPropertyOptional({ type: Array })
  productos?: string[];

  @ApiPropertyOptional({ type: Array })
  categorias?: string[];
}

export class PreguntaFrecuente {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
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

  @ApiProperty({ type: Array })
  valores: string[];

  @ApiProperty({ type: Object })
  historia: {
    anoFundacion: number;
    fundadores: string[];
    hitos: {
      ano: number;
      evento: string;
    }[];
  };

  @ApiProperty({ type: Object })
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
