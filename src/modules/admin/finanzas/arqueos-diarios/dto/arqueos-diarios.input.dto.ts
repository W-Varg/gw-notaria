import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsDateString,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { BaseFilterDto } from '../../../../../common/dtos/filters.dto';
import { StringNullableFilter } from '../../../../../common/dtos/prisma/string-nullable-filter.input';
import { FloatFilter } from '../../../../../common/dtos/prisma/float-filter.input';
import { DateTimeFilter } from '../../../../../common/dtos';

export class CreateArqueosDiariosDto {
  @Expose()
  @IsDefined()
  @IsDateString()
  @ApiProperty({ type: String, format: 'date' })
  fecha: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  usuarioCierreId?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ type: Number })
  totalIngresosEfectivo?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ type: Number })
  totalIngresosBancos?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ type: Number })
  totalEgresosEfectivo?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ type: Number })
  totalEgresosBancos?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  saldoFinalDia?: number;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  observaciones?: string;
}

export class UpdateArqueosDiariosDto extends PartialType(CreateArqueosDiariosDto) {}

class ArqueosDiariosWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: DateTimeFilter })
  @IsOptional()
  @Type(() => DateTimeFilter)
  fecha?: DateTimeFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  usuarioCierreId?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: FloatFilter })
  @IsOptional()
  @Type(() => FloatFilter)
  totalIngresosEfectivo?: FloatFilter;

  @Expose()
  @ApiPropertyOptional({ type: FloatFilter })
  @IsOptional()
  @Type(() => FloatFilter)
  totalIngresosBancos?: FloatFilter;

  @Expose()
  @ApiPropertyOptional({ type: FloatFilter })
  @IsOptional()
  @Type(() => FloatFilter)
  totalEgresosEfectivo?: FloatFilter;

  @Expose()
  @ApiPropertyOptional({ type: FloatFilter })
  @IsOptional()
  @Type(() => FloatFilter)
  totalEgresosBancos?: FloatFilter;

  @Expose()
  @ApiPropertyOptional({ type: FloatFilter })
  @IsOptional()
  @Type(() => FloatFilter)
  saldoFinalDia?: FloatFilter;

  @Expose()
  @ApiPropertyOptional({ type: DateTimeFilter })
  @IsOptional()
  @Type(() => DateTimeFilter)
  fechaCierre?: DateTimeFilter;
}

class ArqueosDiariosSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  fecha?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  usuarioCierreId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  totalIngresosEfectivo?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  totalIngresosBancos?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  totalEgresosEfectivo?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  totalEgresosBancos?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  saldoFinalDia?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  observaciones?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  fechaCierre?: boolean;
}

export class ListArqueosDiariosArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: ArqueosDiariosWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => ArqueosDiariosWhereInput)
  where?: ArqueosDiariosWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: ArqueosDiariosSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => ArqueosDiariosSelectInput)
  select?: ArqueosDiariosSelectInput;
}
