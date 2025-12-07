import { SetMetadata } from '@nestjs/common';
import { TipoAccionEnum } from '../../generated/prisma/client';

export const AUDIT_KEY = 'audit';

export interface AuditMetadata {
  accion: TipoAccionEnum;
  modulo: string;
  tabla?: string;
  descripcion?: string;
}

/**
 * Decorador para marcar métodos que deben ser auditados
 *
 * @example
 * @Audit({ accion: TipoAccionEnum.CREATE, modulo: 'usuarios', tabla: 'auth_usuarios' })
 * async create(data: CreateUsuarioDto) { ... }
 */
export const Audit = (metadata: AuditMetadata) => SetMetadata(AUDIT_KEY, metadata);
