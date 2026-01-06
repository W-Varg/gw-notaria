import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoClienteEnum } from 'src/enums/tipo-cliente.enum';

export class PersonaNatural {
  @ApiProperty()
  clienteId: string;

  @ApiProperty()
  tipoDocumento: string;

  @ApiProperty()
  numeroDocumento: string;

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

export class ClienteEntity {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: Number, enum: TipoClienteEnum, description: '1 = NATURAL, 2 = JURIDICA' })
  tipo: TipoClienteEnum;

  @ApiPropertyOptional()
  email?: string;

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
