import { ApiProperty } from '@nestjs/swagger';
import { Empleado as EmpleadoPrisma } from 'src/generated/prisma/client';
import { Usuario } from '../usuarios/usuario.entity';
import { SucursalEntity } from '../../catalogos/sucursales/sucursal.entity';

export class Empleado implements EmpleadoPrisma {
  @ApiProperty()
  id: string;
  @ApiProperty()
  usuarioId: string;
  @ApiProperty()
  sucursalId: string | null;
  @ApiProperty()
  cargo: string;
  @ApiProperty()
  fechaContratacion: Date;
  @ApiProperty()
  salario: number | null;
  @ApiProperty()
  horarioTrabajo: string | null;
  @ApiProperty()
  estaActivo: boolean;
  @ApiProperty()
  fechaCreacion: Date;
  @ApiProperty()
  fechaActualizacion: Date;
  @ApiProperty()
  notas: string | null;

  @ApiProperty({ type: Usuario })
  usuario?: Usuario;

  @ApiProperty({ type: SucursalEntity })
  sucursal?: SucursalEntity;
}
