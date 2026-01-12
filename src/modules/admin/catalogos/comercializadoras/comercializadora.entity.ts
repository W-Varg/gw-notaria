import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClienteEntity } from '../../clientes/cliente.entity';
import { SucursalEntity } from '../sucursales/sucursal.entity';
import { ServicioEntity } from '../../servicios/servicio.entity';

export class ComercializadoraEntity {
  @ApiProperty({ description: 'ID único de la comercializadora', example: 1 })
  id: number;

  @ApiProperty({ description: 'Tipo: 1=techo, 2=monumental', example: 1, enum: [1, 2] })
  tipoComercializadora: number;

  @ApiProperty({
    description: 'Metadatos (proyecto, mza, lote, etc.)',
    example: { proyectoUrb: 'Los Pinos', mza: 'A', lote: '10' },
  })
  metaData: any;

  @ApiProperty({ description: 'ID de la sucursal', example: 1 })
  sucursalId: number;

  @ApiProperty({ description: 'ID del cliente asociado', example: 'clkxxx123456789' })
  clienteId: string;

  @ApiPropertyOptional({ description: 'Indica si está consolidado', example: false })
  consolidado?: boolean;

  @ApiPropertyOptional({ description: 'Minuta', example: 'Minuta 123/2026' })
  minuta?: string;

  @ApiPropertyOptional({ description: 'Protocolo', example: 'Protocolo 456/2026' })
  protocolo?: string;

  @ApiPropertyOptional({
    description: 'Fecha de recepcion en físico',
    example: '2026-01-09T00:00:00.000Z',
  })
  fechaEnvio?: Date;

  @ApiPropertyOptional({
    description: 'Fecha de envío del testimonio',
    example: '2026-01-09T00:00:00.000Z',
  })
  fechaEnvioTestimonio?: Date;

  @ApiProperty({ description: 'ID del usuario que creó el registro', example: 'usr123' })
  userCreateId: string;

  @ApiPropertyOptional({
    description: 'ID del usuario que actualizó el registro',
    example: 'usr456',
  })
  userUpdateId: string | null;

  @ApiProperty({ description: 'Fecha de creación', example: '2026-01-09T10:00:00.000Z' })
  fechaCreacion: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2026-01-09T15:30:00.000Z',
  })
  fechaActualizacion: Date;
}

export class ComercializadoraDetail extends ComercializadoraEntity {
  @ApiPropertyOptional({
    description: 'Información del cliente asociado',
    type: () => ClienteEntity,
  })
  cliente?: ClienteEntity;

  @ApiPropertyOptional({ description: 'Información de la sucursal', type: () => SucursalEntity })
  sucursal?: SucursalEntity;

  @ApiPropertyOptional({ description: 'Lista de servicios asociados', type: 'array' })
  servicios?: Array<ServicioEntity>;
}
