import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthUser {
  @ApiProperty({
    type: String,
    description: 'ID único del usuario',
    example: 'clr1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'Email del usuario',
    example: 'usuario@example.com',
  })
  email: string;

  @ApiProperty({
    type: String,
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  nombre: string;

  @ApiProperty({
    type: String,
    description: 'Apellidos del usuario',
    example: 'Pérez García',
  })
  apellidos: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Teléfono del usuario',
    example: '+56912345678',
  })
  telefono?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Dirección del usuario',
    example: 'Calle Falsa 123, Santiago',
  })
  direccion?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'URL del avatar del usuario',
    example: '/uploads/avatars/avatar-123.png',
  })
  avatar?: string;

  @ApiProperty({
    type: Boolean,
    description: 'Estado activo del usuario',
    example: true,
  })
  estaActivo: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Estado de verificación del email',
    example: true,
  })
  emailVerificado?: boolean;

  @ApiProperty({
    type: Date,
    description: 'Fecha de creación del usuario',
    example: '2024-01-15T10:30:00Z',
  })
  fechaCreacion?: Date;

  @ApiProperty({
    type: Date,
    description: 'Fecha de última actualización del usuario',
    example: '2024-01-15T10:30:00Z',
  })
  fechaActualizacion?: Date;
}

export class UserProfile {
  @ApiProperty({
    type: String,
    description: 'ID del usuario',
    example: 'clr1234567890abcdef',
  })
  usuarioId: string;

  @ApiProperty({
    type: String,
    description: 'Email del usuario',
    example: 'usuario@example.com',
  })
  email: string;

  @ApiProperty({
    type: String,
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  nombre: string;

  @ApiProperty({
    type: String,
    description: 'Apellidos del usuario',
    example: 'Pérez García',
  })
  apellidos: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Teléfono del usuario',
    example: '+56912345678',
  })
  telefono?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Dirección del usuario',
    example: 'Calle Falsa 123, Santiago',
  })
  direccion?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'URL del avatar del usuario',
    example: '/uploads/avatars/avatar-123.png',
  })
  avatar?: string;

  @ApiProperty({
    type: Boolean,
    description: 'Estado activo del usuario',
    example: true,
  })
  estaActivo: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Estado de verificación del email',
    example: true,
  })
  emailVerificado?: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Indica si el usuario es empleado',
    example: false,
  })
  esEmpleado: boolean;
}

export class AuthResponse {
  @ApiProperty({
    type: String,
    description: 'Token de acceso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    type: String,
    description: 'Token de refresh para renovar la sesión',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Lista de roles del usuario',
    example: ['CLIENT', 'USER'],
    default: [],
  })
  roles?: string[];

  @ApiPropertyOptional({
    type: [String],
    description: 'Lista de permisos del usuario',
    example: ['productos:ver', 'pedidos:crear'],
    default: [],
  })
  permissions?: string[];

  @ApiProperty({
    type: UserProfile,
    description: 'Perfil del usuario autenticado',
  })
  user: UserProfile;
}

export class TokenPayload {
  @ApiProperty({
    type: String,
    description: 'ID del usuario',
    example: 'clr1234567890abcdef',
  })
  usuarioId: string;

  @ApiProperty({
    type: String,
    description: 'Email del usuario',
    example: 'usuario@example.com',
  })
  email: string;

  @ApiProperty({
    type: [String],
    description: 'Roles del usuario',
    example: ['CLIENT', 'USER'],
  })
  roles: string[];

  @ApiProperty({
    type: Date,
    description: 'Fecha de emisión del token',
    example: '2024-01-15T10:30:00Z',
  })
  iat?: number;

  @ApiProperty({
    type: Date,
    description: 'Fecha de expiración del token',
    example: '2024-01-15T10:45:00Z',
  })
  exp?: number;
}
