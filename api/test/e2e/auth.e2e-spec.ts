import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/common/database/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

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
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'e2e-test',
        },
      },
    });
    await app.close();
  });

  describe('POST /api/auth/register', () => {
    it('deve registrar um novo usuário com sucesso', () => {
      const email = `e2e-test-${Date.now()}@example.com`;

      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email,
          password: 'senha123',
          username: 'E2E Test User',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.user).toBeDefined();
          expect(res.body.user.email).toBe(email);
          expect(res.body.user.username).toBe('E2E Test User');
          expect(res.body.user.credits).toBe(10000);
          expect(res.body.accessToken).toBeDefined();
          expect(res.headers['set-cookie']).toBeDefined();
        });
    });

    it('deve retornar 409 ao tentar registrar email duplicado', async () => {
      const email = `e2e-test-duplicate-${Date.now()}@example.com`;

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email,
          password: 'senha123',
          username: 'First User',
        })
        .expect(201);

      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email,
          password: 'senha123',
          username: 'Second User',
        })
        .expect(409);
    });

    it('deve validar campos obrigatórios', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: '123', // muito curta
        })
        .expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    const testEmail = `e2e-test-login-${Date.now()}@example.com`;
    const testPassword = 'senha123';

    beforeAll(async () => {
      await request(app.getHttpServer()).post('/api/auth/register').send({
        email: testEmail,
        password: testPassword,
        username: 'Login Test User',
      });
    });

    it('deve fazer login com credenciais válidas', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.user).toBeDefined();
          expect(res.body.user.email).toBe(testEmail);
          expect(res.body.accessToken).toBeDefined();
          expect(res.headers['set-cookie']).toBeDefined();
        });
    });

    it('deve retornar 401 com senha incorreta', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'senhaerrada',
        })
        .expect(401);
    });

    it('deve retornar 401 com email inexistente', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'naoexiste@example.com',
          password: 'senha123',
        })
        .expect(401);
    });
  });

  describe('GET /api/auth/me', () => {
    let accessToken: string;
    const testEmail = `e2e-test-me-${Date.now()}@example.com`;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: testEmail,
          password: 'senha123',
          username: 'Me Test User',
        });

      accessToken = res.body.accessToken;
    });

    it('deve retornar dados do usuário autenticado', () => {
      return request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.user).toBeDefined();
          expect(res.body.user.email).toBe(testEmail);
        });
    });

    it('deve retornar 401 sem token', () => {
      return request(app.getHttpServer()).get('/api/auth/me').expect(401);
    });

    it('deve retornar 401 com token inválido', () => {
      return request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', 'Bearer token-invalido')
        .expect(401);
    });
  });

  describe('POST /api/auth/refresh', () => {
    let cookies: string[];

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: `e2e-test-refresh-${Date.now()}@example.com`,
          password: 'senha123',
          username: 'Refresh Test User',
        });

      cookies = Array.isArray(res.headers['set-cookie'])
        ? res.headers['set-cookie']
        : [res.headers['set-cookie']];
    });

    it('deve renovar access token com refresh token válido', () => {
      return request(app.getHttpServer())
        .post('/api/auth/refresh')
        .set('Cookie', cookies)
        .expect(200)
        .expect((res) => {
          expect(res.body.accessToken).toBeDefined();
          expect(res.headers['set-cookie']).toBeDefined();
        });
    });

    it('deve retornar 401 sem refresh token', () => {
      return request(app.getHttpServer()).post('/api/auth/refresh').expect(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    let cookies: string[];

    beforeEach(async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: `e2e-test-logout-${Date.now()}@example.com`,
          password: 'senha123',
          username: 'Logout Test User',
        });

      cookies = Array.isArray(res.headers['set-cookie'])
        ? res.headers['set-cookie']
        : [res.headers['set-cookie']];
    });

    it('deve fazer logout com sucesso', () => {
      return request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Cookie', cookies)
        .expect(200)
        .expect((res) => {
          expect(res.body.ok).toBe(true);
        });
    });

    it('refresh não deve funcionar após logout', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Cookie', cookies)
        .expect(200);

      return request(app.getHttpServer())
        .post('/api/auth/refresh')
        .set('Cookie', cookies)
        .expect(401);
    });
  });
});
