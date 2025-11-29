import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UnidadMedida } from '../../../enums/unidad-medida.enum';
import { NestedIntFilter } from './nested-int-filter.input';
import { NestedEnumUnidadMedidaFilter } from './nested-enum-unidad-medida-filter.input';
import { IsArray, IsEnum } from 'class-validator';

export class NestedEnumUnidadMedidaWithAggregatesFilter {
  @Expose()
  @ApiPropertyOptional({ enum: UnidadMedida })
  @IsEnum(UnidadMedida)
  equals?: UnidadMedida;

  @Expose()
  @ApiPropertyOptional({ enum: UnidadMedida, isArray: true })
  @IsArray()
  @IsEnum(UnidadMedida, { each: true })
  in?: Array<UnidadMedida>;

  @Expose()
  @ApiPropertyOptional({ enum: UnidadMedida, isArray: true })
  @IsArray()
  @IsEnum(UnidadMedida, { each: true })
  notIn?: Array<UnidadMedida>;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedEnumUnidadMedidaWithAggregatesFilter })
  not?: NestedEnumUnidadMedidaWithAggregatesFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedIntFilter })
  _count?: NestedIntFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedEnumUnidadMedidaFilter })
  _min?: NestedEnumUnidadMedidaFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedEnumUnidadMedidaFilter })
  _max?: NestedEnumUnidadMedidaFilter;
}
