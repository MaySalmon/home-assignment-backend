import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee, EmployeeStatus } from './employee.entity';

const mockEmployee: Employee = {
  id: 'test-uuid-1234',
  name: 'John Doe',
  role: 'Engineer',
  status: EmployeeStatus.WORKING,
  avatarUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};

describe('EmployeesService', () => {
  let service: EmployeesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        { provide: getRepositoryToken(Employee), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('should return an array of employees', async () => {
      mockRepository.find.mockResolvedValue([mockEmployee]);
      const result = await service.findAll();
      expect(result).toEqual([mockEmployee]);
    });

    it('should return empty array when no employees', async () => {
      mockRepository.find.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return an employee by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockEmployee);
      const result = await service.findOne('test-uuid-1234');
      expect(result).toEqual(mockEmployee);
    });

    it('should throw NotFoundException when not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new employee', async () => {
      const dto = { name: 'Jane Smith', role: 'Designer' };
      mockRepository.create.mockReturnValue({ ...mockEmployee, ...dto });
      mockRepository.save.mockResolvedValue({ ...mockEmployee, ...dto });
      const result = await service.create(dto);
      expect(result.name).toBe('Jane Smith');
    });

    it('should default status to Working', async () => {
      const dto = { name: 'Jane Smith', role: 'Designer' };
      mockRepository.create.mockReturnValue({ ...mockEmployee, status: EmployeeStatus.WORKING });
      mockRepository.save.mockResolvedValue({ ...mockEmployee, status: EmployeeStatus.WORKING });
      const result = await service.create(dto);
      expect(result.status).toBe(EmployeeStatus.WORKING);
    });
  });

  describe('updateStatus', () => {
    it('should update the status', async () => {
      const updated = { ...mockEmployee, status: EmployeeStatus.ON_VACATION };
      mockRepository.findOne.mockResolvedValue({ ...mockEmployee });
      mockRepository.save.mockResolvedValue(updated);
      const result = await service.updateStatus('test-uuid-1234', { status: EmployeeStatus.ON_VACATION });
      expect(result.status).toBe(EmployeeStatus.ON_VACATION);
    });

    it('should throw NotFoundException for unknown employee', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(
        service.updateStatus('bad-id', { status: EmployeeStatus.WORKING }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an employee', async () => {
      mockRepository.findOne.mockResolvedValue(mockEmployee);
      mockRepository.remove.mockResolvedValue(undefined);
      await expect(service.remove('test-uuid-1234')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException for unknown employee', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.remove('bad-id')).rejects.toThrow(NotFoundException);
    });
  });
});