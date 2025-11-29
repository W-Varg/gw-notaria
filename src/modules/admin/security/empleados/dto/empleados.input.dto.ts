import { ApiProperty, ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { BaseFilterDto } from 'src/common/dtos/filters.dto';
import { BoolFilter } from 'src/common/dtos/prisma/bool-filter.input';
import { StringFilter } from 'src/common/dtos/prisma/string-filter.input';
import { StringNullableFilter } from 'src/common/dtos/prisma/string-nullable-filter.input';
import { DateTimeFilter } from 'src/common/dtos/prisma/date-time-filter.input';

export class CreateEmpleadoDto {
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'ID del usuario' })
  @Expose()
  usuarioId: string;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional({ type: String, description: 'ID de la sucursal (opcional)' })
  @Expose()
  sucursalId?: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(2)
  @ApiProperty({ type: String, description: 'Cargo del empleado' })
  @Expose()
  cargo: string;

  @Expose()
  @IsDefined()
  @IsDateString()
  @ApiProperty({ type: String, format: 'date', description: 'Fecha de contratación' })
  @Expose()
  fechaContratacion: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ type: Number, description: 'Salario del empleado' })
  @Expose()
  salario?: number;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: 'Horario de trabajo' })
  @Expose()
  horarioTrabajo?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: 'Notas adicionales' })
  @Expose()
  notas?: string;

  @Expose()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true, message: 'Cada roleId debe ser un número' })
  @ApiPropertyOptional({
    description: 'Array de IDs de roles para el usuario del empleado',
    type: [Number],
  })
  @Expose()
  rolesIds?: number[];
}

export class UpdateEmpleadoDto extends PartialType(OmitType(CreateEmpleadoDto, ['usuarioId'])) {
  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  @Expose()
  estaActivo?: boolean;

  @Expose()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true, message: 'Cada roleId debe ser un número' })
  @ApiPropertyOptional({
    description: 'Array de IDs de roles para el usuario del empleado',
    type: [Number],
  })
  @Expose()
  rolesIds?: number[];
}

class EmpleadoWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  @Expose()
  sucursalId?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  @Expose()
  cargo?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: DateTimeFilter })
  @IsOptional()
  @Type(() => DateTimeFilter)
  @Expose()
  fechaContratacion?: DateTimeFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  @Expose()
  estaActivo?: BoolFilter;
}

class EmpleadoSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  usuarioId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  sucursalId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  cargo?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  fechaContratacion?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  salario?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  horarioTrabajo?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  notas?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  estaActivo?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  fechaCreacion?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  fechaActualizacion?: boolean;
}

export class ListEmpleadoArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: EmpleadoWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmpleadoWhereInput)
  @Expose()
  where?: EmpleadoWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: EmpleadoSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmpleadoSelectInput)
  @Expose()
  select?: EmpleadoSelectInput;
}
