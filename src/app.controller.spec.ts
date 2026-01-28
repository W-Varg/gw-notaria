import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './global/database/prisma.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn().mockReturnValue({
        author: 'test-author',
        description: 'test-description',
        name: 'test-app',
        version: '1.0.0',
      }),
    };
    const mockPrismaService = {
      checkConnection: jest.fn().mockResolvedValue(true),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return ping data', () => {
      const result = appController.getHello();
      expect(result).toHaveProperty('error', false);
      expect(result).toHaveProperty('status', 200);
    });
  });

  describe('health', () => {
    it('should return health data', async () => {
      const result = await appController.getHealth();
      expect(result).toHaveProperty('response');
      expect(result.response.data).toHaveProperty('status');
    });
  });
});
