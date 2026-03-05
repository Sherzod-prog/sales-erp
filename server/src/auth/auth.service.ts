import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async register(name: string, email: string, password: string) {
    const existing = await this.userService.findByEmail(email);
    if (existing) {
      throw new Error('User already exists');
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userService.create({
      name,
      email,
      password: hashed,
      role: 'MANAGER',
    });
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user || typeof user === 'string') {
      throw new UnauthorizedException('Invalid credentials');
    }
    const userObj = user as any;
    const valid = await bcrypt.compare(password, userObj.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      email: userObj.email,
      sub: userObj.id,
      role: userObj.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
