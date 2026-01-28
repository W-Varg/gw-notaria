import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api'); // Agregar prefijo global para tests
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api (GET)', () => {
    return request(app.getHttpServer()).get('/api').expect(200);
  });

  it('/api/health (GET) - should return healthy status', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', false);
        expect(res.body).toHaveProperty('message', 'Servicio operativo conexion exitosa');
        expect(res.body.response.data).toHaveProperty('status', 'healthy');
        expect(res.body.response.data).toHaveProperty('database', true);
        expect(res.body.response.data).toHaveProperty('timestamp');
      });
  });
});
