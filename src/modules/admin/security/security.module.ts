import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { RolesModule } from './roles/roles.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PermisosModule } from './permisos/permisos.module';

const modules = [PermisosModule, RolesModule, UsuariosModule];
@Module({
  imports: [
    ...modules,
    RouterModule.register(
      modules.map((module) => ({
        path: 'admin/security',
        module,
      })),
    ),
  ],
})
export class SecurityModule {}
