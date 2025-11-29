import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { UsuarioSelectInput } from './usuarios.input.dto';

export class UsuarioRolSelect {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  id?: true;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  usuarioId?: true;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  rolId?: true;

  @Expose()
  @ApiPropertyOptional({ type: () => UsuarioSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => UsuarioSelectInput)
  @Expose()
  usuario?: UsuarioSelectInput;
}
