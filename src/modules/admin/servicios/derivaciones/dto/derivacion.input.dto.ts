import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { BaseFilterDto } from 'src/common/dtos/filters.dto';
import { StringFilter } from 'src/common/dtos/prisma/string-filter.input';
import { BoolFilter } from 'src/common/dtos/prisma/bool-filter.input';
import { DateTimeFilter } from 'src/common/dtos';

export class CreateDerivacionDto {
  @Expose()
  @IsDefined()
  @IsString()
  @ApiProperty({ type: String, description: 'ID del servicio a derivar' })
  servicioId: string;

  @Expose()
  @IsDefined()
  @IsString()
  @ApiProperty({ type: String, description: 'ID del usuario destino' })
  usuarioDestinoId: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({ type: String, description: 'Motivo de la derivación' })
  motivo?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiPropertyOptional({
    type: String,
    enum: ['baja', 'normal', 'alta', 'urgente'],
    default: 'normal',
    description: 'Prioridad de la derivación',
  })
  prioridad?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: 'Comentario adicional' })
  comentario?: string;
}

export class CancelarDerivacionDto {
  @Expose()
  @IsDefined()
  @IsInt()
  @ApiProperty({ type: Number, description: 'ID de la derivación a cancelar' })
  derivacionId: number;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({ type: String, description: 'Motivo de la cancelación' })
  motivoCancelacion?: string;
}

export class MarcarVisualizadaDto {
  @Expose()
  @IsDefined()
  @IsInt()
  @ApiProperty({ type: Number, description: 'ID de la derivación' })
  derivacionId: number;
}

export class NotaDerivacionDto {
  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: 'Comentario al aceptar' })
  comentario?: string;
}

export class RechazarDerivacionDto {
  @Expose()
  @IsDefined()
  @IsInt()
  @ApiProperty({ type: Number, description: 'ID de la derivación a rechazar' })
  derivacionId: number;

  @Expose()
  @IsDefined()
  @IsString()
  @ApiProperty({ type: String, description: 'Motivo del rechazo' })
  motivoRechazo: string;
}

class DerivacionWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: String, description: 'Filtrar por texto de búsqueda' })
  @IsOptional()
  @Type(() => String)
  searchText?: string;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter, description: 'Filtrar por ID del servicio' })
  @IsOptional()
  @Type(() => StringFilter)
  servicioId?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter, description: 'Filtrar por funcionario origen' })
  @IsOptional()
  @Type(() => StringFilter)
  usuarioOrigenId?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter, description: 'Filtrar por funcionario destino' })
  @IsOptional()
  @Type(() => StringFilter)
  usuarioDestinoId?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter, description: 'Filtrar por estado de aceptación' })
  @IsOptional()
  @Type(() => BoolFilter)
  aceptada?: BoolFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter, description: 'Filtrar por derivación activa' })
  @IsOptional()
  @Type(() => BoolFilter)
  estaActiva?: BoolFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter, description: 'Filtrar por derivación visualizada' })
  @IsOptional()
  @Type(() => BoolFilter)
  visualizada?: BoolFilter;

  @Expose()
  @ApiPropertyOptional({ type: DateTimeFilter, description: 'Filtrar por fecha de derivación' })
  @IsOptional()
  @Type(() => DateTimeFilter)
  fechaDerivacion?: DateTimeFilter;

  @Expose()
  @ApiPropertyOptional({ type: DateTimeFilter, description: 'Filtrar por fecha de aceptación' })
  @IsOptional()
  @Type(() => DateTimeFilter)
  fechaAceptacion?: DateTimeFilter;

  @Expose()
  @ApiPropertyOptional({
    type: String,
    description: 'Filtrar por ID del tipo de trámite del servicio',
  })
  @IsOptional()
  @IsString()
  tramiteId?: string;

  @Expose()
  @ApiPropertyOptional({
    type: String,
    description: 'Filtrar por prioridad (baja, normal, alta, urgente)',
  })
  @IsOptional()
  @IsString()
  prioridad?: string;
}

class DerivacionSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  servicioId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  usuarioOrigenId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  usuarioDestinoId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  motivo?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  prioridad?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  aceptada?: boolean;
}

export class ListDerivacionArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: DerivacionWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => DerivacionWhereInput)
  where?: DerivacionWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: DerivacionSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => DerivacionSelectInput)
  select?: DerivacionSelectInput;
}
