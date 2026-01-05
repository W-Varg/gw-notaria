import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsEmail,
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
  IsInt,
  MaxLength,
  MinLength,
  ValidateNested,
  ValidateIf,
  IsDateString,
} from 'class-validator';
import { BaseFilterDto } from 'src/common/dtos/filters.dto';
import { StringFilter } from 'src/common/dtos/prisma/string-filter.input';
import { StringNullableFilter } from 'src/common/dtos/prisma/string-nullable-filter.input';
import { TipoClienteEnum } from 'src/enums/tipo-cliente.enum';

// DTOs para PersonaNatural
export class CreatePersonaNaturalDto {
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiPropertyOptional({ type: String })
  ci?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  @ApiPropertyOptional({ type: String })
  expedido?: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ type: String })
  nombres: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ type: String })
  apellidos: string;

  @Expose()
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ type: String, format: 'date' })
  fechaNacimiento?: string;
}

// DTOs para PersonaJuridica
export class CreatePersonaJuridicaDto {
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiPropertyOptional({ type: String })
  nit?: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MaxLength(150)
  @ApiProperty({ type: String })
  razonSocial: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  @ApiPropertyOptional({ type: String })
  representanteLegal?: string;
}

// DTO principal para Cliente
export class CreateClienteDto {
  @Expose()
  @IsDefined()
  @IsInt()
  @ApiProperty({ type: Number, enum: TipoClienteEnum, description: '1 = NATURAL, 2 = JURIDICA' })
  tipo: TipoClienteEnum;

  @Expose()
  @IsDefined()
  @IsEmail()
  @MaxLength(100)
  @ApiProperty({ type: String })
  email: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiPropertyOptional({ type: String })
  telefono?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  direccion?: string;

  // Datos específicos según tipo
  @Expose()
  @ValidateIf((o) => o.tipo === TipoClienteEnum.NATURAL)
  @IsDefined()
  @ValidateNested()
  @Type(() => CreatePersonaNaturalDto)
  @ApiPropertyOptional({ type: CreatePersonaNaturalDto })
  personaNatural?: CreatePersonaNaturalDto;

  @Expose()
  @ValidateIf((o) => o.tipo === TipoClienteEnum.JURIDICA)
  @IsDefined()
  @ValidateNested()
  @Type(() => CreatePersonaJuridicaDto)
  @ApiPropertyOptional({ type: CreatePersonaJuridicaDto })
  personaJuridica?: CreatePersonaJuridicaDto;
}

export class UpdateClienteDto extends PartialType(CreateClienteDto) {}

class ClienteWhereInput {
  @Expose()
  @ApiPropertyOptional({
    type: Number,
    enum: TipoClienteEnum,
    description: '1 = NATURAL, 2 = JURIDICA',
  })
  @IsOptional()
  @IsInt()
  tipo?: TipoClienteEnum;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  email?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  telefono?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  direccion?: StringNullableFilter;
}

class ClienteSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  tipo?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  email?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  telefono?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  direccion?: boolean;
}

export class ListClienteArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: ClienteWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => ClienteWhereInput)
  where?: ClienteWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: ClienteSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => ClienteSelectInput)
  select?: ClienteSelectInput;
}
