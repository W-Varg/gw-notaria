import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  private releaseId: string;

  constructor(private readonly configService: ConfigService) {
    this.releaseId = this.getReleaseId();
  }

  private getReleaseId(): string {
    try {
      const releaseIdPath = path.join(process.cwd(), 'RELEASE_ID');
      if (fs.existsSync(releaseIdPath)) {
        return fs.readFileSync(releaseIdPath, 'utf8').trim();
      }
    } catch (error) {
      // Ignore error if file not found
    }
    return 'unknown';
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user } = request;
    const environment = this.configService.get('ENV_ENTORNO') || 'development';

    const userId = user?.id || 'anonymous';
    
    // Only log if not health check to avoid spamming, or if requirement demands it.
    // Requirement says: "Logs backend deben incluir: versión, ambiente, user_id en operaciones de compra/venta"
    // We'll log everything for now but could filter.

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        
        this.logger.log({
          message: `Request completed`,
          method,
          url,
          statusCode,
          duration: `${Date.now() - now}ms`,
          environment,
          releaseId: this.releaseId,
          userId,
        });
      }),
    );
  }
}
