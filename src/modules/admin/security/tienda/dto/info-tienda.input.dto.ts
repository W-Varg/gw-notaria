import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateInformacionTiendaDto {
  @Expose()
  @IsDefined()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ type: String })
  @Expose()
  nombre: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({ type: String })
  @Expose()
  descripcion?: string;

  @Expose()
  @IsDefined()
  @IsEmail()
  @ApiProperty({ type: String })
  @Expose()
  email: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MaxLength(20)
  @ApiProperty({ type: String })
  @Expose()
  telefono1: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiPropertyOptional({ type: String })
  @Expose()
  telefono2?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiPropertyOptional({ type: String })
  @Expose()
  whatsapp?: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MaxLength(200)
  @ApiProperty({ type: String })
  @Expose()
  direccionCompleta: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MaxLength(50)
  @ApiProperty({ type: String })
  @Expose()
  ciudad: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  @ApiPropertyOptional({ type: String })
  @Expose()
  codigoPostal?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  @Transform(({ value }) => parseFloat(value))
  @Expose()
  latitud?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  @Transform(({ value }) => parseFloat(value))
  @Expose()
  longitud?: number;

  @Expose()
  @IsDefined()
  @IsString()
  @MaxLength(20)
  @ApiProperty({ type: String })
  @Expose()
  horarioLunesViernes: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MaxLength(20)
  @ApiProperty({ type: String })
  @Expose()
  horarioSabado: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MaxLength(20)
  @ApiProperty({ type: String })
  @Expose()
  horarioDomingo: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiPropertyOptional({ type: String })
  @Expose()
  facebook?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiPropertyOptional({ type: String })
  @Expose()
  instagram?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiPropertyOptional({ type: String })
  @Expose()
  tiktok?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiPropertyOptional({ type: String })
  @Expose()
  youtube?: string;

  @Expose()
  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({ type: String })
  @Expose()
  website?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @ApiPropertyOptional({ type: String })
  @Expose()
  informacionAdicional?: string;

  @Expose()
  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({ type: String })
  @Expose()
  logoUrl?: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  @Expose()
  estaActivo?: boolean;
}

export class UpdateInformacionTiendaDto extends PartialType(CreateInformacionTiendaDto) {
  // Hereda todos los campos como opcionales del CreateInformacionTiendaDto
}
