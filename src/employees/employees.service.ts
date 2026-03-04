import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee, EmployeeStatus } from './employee.entity';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  UpdateStatusDto,
} from './employee.dto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeeRepository.create({
      ...createEmployeeDto,
      status: createEmployeeDto.status || EmployeeStatus.WORKING,
    });
    return this.employeeRepository.save(employee);
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.findOne(id);
    Object.assign(employee, updateEmployeeDto);
    return this.employeeRepository.save(employee);
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateStatusDto,
  ): Promise<Employee> {
    const employee = await this.findOne(id);
    employee.status = updateStatusDto.status;
    return this.employeeRepository.save(employee);
  }

  async remove(id: string): Promise<void> {
    const employee = await this.findOne(id);
    if (employee.avatarUrl) {
      const filePath = path.join(
        process.cwd(),
        'uploads',
        path.basename(employee.avatarUrl),
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    await this.employeeRepository.remove(employee);
  }

  async updateAvatar(
    id: string,
    filename: string,
    baseUrl: string,
  ): Promise<Employee> {
    const employee = await this.findOne(id);
    if (employee.avatarUrl) {
      const oldPath = path.join(
        process.cwd(),
        'uploads',
        path.basename(employee.avatarUrl),
      );
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    employee.avatarUrl = `${baseUrl}/uploads/${filename}`;
    return this.employeeRepository.save(employee);
  }

  async removeAvatar(id: string): Promise<Employee> {
    const employee = await this.findOne(id);
    employee.avatarUrl = null;
    return this.employeeRepository.save(employee);
  }
}
