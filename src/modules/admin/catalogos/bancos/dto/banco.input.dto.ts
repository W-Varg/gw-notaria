import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  IsOptional,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { BaseFilterDto } from 'src/common/dtos/filters.dto';
import { StringFilter } from 'src/common/dtos/prisma/string-filter.input';

export class CreateBancoDto {
  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({ type: String })
  nombre: string;
}

export class UpdateBancoDto extends PartialType(CreateBancoDto) {}

class BancoWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  nombre?: StringFilter;
}

class BancoSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  nombre?: boolean;
}

export class ListBancoArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: BancoWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => BancoWhereInput)
  where?: BancoWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: BancoSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => BancoSelectInput)
  select?: BancoSelectInput;
}
