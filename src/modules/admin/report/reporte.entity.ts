import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Reporte {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  nombre: string;

  @ApiPropertyOptional({ type: String })
  descripcion?: string;

  @ApiProperty({ type: String })
  tipo: string; // 'ventas', 'inventario', 'clientes', etc.

  @ApiProperty({ type: Object })
  parametros: Record<string, any>; // Parámetros del reporte

  @ApiPropertyOptional({ type: String })
  formato?: string; // 'pdf', 'excel', 'csv'

  @ApiProperty({ type: String })
  estado: string; // 'generando', 'completado', 'error'

  @ApiPropertyOptional({ type: String })
  urlArchivo?: string; // URL del archivo generado

  @ApiProperty({ type: Date })
  fechaCreacion: Date;

  @ApiProperty({ type: Date })
  fechaActualizacion: Date;

  @ApiPropertyOptional({ type: Date })
  fechaGeneracion?: Date;
}

export class ReporteDetail extends Reporte {
  @ApiProperty({ type: Object })
  datos?: any; // Datos del reporte generado
}
