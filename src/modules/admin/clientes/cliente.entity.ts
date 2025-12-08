import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoClienteEnum } from 'src/generated/prisma/enums';

export class PersonaNatural {
  @ApiProperty()
  clienteId: string;

  @ApiPropertyOptional()
  ci?: string;

  @ApiPropertyOptional()
  expedido?: string;

  @ApiProperty()
  nombres: string;

  @ApiProperty()
  apellidos: string;

  @ApiPropertyOptional()
  fechaNacimiento?: Date;

  @ApiProperty()
  userCreateId: string;

  @ApiPropertyOptional()
  userUpdateId?: string;

  @ApiProperty()
  fechaCreacion: Date;

  @ApiProperty()
  fechaActualizacion: Date;
}

export class PersonaJuridica {
  @ApiProperty()
  clienteId: string;

  @ApiPropertyOptional()
  nit?: string;

  @ApiProperty()
  razonSocial: string;

  @ApiPropertyOptional()
  representanteLegal?: string;

  @ApiProperty()
  userCreateId: string;

  @ApiPropertyOptional()
  userUpdateId?: string;

  @ApiProperty()
  fechaCreacion: Date;

  @ApiProperty()
  fechaActualizacion: Date;
}

export class Cliente {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: TipoClienteEnum })
  tipo: TipoClienteEnum;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  telefono?: string;

  @ApiPropertyOptional()
  direccion?: string;

  @ApiProperty()
  userCreateId: string;

  @ApiPropertyOptional()
  userUpdateId?: string;

  @ApiProperty()
  fechaCreacion: Date;

  @ApiProperty()
  fechaActualizacion: Date;

  @ApiPropertyOptional({ type: PersonaNatural })
  personaNatural?: PersonaNatural;

  @ApiPropertyOptional({ type: PersonaJuridica })
  personaJuridica?: PersonaJuridica;
}
