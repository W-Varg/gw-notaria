import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class NestedDateTimeFilter {
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
  @ApiPropertyOptional({ type: () => NestedDateTimeFilter })
  not?: NestedDateTimeFilter;
}
