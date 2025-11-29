import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { BaseFilterDto } from 'src/common/dtos/filters.dto';

export enum CategoriaMensaje {
  CONSULTA = 'consulta',
  QUEJA = 'queja',
  SUGERENCIA = 'sugerencia',
  RECLAMO = 'reclamo',
  FELICITACION = 'felicitacion',
  OTRO = 'otro',
}

export enum EstadoMensaje {
  NO_LEIDO = 'no_leido',
  LEIDO = 'leido',
  EN_PROCESO = 'en_proceso',
  RESPONDIDO = 'respondido',
  CERRADO = 'cerrado',
}

export class CreateMensajeContactoDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  usuarioId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Expose()
  nombre: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(150)
  @Expose()
  correo: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  @Expose()
  telefono?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @Expose()
  asunto: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  @Expose()
  mensaje: string;

  @ApiProperty({ enum: CategoriaMensaje, required: false })
  @IsOptional()
  @IsEnum(CategoriaMensaje)
  @Expose()
  categoria?: CategoriaMensaje;
}

export class UpdateMensajeContactoDto {
  @ApiProperty({ enum: EstadoMensaje, required: false })
  @IsOptional()
  @IsEnum(EstadoMensaje)
  @Expose()
  estado?: EstadoMensaje;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  @Expose()
  asunto?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  @Expose()
  mensaje?: string;

  @ApiProperty({ enum: CategoriaMensaje, required: false })
  @IsOptional()
  @IsEnum(CategoriaMensaje)
  @Expose()
  categoria?: CategoriaMensaje;
}

export class MensajeContactoWhereInput {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  usuarioId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  nombre?: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  @Expose()
  correo?: string;

  @ApiProperty({ enum: CategoriaMensaje, required: false })
  @IsOptional()
  @IsEnum(CategoriaMensaje)
  @Expose()
  categoria?: CategoriaMensaje;

  @ApiProperty({ enum: EstadoMensaje, required: false })
  @IsOptional()
  @IsEnum(EstadoMensaje)
  @Expose()
  estado?: EstadoMensaje;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  asunto?: string;
}

export class ListContactoArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: MensajeContactoWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => MensajeContactoWhereInput)
  @Expose()
  where?: MensajeContactoWhereInput;
}

export class ResponderMensajeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  @Expose()
  respuesta: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  @Expose()
  asuntoRespuesta?: string;
}

export class MarcarComoLeidoDto {
  @ApiProperty({ type: [String] })
  @IsString({ each: true })
  @IsNotEmpty()
  @Expose()
  mensajeIds: string[];
}

export class EstadisticasContactoDto {
  @ApiProperty()
  @Expose()
  totalMensajes: number;

  @ApiProperty()
  @Expose()
  mensajesNoLeidos: number;

  @ApiProperty()
  @Expose()
  mensajesEnProceso: number;

  @ApiProperty()
  @Expose()
  mensajesRespondidos: number;

  @ApiProperty()
  @Expose()
  mensajesCerrados: number;

  @ApiProperty()
  @Expose()
  distribucionPorCategoria: Record<CategoriaMensaje, number>;

  @ApiProperty()
  @Expose()
  mensajesUltimos7Dias: number;

  @ApiProperty()
  @Expose()
  tiempoPromedioRespuesta: number; // en horas
}
