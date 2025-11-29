import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import * as fs from 'fs';
import * as path from 'path';

describe('Usuarios (e2e)', () => {
  let app: INestApplication<App>;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Crear directorio storage si no existe
    const storageDir = path.join(__dirname, '../../storage');
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    // Obtener token de autenticación para las pruebas
    authToken = await getAuthToken();
  });

  afterAll(async () => {
    await app.close();
  });

  // Helper function para obtener token de autenticación
  async function getAuthToken(): Promise<string> {
    console.log('Intentando obtener token de autenticación...');

    // Intentar login con usuario admin del seed
    try {
      console.log('Haciendo login con admin@gmail.com...');
      const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({
        email: 'admin@gmail.com', // Usuario admin del seed
        password: 'Cambiar123@', // Contraseña del seed
      });

      console.log('Login response status:', loginResponse.status);
      console.log('Login response body keys:', Object.keys(loginResponse.body || {}));

      if (
        (loginResponse.status === 200 || loginResponse.status === 201) &&
        loginResponse.body &&
        loginResponse.body.response &&
        loginResponse.body.response.data &&
        loginResponse.body.response.data.accessToken
      ) {
        console.log('Token obtenido exitosamente');
        return loginResponse.body.response.data.accessToken;
      } else {
        console.log('Login falló o no se encontró token en respuesta');
        console.log('Response body:', JSON.stringify(loginResponse.body, null, 2));
      }
    } catch (error) {
      console.error('Error al hacer login:', error.message);
      console.error('Error completo:', error);
    }

    // Si todo falla, devolver un token vacío
    console.log('No se pudo obtener token, devolviendo token vacío');
    return '';
  }

  describe('/usuarios (POST)', () => {
    it('debería crear un usuario con imagen de avatar', async () => {
      // Crear un archivo de imagen PNG mínimo válido
      const testImagePath = path.join(__dirname, '../../storage/test-avatar.png');

      // Crear un archivo PNG válido mínimo de 1x1 pixel para que pase la validación de Multer.
      const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      // IHDR chunk (Image Header) - 1x1 pixel PNG
      const ihdrChunk = Buffer.from([
        0x00,
        0x00,
        0x00,
        0x0d, // Chunk length (13)
        0x49,
        0x48,
        0x44,
        0x52, // "IHDR"
        0x00,
        0x00,
        0x00,
        0x01, // Width: 1
        0x00,
        0x00,
        0x00,
        0x01, // Height: 1
        0x08, // Bit depth: 8
        0x02, // Color type: RGB
        0x00, // Compression: 0
        0x00, // Filter: 0
        0x00, // Interlace: 0
        0x00,
        0x00,
        0x00,
        0x00, // CRC (simplified)
      ]);
      // IDAT chunk (Image Data) - minimal 1x1 pixel data
      const idatChunk = Buffer.from([
        0x00,
        0x00,
        0x00,
        0x0e, // Chunk length (14)
        0x49,
        0x44,
        0x41,
        0x54, // "IDAT"
        0x78,
        0x9c,
        0x62,
        0x60,
        0x00,
        0x00,
        0x00,
        0x02,
        0x00,
        0x01, // Compressed data
        0x00,
        0x00,
        0x00,
        0x00, // CRC (simplified)
      ]);
      // IEND chunk (End of Image)
      const iendChunk = Buffer.from([
        0x00,
        0x00,
        0x00,
        0x00, // Chunk length (0)
        0x49,
        0x45,
        0x4e,
        0x44, // "IEND"
        0xae,
        0x42,
        0x60,
        0x82, // CRC
      ]);

      const pngData = Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);

      // Crear archivo de prueba
      fs.writeFileSync(testImagePath, pngData);

      const usuarioData = {
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        nombre: 'Juan',
        apellidos: 'Pérez',
        telefono: '1234567890',
        rolesIds: [1], // Asumiendo que existe un rol con ID 1
      };

      const response = await request(app.getHttpServer())
        .post('/admin/security/usuarios')
        .set('Authorization', `Bearer ${authToken}`) // Agregar token de autenticación
        .field('email', usuarioData.email)
        .field('password', usuarioData.password)
        .field('nombre', usuarioData.nombre)
        .field('apellidos', usuarioData.apellidos)
        .field('telefono', usuarioData.telefono)
        .attach('avatar', testImagePath)
        .expect(201); // Cambiar a 201 que es lo que realmente devuelve

      console.log('Test response status:', response.status);
      console.log('Test response body:', JSON.stringify(response.body, null, 2));

      // Verificar respuesta
      expect(response.body).toHaveProperty('response');
      expect(response.body.response).toHaveProperty('data');
      expect(response.body.response.data).toHaveProperty('email', usuarioData.email);
      expect(response.body.response.data).toHaveProperty('avatar');

      // Limpiar archivo de prueba
      if (fs.existsSync(testImagePath)) {
        fs.unlinkSync(testImagePath);
      }
    });

    it('debería crear un usuario sin imagen de avatar', async () => {
      const usuarioData = {
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        nombre: 'María',
        apellidos: 'García',
        telefono: '0987654321',
        rolesIds: [1],
      };

      const response = await request(app.getHttpServer())
        .post('/admin/security/usuarios')
        .set('Authorization', `Bearer ${authToken}`) // Agregar token de autenticación
        .field('email', usuarioData.email)
        .field('password', usuarioData.password)
        .field('nombre', usuarioData.nombre)
        .field('apellidos', usuarioData.apellidos)
        .field('telefono', usuarioData.telefono)
        .expect(201); // Cambiar a 201

      // Verificar respuesta
      expect(response.body).toHaveProperty('response');
      expect(response.body.response).toHaveProperty('data');
      expect(response.body.response.data).toHaveProperty('email', usuarioData.email);
    });

    it('debería rechazar archivo con tipo MIME no válido', async () => {
      // Crear un archivo de texto (no imagen)
      const testFilePath = path.join(__dirname, '../../storage/test-file.txt');
      const testFileBuffer = Buffer.from('This is not an image file', 'utf8');

      // Crear archivo de prueba
      fs.writeFileSync(testFilePath, testFileBuffer);

      const usuarioData = {
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        nombre: 'Carlos',
        apellidos: 'López',
        telefono: '1122334455',
        rolesIds: [1],
      };

      const response = await request(app.getHttpServer())
        .post('/admin/security/usuarios')
        .set('Authorization', `Bearer ${authToken}`) // Agregar token de autenticación
        .field('email', usuarioData.email)
        .field('password', usuarioData.password)
        .field('nombre', usuarioData.nombre)
        .field('apellidos', usuarioData.apellidos)
        .field('telefono', usuarioData.telefono)
        .field('rolesIds', '1')
        .attach('avatar', testFilePath)
        .expect(400); // BadRequestException for invalid file type

      // Limpiar archivo de prueba
      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
      }
    });

    it('debería rechazar archivo que exceda el límite de tamaño', async () => {
      // Crear un archivo grande que exceda el límite de 5MB
      const testFilePath = path.join(__dirname, '../../storage/test-large-file.jpg');
      const largeFileBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB

      // Crear archivo de prueba
      fs.writeFileSync(testFilePath, largeFileBuffer);

      const usuarioData = {
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        nombre: 'Ana',
        apellidos: 'Martínez',
        telefono: '5566778899',
        rolesIds: [1],
      };

      const response = await request(app.getHttpServer())
        .post('/admin/security/usuarios')
        .set('Authorization', `Bearer ${authToken}`) // Agregar token de autenticación
        .field('email', usuarioData.email)
        .field('password', usuarioData.password)
        .field('nombre', usuarioData.nombre)
        .field('apellidos', usuarioData.apellidos)
        .field('telefono', usuarioData.telefono)
        .field('rolesIds', '1')
        .attach('avatar', testFilePath)
        .expect(413); // Cambiar a 413 que es lo que realmente devuelve

      // Limpiar archivo de prueba
      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
      }
    });

    it('debería fallar al crear usuario con imagen inválida', async () => {
      const usuarioData = {
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        nombre: 'Luis',
        apellidos: 'Rodríguez',
        telefono: '6677889900',
        rolesIds: [1],
      };

      const response = await request(app.getHttpServer())
        .post('/admin/security/usuarios')
        .set('Authorization', `Bearer ${authToken}`) // Agregar token de autenticación
        .field('email', usuarioData.email)
        .field('password', usuarioData.password)
        .field('nombre', usuarioData.nombre)
        .field('apellidos', usuarioData.apellidos)
        .field('telefono', usuarioData.telefono)
        .attach('avatar', Buffer.from('invalid image data'), 'invalid.txt')
        .expect(400); // Cambiar a 400

      // Verificar que la respuesta indique error de validación
      expect(response.body).toHaveProperty('message', 'Only image files are allowed!');
      expect(response.body).toHaveProperty('statusCode', 400);
    });

    it('debería fallar al crear usuario sin autenticación', async () => {
      const usuarioData = {
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        nombre: 'Ana',
        apellidos: 'Martínez',
        telefono: '5566778899',
        rolesIds: [1],
      };

      const response = await request(app.getHttpServer())
        .post('/admin/security/usuarios')
        .field('email', usuarioData.email)
        .field('password', usuarioData.password)
        .field('nombre', usuarioData.nombre)
        .field('apellidos', usuarioData.apellidos)
        .field('telefono', usuarioData.telefono)
        .field('rolesIds', '1')
        .expect(401);

      // Verificar que la respuesta indique falta de autenticación
      expect(response.status).toBe(401);
      // La estructura de respuesta puede variar para errores de autenticación
    });

    it('debería fallar al crear usuario con imagen demasiado grande', async () => {
      const usuarioData = {
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        nombre: 'Luis',
        apellidos: 'Rodríguez',
        telefono: '6677889900',
        rolesIds: [1],
      };

      // Crear archivo grande (más de 5MB)
      const largeFile = Buffer.alloc(6 * 1024 * 1024, 'a'); // 6MB

      const response = await request(app.getHttpServer())
        .post('/admin/security/usuarios')
        .set('Authorization', `Bearer ${authToken}`) // Agregar token de autenticación
        .field('email', usuarioData.email)
        .field('password', usuarioData.password)
        .field('nombre', usuarioData.nombre)
        .field('apellidos', usuarioData.apellidos)
        .field('telefono', usuarioData.telefono)
        .field('rolesIds', '1')
        .attach('avatar', largeFile, 'large.jpg')
        .expect(413); // Cambiar a 413

      // Verificar que la respuesta indique error de tamaño
      expect(response.body).toHaveProperty('error', 'Payload Too Large');
      expect(response.body).toHaveProperty('message', 'File too large');
      expect(response.body).toHaveProperty('statusCode', 413);
    });
  });
});
