import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { MensajeEnviadoEntity, InformacionContactoEntity } from '../entities/contacto.entity';

export class ResponseMensajeDataType {
  @ApiProperty({ type: () => MensajeEnviadoEntity })
  @Type(() => MensajeEnviadoEntity)
  @Expose()
  data: MensajeEnviadoEntity;
}

export class ResponseContactoDataType {
  @ApiProperty({ type: () => InformacionContactoEntity })
  @Type(() => InformacionContactoEntity)
  @Expose()
  data: InformacionContactoEntity;
}

export class ResponseMensajeType {
  @ApiProperty()
  @IsBoolean()
  @Expose()
  error: boolean;

  @ApiProperty()
  @IsString()
  @Expose()
  message: string;

  @ApiProperty({ type: () => ResponseMensajeDataType })
  @Type(() => ResponseMensajeDataType)
  @Expose()
  response: ResponseMensajeDataType;

  @ApiProperty()
  @IsNumber()
  @Expose()
  status: number;
}

export class ResponseContactoType {
  @ApiProperty()
  @IsBoolean()
  @Expose()
  error: boolean;

  @ApiProperty()
  @IsString()
  @Expose()
  message: string;

  @ApiProperty({ type: () => ResponseContactoDataType })
  @Type(() => ResponseContactoDataType)
  @Expose()
  response: ResponseContactoDataType;

  @ApiProperty()
  @IsNumber()
  @Expose()
  status: number;
}
