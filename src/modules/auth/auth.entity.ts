import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthUsuario {
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
    type: Boolean,
    description: 'Estado de autenticación de dos factores',
    example: true,
  })
  twoFactorEnabled?: boolean;

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

  @ApiProperty({ type: AuthUsuario, description: 'Perfil del usuario autenticado' })
  user: AuthUsuario;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Indica si se requiere verificación de 2FA para completar el login',
    example: false,
  })
  requiresTwoFactor?: boolean;

  @ApiPropertyOptional({
    type: String,
    description:
      'Método de verificación OTP: "authenticator" para Google Authenticator, "email" para código por email',
    example: 'email',
    enum: ['authenticator', 'email'],
  })
  otpMethod?: 'authenticator' | 'email';
}

export class TwoFactorSetup {
  @ApiProperty({
    type: String,
    description: 'URL del código QR para escanear con Google Authenticator',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
  })
  qrCodeUrl: string;

  @ApiProperty({
    type: String,
    description: 'Clave secreta de respaldo (en caso de que no se pueda escanear el QR)',
    example: 'JBSWY3DPEHPK3PXP',
  })
  secret: string;

  @ApiProperty({
    type: String,
    description: 'Nombre de la aplicación para mostrar en Google Authenticator',
    example: 'TU-NOTARIA (usuario@example.com)',
  })
  appName: string;
}

/**
 * Datos del usuario de Google OAuth
 */
export interface GoogleUserData {
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  password: string;
}
