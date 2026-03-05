import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getAllUsers(): string {
    return 'This action returns all users';
  }
  getById(id: string): string {
    return `This action returns a user with id ${id}`;
  }
  findByEmail(email: string): string {
    return `This action returns a user with email ${email}`;
  }
  create(data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): string {
    return `This action creates a user with name ${data.name}, email ${data.email} and role ${data.role}`;
  }
}
