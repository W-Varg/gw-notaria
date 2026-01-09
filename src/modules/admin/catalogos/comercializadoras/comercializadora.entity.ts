import { Comercializadora as ComercializadoraModel } from 'src/generated/prisma/client';

export class Comercializadora implements ComercializadoraModel {
  id: number;
  nombre: string;
  tipo: number;
  metaData: any;
  departamento: string;
  clienteId: string;
  consolidado: boolean;
  minuta: string | null;
  protocolo: string | null;
  fechaEnvio: Date | null;
  fechaEnvioTestimonio: Date | null;
  userCreateId: string;
  userUpdateId: string | null;
  fechaCreacion: Date;
  fechaActualizacion: Date;

  // Relaciones opcionales
  cliente?: any;
  servicios?: any[];
}
