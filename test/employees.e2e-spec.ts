import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EmployeesModule } from '../src/employees/employees.module';
import { Employee, EmployeeStatus } from '../src/employees/employee.entity';

describe('EmployeesController (e2e)', () => {
  let app: INestApplication;
  let createdEmployeeId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false },
          entities: [Employee],
          synchronize: true,
          dropSchema: true,
        }),
        EmployeesModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/employees', () => {
    it('should create a new employee', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/employees')
        .send({ name: 'Alice Johnson', role: 'Product Manager' })
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe('Alice Johnson');
      expect(res.body.status).toBe(EmployeeStatus.WORKING);
      createdEmployeeId = res.body.id;
    });

    it('should reject invalid payload', async () => {
      await request(app.getHttpServer())
        .post('/api/employees')
        .send({ name: '' })
        .expect(400);
    });
  });

  describe('GET /api/employees', () => {
    it('should return list of employees', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/employees')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('PATCH /api/employees/:id/status', () => {
    it('should update employee status', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/employees/${createdEmployeeId}/status`)
        .send({ status: EmployeeStatus.ON_VACATION })
        .expect(200);

      expect(res.body.status).toBe(EmployeeStatus.ON_VACATION);
    });

    it('should reject invalid status', async () => {
      await request(app.getHttpServer())
        .patch(`/api/employees/${createdEmployeeId}/status`)
        .send({ status: 'InvalidStatus' })
        .expect(400);
    });
  });

  describe('DELETE /api/employees/:id', () => {
    it('should delete an employee', async () => {
      await request(app.getHttpServer())
        .delete(`/api/employees/${createdEmployeeId}`)
        .expect(204);
    });

    it('should return 404 after deletion', async () => {
      await request(app.getHttpServer())
        .get(`/api/employees/${createdEmployeeId}`)
        .expect(404);
    });
  });
});