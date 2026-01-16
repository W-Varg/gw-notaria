import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDefined, IsInt, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { BaseFilterDto } from '../../../../../common/dtos/filters.dto';
import { IntFilter } from '../../../../../common/dtos/prisma/int-filter.input';
import { StringFilter } from '../../../../../common/dtos/prisma/string-filter.input';
import { StringNullableFilter } from '../../../../../common/dtos/prisma/string-nullable-filter.input';

export class CreateHistorialEstadosServicioDto {
  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  usuarioId?: string;

  @Expose()
  @IsDefined()
  @ApiProperty({ type: String })
  servicioId: string;

  @Expose()
  @IsDefined()
  @IsInt()
  @ApiProperty({ type: Number })
  estadoId: number;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  comentario?: string;
}

export class UpdateHistorialEstadosServicioDto extends PartialType(
  CreateHistorialEstadosServicioDto,
) {}

class HistorialEstadosServicioWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  usuarioId?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  servicioId?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: IntFilter })
  @IsOptional()
  @Type(() => IntFilter)
  estadoId?: IntFilter;
}

class HistorialEstadosServicioSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  usuarioId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  servicioId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  estadoId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  fechaCambio?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  comentario?: boolean;
}

export class ListHistorialEstadosServicioArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: HistorialEstadosServicioWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => HistorialEstadosServicioWhereInput)
  where?: HistorialEstadosServicioWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: HistorialEstadosServicioSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => HistorialEstadosServicioSelectInput)
  select?: HistorialEstadosServicioSelectInput;
}
