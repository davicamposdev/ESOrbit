import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/common/database/prisma.service';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    app.setGlobalPrefix('api');

    await app.init();

    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: `e2e-test-users-${Date.now()}@example.com`,
        password: 'senha123',
        username: 'Users Test User',
      });

    accessToken = res.body.accessToken;
    userId = res.body.user.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'e2e-test-users',
        },
      },
    });
    await app.close();
  });

  describe('GET /api/users/:id', () => {
    it('deve buscar usuário por ID com autenticação', () => {
      return request(app.getHttpServer())
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.user).toBeDefined();
          expect(res.body.user.id).toBe(userId);
          expect(res.body.user.email).toBeDefined();
          expect(res.body.user.username).toBe('Users Test User');
          expect(res.body.user.credits).toBe(10000);
          expect(res.body.user.createdAt).toBeDefined();
          expect(res.body.user.updatedAt).toBeDefined();
        });
    });

    it('deve retornar 401 sem autenticação', () => {
      return request(app.getHttpServer())
        .get(`/api/users/${userId}`)
        .expect(401);
    });

    it('deve retornar 401 com token inválido', () => {
      return request(app.getHttpServer())
        .get(`/api/users/${userId}`)
        .set('Authorization', 'Bearer token-invalido')
        .expect(401);
    });

    it('deve retornar 404 para ID inexistente', () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      return request(app.getHttpServer())
        .get(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('deve retornar 400 para ID inválido', () => {
      return request(app.getHttpServer())
        .get('/api/users/id-invalido')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });
  });
});
