import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { NestedIntFilter } from './nested-int-filter.input';
import { NestedFloatFilter } from './nested-float-filter.input';

export class NestedIntWithAggregatesFilter {
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
  @ApiPropertyOptional({ type: () => NestedIntWithAggregatesFilter })
  not?: NestedIntWithAggregatesFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedIntFilter })
  _count?: NestedIntFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedFloatFilter })
  _avg?: NestedFloatFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedIntFilter })
  _sum?: NestedIntFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedIntFilter })
  _min?: NestedIntFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedIntFilter })
  _max?: NestedIntFilter;
}
