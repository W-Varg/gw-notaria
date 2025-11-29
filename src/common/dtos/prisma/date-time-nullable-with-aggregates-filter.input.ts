import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { NestedDateTimeNullableWithAggregatesFilter } from './nested-date-time-nullable-with-aggregates-filter.input';
import { NestedIntNullableFilter } from './nested-int-nullable-filter.input';
import { NestedDateTimeNullableFilter } from './nested-date-time-nullable-filter.input';

export class DateTimeNullableWithAggregatesFilter {
  @Expose()
  @ApiPropertyOptional({ type: Date })
  equals?: Date | string;

  @Expose()
  @ApiPropertyOptional({ type: [Date] })
  in?: Array<Date> | Array<string>;

  @Expose()
  @ApiPropertyOptional({ type: [Date] })
  notIn?: Array<Date> | Array<string>;

  @Expose()
  @ApiPropertyOptional({ type: Date })
  lt?: Date | string;

  @Expose()
  @ApiPropertyOptional({ type: Date })
  lte?: Date | string;

  @Expose()
  @ApiPropertyOptional({ type: Date })
  gt?: Date | string;

  @Expose()
  @ApiPropertyOptional({ type: Date })
  gte?: Date | string;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedDateTimeNullableWithAggregatesFilter })
  not?: NestedDateTimeNullableWithAggregatesFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedIntNullableFilter })
  _count?: NestedIntNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedDateTimeNullableFilter })
  _min?: NestedDateTimeNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedDateTimeNullableFilter })
  _max?: NestedDateTimeNullableFilter;
}
