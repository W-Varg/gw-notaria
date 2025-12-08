import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsEmail,
  IsDefined,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { BaseFilterDto } from 'src/common/dtos/filters.dto';
import { StringFilter } from 'src/common/dtos/prisma/string-filter.input';
import { StringNullableFilter } from 'src/common/dtos/prisma/string-nullable-filter.input';

export class CreateMensajeContactoDto {
  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  usuarioId?: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({ type: String })
  nombre: string;

  @Expose()
  @IsDefined()
  @IsEmail()
  @ApiProperty({ type: String })
  correo: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiPropertyOptional({ type: String })
  telefono?: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  @ApiProperty({ type: String })
  asunto: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(10)
  @ApiProperty({ type: String })
  mensaje: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  categoria?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  estado?: string;
}

export class UpdateMensajeContactoDto extends PartialType(CreateMensajeContactoDto) {}

class MensajeContactoWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  usuarioId?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  nombre?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  correo?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  asunto?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  categoria?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  estado?: StringFilter;
}

class MensajeContactoSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  usuarioId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  nombre?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  correo?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  telefono?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  asunto?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  mensaje?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  categoria?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  estado?: boolean;
}

export class ListMensajeContactoArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: MensajeContactoWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => MensajeContactoWhereInput)
  where?: MensajeContactoWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: MensajeContactoSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => MensajeContactoSelectInput)
  select?: MensajeContactoSelectInput;
}
