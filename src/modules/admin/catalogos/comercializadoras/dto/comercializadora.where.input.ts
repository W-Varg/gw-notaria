import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { BaseFilterDto } from 'src/common/dtos/filters.dto';
import { BoolFilter } from 'src/common/dtos/prisma/bool-filter.input';
import { IntFilter } from 'src/common/dtos/prisma/int-filter.input';
import { StringFilter } from 'src/common/dtos/prisma/string-filter.input';
import { StringNullableFilter } from 'src/common/dtos/prisma/string-nullable-filter.input';
import { DateTimeFilter, DateTimeNullableFilter } from 'src/common/dtos';

class ComercializadoraWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  nombre?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: IntFilter })
  @IsOptional()
  @Type(() => IntFilter)
  tipoComercializadora?: IntFilter;

  @Expose()
  @ApiPropertyOptional({ type: IntFilter })
  @IsOptional()
  @Type(() => IntFilter)
  sucursalId?: IntFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  clienteId?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  consolidado?: BoolFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  minuta?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  protocolo?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: DateTimeNullableFilter })
  @IsOptional()
  @Type(() => DateTimeNullableFilter)
  fechaEnvio?: DateTimeNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: DateTimeNullableFilter })
  @IsOptional()
  @Type(() => DateTimeNullableFilter)
  fechaEnvioTestimonio?: DateTimeNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: DateTimeFilter })
  @IsOptional()
  @Type(() => DateTimeFilter)
  fechaCreacion?: DateTimeFilter;
}

class ComercializadoraSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  nombre?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  tipoComercializadora?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  metaData?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  sucursalId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  clienteId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  consolidado?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  minuta?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  protocolo?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  fechaEnvio?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  fechaEnvioTestimonio?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  fechaCreacion?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  fechaActualizacion?: boolean;
}

export class ListComercializadoraArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: ComercializadoraWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => ComercializadoraWhereInput)
  where?: ComercializadoraWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: ComercializadoraSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => ComercializadoraSelectInput)
  select?: ComercializadoraSelectInput;
}
