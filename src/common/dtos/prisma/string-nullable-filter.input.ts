import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { NestedStringNullableFilter } from './nested-string-nullable-filter.input';

export class StringNullableFilter {
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
  @ApiPropertyOptional({ type: () => NestedStringNullableFilter })
  not?: NestedStringNullableFilter;
}
