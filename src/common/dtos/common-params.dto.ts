import { Expose } from 'class-transformer';
import { ParamsIntValidator, ParamsStringValidator } from '../decorators/params.decorator';
import { IsUUID, Length } from 'class-validator';

/**
 * DTOs comunes para parámetros de rutas
 * Centraliza los DTOs más utilizados para evitar duplicación
 *
 * Uso en controllers:
 * @Param() params: CommonParamsDto.CasoId
 * @Param() params: CommonParamsDto.UsuarioId
 */
export namespace CommonParamsDto {
  /**
   * DTO genérico para ID
   */
  export class Id {
    @Expose()
    @ParamsIntValidator({ description: 'ID numérico', example: 1 })
    id: number;
  }

  export class IdString {
    @Expose()
    @ParamsStringValidator({ description: 'ID de texto', example: 'abc123' })
    id: string;
  }

  export class IdUuid {
    @IsUUID('4', { message: 'El ID debe ser un UUID válido (versión 4)' })
    @Length(36, 36, { message: 'El ID UUID debe tener exactamente 36 caracteres' })
    @ParamsStringValidator({
      description: 'ID UUID versión 4',
      maxLength: 36,
      example: '0f68b4e2-ae5b-43e4-80ec-53d9e41e4426',
      format: 'uuid',
    })
    id: string;
  }

  /**
   * DTO para ID CUID (Collision-resistant Unique ID)
   */
  export class IdCuid {
    @Expose()
    @Length(25, 26, { message: 'El ID CUID debe tener entre 25 y 26 caracteres' })
    @ParamsStringValidator({
      description: 'ID CUID',
      maxLength: 26,
      example: 'cjld2cjxh0000qzrmn831i7rn',
    })
    id: string;
  }
}
