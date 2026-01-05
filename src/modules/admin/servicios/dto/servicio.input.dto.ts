import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { BaseFilterDto } from 'src/common/dtos/filters.dto';
import { IntFilter } from 'src/common/dtos/prisma/int-filter.input';
import { StringFilter } from 'src/common/dtos/prisma/string-filter.input';
import { StringNullableFilter } from 'src/common/dtos/prisma/string-nullable-filter.input';
import { FloatFilter } from 'src/common/dtos/prisma/float-filter.input';

export class CreateServicioDto {
  @Expose()
  @IsDefined()
  @ApiProperty({ type: String })
  clienteId: string;

  @Expose()
  @IsDefined()
  @ApiProperty({})
  tipoDocumentoId: string;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  tipoTramiteId?: string;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  estadoActualId?: string;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional({ type: Date })
  fechaEstimadaEntrega?: Date;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ type: Number })
  plazoEntregaDias?: number;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiPropertyOptional({
    type: String,
    enum: ['baja', 'normal', 'alta', 'urgente'],
    default: 'normal',
  })
  prioridad?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  observaciones?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  contenidoFinal?: string;

  @Expose()
  @IsDefined()
  @IsNumber()
  @Min(0)
  @ApiProperty({ type: Number })
  montoTotal: number;
}

export class UpdateServicioDto extends PartialType(CreateServicioDto) {}

class ServicioWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  codigoTicket?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  clienteId?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  tipoDocumentoId?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  tipoTramiteId?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: FloatFilter })
  @IsOptional()
  @Type(() => FloatFilter)
  montoTotal?: FloatFilter;

  @Expose()
  @ApiPropertyOptional({ type: FloatFilter })
  @IsOptional()
  @Type(() => FloatFilter)
  saldoPendiente?: FloatFilter;
}

class ServicioSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  codigoTicket?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  clienteId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  tipoDocumentoId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  claseTramite?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  tipoTramiteId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  montoTotal?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  saldoPendiente?: boolean;
}

export class ListServicioArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: ServicioWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => ServicioWhereInput)
  where?: ServicioWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: ServicioSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => ServicioSelectInput)
  select?: ServicioSelectInput;
}
