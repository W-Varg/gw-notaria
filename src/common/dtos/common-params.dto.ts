import { Expose } from 'class-transformer';
import { ParamsIntValidator, ParamsStringValidator } from '../decorators/params.decorator';

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
}
