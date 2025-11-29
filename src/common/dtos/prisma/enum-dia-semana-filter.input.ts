import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DiaSemana } from '../../../enums/dia-semana.enum';
import { NestedEnumDiaSemanaFilter } from './nested-enum-dia-semana-filter.input';
import { IsArray, IsEnum } from 'class-validator';

export class EnumDiaSemanaFilter {
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
  @ApiPropertyOptional({ type: () => NestedEnumDiaSemanaFilter })
  not?: NestedEnumDiaSemanaFilter;
}
