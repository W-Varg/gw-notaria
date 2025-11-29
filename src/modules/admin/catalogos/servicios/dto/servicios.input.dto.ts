import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { BaseFilterDto } from 'src/common/dtos/filters.dto';
import { BoolFilter } from 'src/common/dtos/prisma/bool-filter.input';
import { StringFilter } from 'src/common/dtos/prisma/string-filter.input';
import { FloatFilter } from 'src/common/dtos/prisma/float-filter.input';

export class CreateServicioDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @Expose()
  nombre: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @Expose()
  descripcion: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  categoria: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Expose()
  precio?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  duracion?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  @Expose()
  estaActivo?: boolean;
}

export class UpdateServicioDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  @Expose()
  nombre?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  @Expose()
  descripcion?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  categoria?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Expose()
  precio?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  duracion?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  @Expose()
  estaActivo?: boolean;
}

export class ServicioWhereInput {
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  @Expose()
  nombre?: StringFilter;

  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  @Expose()
  descripcion?: StringFilter;

  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  @Expose()
  categoria?: StringFilter;

  @ApiPropertyOptional({ type: FloatFilter })
  @IsOptional()
  @Type(() => FloatFilter)
  @Expose()
  precio?: FloatFilter;

  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  @Expose()
  estaActivo?: BoolFilter;
}

export class ListServiciosArgsDto extends BaseFilterDto {
  @ApiPropertyOptional({ type: ServicioWhereInput })
  @IsOptional()
  @Type(() => ServicioWhereInput)
  @Expose()
  where?: ServicioWhereInput;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @Expose()
  select?: string[];
}

export class CreateImagenServicioDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  servicioId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  url: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  @Expose()
  esPrincipal?: boolean;
}
