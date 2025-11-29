import { Global, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EmailService } from './email.service';
import { StockAlertService } from './stock-alert.service';
import { WebhookService } from './webhook.service';
import { MonitoringService } from './monitoring.service';

@Global()
@Module({
  providers: [
    NotificationService,
    EmailService,
    StockAlertService,
    WebhookService,
    MonitoringService,
  ],
  exports: [
    NotificationService,
    EmailService,
    StockAlertService,
    WebhookService,
    MonitoringService,
  ],
})
export class ExtraServicesModule {}
