import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './global/database/prisma.service';

describe('AppService', () => {
  let service: AppService;
  let configService: jest.Mocked<ConfigService>;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn(),
    };
    const mockPrismaService = {
      checkConnection: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<AppService>(AppService);
    configService = module.get(ConfigService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPing', () => {
    it('should return ping data', () => {
      const mockPackageJson = {
        author: 'test-author',
        description: 'test-description',
        name: 'test-app',
        version: '1.0.0',
      };

      configService.get.mockReturnValue(mockPackageJson);

      const result = service.getPing();

      expect(result).toEqual({
        error: false,
        message: 'test-description',
        response: {
          data: {
            author: 'test-author',
            dateTimeServer: expect.any(Date),
            nameApp: 'test-app',
            version: '1.0.0',
          },
        },
        status: 200,
      });
    });
  });

  describe('getHealth', () => {
    it('should return healthy status when DB is connected', async () => {
      prismaService.checkConnection.mockResolvedValue(true);

      const result = await service.getHealth();

      expect(result).toEqual({
        error: false,
        message: 'Servicio operativo conexion exitosa',
        response: {
          data: {
            status: 'healthy',
            database: true,
            timestamp: expect.any(Date),
          },
        },
        status: 200,
      });
    });

    it('should return unhealthy status when DB is not connected', async () => {
      prismaService.checkConnection.mockResolvedValue(false);

      const result = await service.getHealth();

      expect(result).toEqual({
        error: true,
        message: 'Problema con la conexión a la base de datos',
        response: {
          data: {
            status: 'unhealthy',
            database: false,
            timestamp: expect.any(Date),
          },
        },
        status: 503,
      });
    });
  });
});
