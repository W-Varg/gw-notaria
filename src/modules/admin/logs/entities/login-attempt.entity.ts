import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginAttempt {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  exitoso: boolean;

  @ApiPropertyOptional({ nullable: true })
  motivoFallo: string | null;

  @ApiProperty()
  ip: string;

  @ApiPropertyOptional({ nullable: true })
  userAgent: string | null;

  @ApiPropertyOptional({ nullable: true })
  ubicacion: string | null;

  @ApiPropertyOptional({ nullable: true })
  dispositivo: string | null;

  @ApiPropertyOptional({ nullable: true })
  navegador: string | null;

  @ApiProperty()
  intentosSospechoso: boolean;

  @ApiProperty()
  bloqueado: boolean;

  @ApiProperty()
  fechaIntento: Date;
}
