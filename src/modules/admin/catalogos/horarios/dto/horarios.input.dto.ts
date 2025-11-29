import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { BaseFilterDto, PaginationQueryDto } from 'src/common/dtos/filters.dto';
import { BoolFilter } from 'src/common/dtos/prisma/bool-filter.input';
import { StringFilter } from 'src/common/dtos/prisma/string-filter.input';
import { StringNullableFilter } from 'src/common/dtos/prisma/string-nullable-filter.input';

const DIAS_SEMANA = [
  'Lunes',
  'Martes',
  'Miercoles',
  'Jueves',
  'Viernes',
  'Sabado',
  'Domingo',
] as const;

export class CreateHorarioDto {
  @Expose()
  @IsDefined()
  @IsString()
  @ApiProperty({ description: 'ID de la sucursal', type: String })
  @Expose()
  sucursalId: string;

  @Expose()
  @IsDefined()
  @IsString()
  @IsIn(DIAS_SEMANA as unknown as string[])
  @ApiProperty({ enum: DIAS_SEMANA, type: String })
  @Expose()
  diaSemana: (typeof DIAS_SEMANA)[number];

  @Expose()
  @IsDefined()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  @ApiProperty({ description: 'Formato HH:MM 24h', example: '08:00', type: String })
  @Expose()
  horaApertura: string;

  @Expose()
  @IsDefined()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  @ApiProperty({ description: 'Formato HH:MM 24h', example: '18:00', type: String })
  @Expose()
  horaCierre: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  @Expose()
  estaActivo?: boolean;
}

export class UpdateHorarioDto extends PartialType(CreateHorarioDto) {
  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  @Expose()
  estaActivo?: boolean;
}

export class HorarioWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  @Expose()
  sucursalId?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  @Expose()
  diaSemana?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  @Expose()
  estaActivo?: BoolFilter;
}

export class HorarioSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  sucursalId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  diaSemana?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  horaApertura?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  horaCierre?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  estaActivo?: boolean;
}

export class ListHorarioArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: HorarioWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => HorarioWhereInput)
  @Expose()
  where?: HorarioWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: HorarioSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => HorarioSelectInput)
  @Expose()
  select?: HorarioSelectInput;
}
