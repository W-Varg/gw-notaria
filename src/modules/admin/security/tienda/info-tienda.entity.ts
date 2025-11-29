import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class InformacionTienda {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ type: String })
  @Expose()
  nombre: string;

  @ApiPropertyOptional({ type: String })
  @Expose()
  descripcion?: string;

  @ApiProperty({ type: String })
  @Expose()
  email: string;

  @ApiProperty({ type: String })
  @Expose()
  telefono1: string;

  @ApiPropertyOptional({ type: String })
  @Expose()
  telefono2?: string;

  @ApiPropertyOptional({ type: String })
  @Expose()
  whatsapp?: string;

  @ApiProperty({ type: String })
  @Expose()
  direccionCompleta: string;

  @ApiProperty({ type: String })
  @Expose()
  ciudad: string;

  @ApiPropertyOptional({ type: String })
  @Expose()
  codigoPostal?: string;

  @ApiPropertyOptional({ type: Number })
  @Expose()
  latitud?: number;

  @ApiPropertyOptional({ type: Number })
  @Expose()
  longitud?: number;

  @ApiProperty({ type: String })
  @Expose()
  horarioLunesViernes: string;

  @ApiProperty({ type: String })
  @Expose()
  horarioSabado: string;

  @ApiProperty({ type: String })
  @Expose()
  horarioDomingo: string;

  @ApiPropertyOptional({ type: String })
  @Expose()
  facebook?: string;

  @ApiPropertyOptional({ type: String })
  @Expose()
  instagram?: string;

  @ApiPropertyOptional({ type: String })
  @Expose()
  tiktok?: string;

  @ApiPropertyOptional({ type: String })
  @Expose()
  youtube?: string;

  @ApiPropertyOptional({ type: String })
  @Expose()
  website?: string;

  @ApiPropertyOptional({ type: String })
  @Expose()
  informacionAdicional?: string;

  @ApiPropertyOptional({ type: String })
  @Expose()
  logoUrl?: string;

  @ApiProperty({ type: Boolean })
  @Expose()
  estaActivo: boolean;

  @ApiProperty({ type: Date })
  @Expose()
  fechaCreacion: Date;

  @ApiProperty({ type: Date })
  @Expose()
  fechaActualizacion: Date;
}
