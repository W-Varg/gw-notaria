import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DiaSemana } from '../../../enums/dia-semana.enum';
import { NestedEnumDiaSemanaWithAggregatesFilter } from './nested-enum-dia-semana-with-aggregates-filter.input';
import { NestedIntFilter } from './nested-int-filter.input';
import { NestedEnumDiaSemanaFilter } from './nested-enum-dia-semana-filter.input';
import { IsArray, IsEnum } from 'class-validator';

export class EnumDiaSemanaWithAggregatesFilter {
  @Expose()
  @ApiPropertyOptional({ enum: DiaSemana })
  @IsEnum(DiaSemana)
  equals?: DiaSemana;

  @Expose()
  @ApiPropertyOptional({ enum: DiaSemana, isArray: true })
  @IsArray()
  @IsEnum(DiaSemana, { each: true })
  in?: Array<DiaSemana>;

  @Expose()
  @ApiPropertyOptional({ enum: DiaSemana, isArray: true })
  @IsArray()
  @IsEnum(DiaSemana, { each: true })
  notIn?: Array<DiaSemana>;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedEnumDiaSemanaWithAggregatesFilter })
  not?: NestedEnumDiaSemanaWithAggregatesFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedIntFilter })
  _count?: NestedIntFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedEnumDiaSemanaFilter })
  _min?: NestedEnumDiaSemanaFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedEnumDiaSemanaFilter })
  _max?: NestedEnumDiaSemanaFilter;
}
