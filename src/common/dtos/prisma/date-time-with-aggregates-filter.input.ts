import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { NestedDateTimeWithAggregatesFilter } from './nested-date-time-with-aggregates-filter.input';
import { NestedIntFilter } from './nested-int-filter.input';
import { NestedDateTimeFilter } from './nested-date-time-filter.input';

export class DateTimeWithAggregatesFilter {
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
  @ApiPropertyOptional({ type: () => NestedDateTimeWithAggregatesFilter })
  not?: NestedDateTimeWithAggregatesFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedIntFilter })
  _count?: NestedIntFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedDateTimeFilter })
  _min?: NestedDateTimeFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedDateTimeFilter })
  _max?: NestedDateTimeFilter;
}
