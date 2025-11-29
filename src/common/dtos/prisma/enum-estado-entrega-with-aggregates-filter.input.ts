import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { EstadoEntrega } from '../../../enums/estado-entrega.enum';
import { NestedEnumEstadoEntregaWithAggregatesFilter } from './nested-enum-estado-entrega-with-aggregates-filter.input';
import { NestedIntFilter } from './nested-int-filter.input';
import { NestedEnumEstadoEntregaFilter } from './nested-enum-estado-entrega-filter.input';

export class EnumEstadoEntregaWithAggregatesFilter {
  @Expose()
  @ApiPropertyOptional({ enum: EstadoEntrega })
  @IsOptional()
  @IsEnum(EstadoEntrega)
  equals?: EstadoEntrega;

  @Expose()
  @ApiPropertyOptional({ enum: EstadoEntrega, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(EstadoEntrega, { each: true })
  in?: Array<EstadoEntrega>;

  @Expose()
  @ApiPropertyOptional({ enum: EstadoEntrega, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(EstadoEntrega, { each: true })
  notIn?: Array<EstadoEntrega>;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedEnumEstadoEntregaWithAggregatesFilter })
  @IsOptional()
  @ValidateNested()
  @Type(() => NestedEnumEstadoEntregaWithAggregatesFilter)
  not?: NestedEnumEstadoEntregaWithAggregatesFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedIntFilter })
  @IsOptional()
  @ValidateNested()
  @Type(() => NestedIntFilter)
  _count?: NestedIntFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedEnumEstadoEntregaFilter })
  @IsOptional()
  @ValidateNested()
  @Type(() => NestedEnumEstadoEntregaFilter)
  _min?: NestedEnumEstadoEntregaFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedEnumEstadoEntregaFilter })
  @IsOptional()
  @ValidateNested()
  @Type(() => NestedEnumEstadoEntregaFilter)
  _max?: NestedEnumEstadoEntregaFilter;
}
