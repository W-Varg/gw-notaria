import { ApiProperty } from '@nestjs/swagger';
import { CuentaBancaria } from '../cuentas-bancarias/cuenta-bancaria.entity';

export class BancoEntity {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  nombre: string;
}

export class BancoDetail extends BancoEntity {
  @ApiProperty({ isArray: true, type: () => CuentaBancaria })
  cuentasBancarias: CuentaBancaria[];
}
