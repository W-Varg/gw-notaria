import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { NestedIntNullableFilter } from './nested-int-nullable-filter.input';

export class IntNullableFilter {
  @Expose()
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ type: Number })
  equals?: number | null;

  @Expose()
  @IsOptional()
  @IsInt({ each: true })
  @ApiPropertyOptional({ type: [Number] })
  in?: number[] | null;

  @Expose()
  @IsOptional()
  @IsInt({ each: true })
  @ApiPropertyOptional({ type: [Number] })
  notIn?: number[] | null;

  @Expose()
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ type: Number })
  lt?: number;

  @Expose()
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ type: Number })
  lte?: number;

  @Expose()
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ type: Number })
  gt?: number;

  @Expose()
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ type: Number })
  gte?: number;

  @Expose()
  @IsOptional()
  @Type(() => NestedIntNullableFilter)
  @ApiPropertyOptional({ type: () => NestedIntNullableFilter })
  not?: NestedIntNullableFilter;
}
