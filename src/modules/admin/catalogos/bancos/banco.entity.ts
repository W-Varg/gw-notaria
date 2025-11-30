import { ApiProperty } from '@nestjs/swagger';

export class Banco {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  nombre: string;
}

export class BancoDetail extends Banco {
  @ApiProperty({ isArray: true })
  cuentasBancarias: any[];
}
