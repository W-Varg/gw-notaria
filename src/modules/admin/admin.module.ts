import { Module } from '@nestjs/common';
import { SecurityModule } from './security/security.module';
import { CatalogosModule } from './catalogos/catalogos.module';
import { NotificacionModule } from './notificaciones/notificacion.module';
import { FaqModule } from './faqs/faq.module';
import { LogsModule } from './logs/logs.module';
import { ClienteModule } from './clientes/cliente.module';
import { ServicioModule } from './servicios/servicio.module';
import { ResponsableServicioModule } from './servicios/responsable-servicio/responsable-servicio.module';
import { HistorialEstadosServicioModule } from './servicios/historial-estados-servicio/historial-estados-servicio.module';
import { FinanzasModule } from './finanzas/finanzas.module';
import { MensajeContactoModule } from './contacto/mensajes-contacto/mensaje-contacto.module';

@Module({
  imports: [
    CatalogosModule,
    SecurityModule,
    NotificacionModule,
    FaqModule,
    LogsModule,
    // modulo de clientes
    ClienteModule,
    // modulo de servicios
    ServicioModule,
    ResponsableServicioModule,
    HistorialEstadosServicioModule,

    FinanzasModule,

    MensajeContactoModule,
  ],
})
export class AdminModule {}
