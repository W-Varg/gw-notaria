import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { NestedFloatNullableWithAggregatesFilter } from './nested-float-nullable-with-aggregates-filter.input';
import { NestedIntNullableFilter } from './nested-int-nullable-filter.input';
import { NestedFloatNullableFilter } from './nested-float-nullable-filter.input';

export class FloatNullableWithAggregatesFilter {
  @Expose()
  @ApiPropertyOptional({ type: Number })
  equals?: number;

  @Expose()
  @ApiPropertyOptional({ type: [Number] })
  in?: Array<number>;

  @Expose()
  @ApiPropertyOptional({ type: [Number] })
  notIn?: Array<number>;

  @Expose()
  @ApiPropertyOptional({ type: Number })
  lt?: number;

  @Expose()
  @ApiPropertyOptional({ type: Number })
  lte?: number;

  @Expose()
  @ApiPropertyOptional({ type: Number })
  gt?: number;

  @Expose()
  @ApiPropertyOptional({ type: Number })
  gte?: number;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedFloatNullableWithAggregatesFilter })
  not?: NestedFloatNullableWithAggregatesFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedIntNullableFilter })
  _count?: NestedIntNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedFloatNullableFilter })
  _avg?: NestedFloatNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedFloatNullableFilter })
  _sum?: NestedFloatNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedFloatNullableFilter })
  _min?: NestedFloatNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedFloatNullableFilter })
  _max?: NestedFloatNullableFilter;
}
