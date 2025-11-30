import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Banco } from '../bancos/banco.entity';

export class CuentaBancaria {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Number })
  bancoId: number;

  @ApiProperty({ type: String })
  numeroCuenta: string;

  @ApiPropertyOptional({ type: String })
  tipoCuenta?: string;

  @ApiProperty({ type: Number })
  saldoActual: any;
}

export class CuentaBancariaDetail extends CuentaBancaria {
  @ApiProperty({ type: () => Banco })
  banco: Banco;
}
