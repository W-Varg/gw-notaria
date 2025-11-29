import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { NestedStringNullableWithAggregatesFilter } from './nested-string-nullable-with-aggregates-filter.input';
import { NestedIntNullableFilter } from './nested-int-nullable-filter.input';
import { NestedStringNullableFilter } from './nested-string-nullable-filter.input';

export class StringNullableWithAggregatesFilter {
  @Expose()
  @ApiPropertyOptional({ type: String })
  equals?: string;

  @Expose()
  @ApiPropertyOptional({ type: [String] })
  in?: Array<string>;

  @Expose()
  @ApiPropertyOptional({ type: [String] })
  notIn?: Array<string>;

  @Expose()
  @ApiPropertyOptional({ type: String })
  lt?: string;

  @Expose()
  @ApiPropertyOptional({ type: String })
  lte?: string;

  @Expose()
  @ApiPropertyOptional({ type: String })
  gt?: string;

  @Expose()
  @ApiPropertyOptional({ type: String })
  gte?: string;

  @Expose()
  @ApiPropertyOptional({ type: String })
  contains?: string;

  @Expose()
  @ApiPropertyOptional({ type: String })
  startsWith?: string;

  @Expose()
  @ApiPropertyOptional({ type: String })
  endsWith?: string;

  @Expose()
  @ApiPropertyOptional({ type: String })
  search?: string;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedStringNullableWithAggregatesFilter })
  not?: NestedStringNullableWithAggregatesFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedIntNullableFilter })
  _count?: NestedIntNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedStringNullableFilter })
  _min?: NestedStringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedStringNullableFilter })
  _max?: NestedStringNullableFilter;
}
