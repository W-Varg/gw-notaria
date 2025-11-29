import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { RolSelectInput } from './roles.input.dto';

export class RolPermisoSelect {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  id?: true;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  rolId?: true;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  permisoId?: true;

  @Expose()
  @ApiPropertyOptional({ type: () => RolSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => RolSelectInput)
  @Expose()
  rol: RolSelectInput;
}
