import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { NestedIntFilter } from './nested-int-filter.input';
import { NestedStringFilter } from './nested-string-filter.input';

export class NestedStringWithAggregatesFilter {
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
  @ApiPropertyOptional({ type: () => NestedStringWithAggregatesFilter })
  not?: NestedStringWithAggregatesFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedIntFilter })
  _count?: NestedIntFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedStringFilter })
  _min?: NestedStringFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedStringFilter })
  _max?: NestedStringFilter;
}
