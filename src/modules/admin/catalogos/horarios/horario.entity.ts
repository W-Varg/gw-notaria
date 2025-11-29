import { ApiProperty } from '@nestjs/swagger';

export class Horario {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  sucursalId: string;

  @ApiProperty({ type: String })
  diaSemana: string;

  @ApiProperty({ type: String })
  horaApertura: string;

  @ApiProperty({ type: String })
  horaCierre: string;

  @ApiProperty({ type: Boolean })
  estaActivo: boolean = true;
}

export class HorarioDetail extends Horario {
  // Aquí se pueden agregar relaciones si es necesario
}
