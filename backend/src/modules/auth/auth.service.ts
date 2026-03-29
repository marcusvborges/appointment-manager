import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../hash/hash.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { standardizeEmail } from '../../common/utils/email.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await this.hashService.hash(registerDto.password);

    const user = await this.userService.create({
      name: registerDto.name,
      email: standardizeEmail(registerDto.email),
      password: hashedPassword,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUserCredentials(
      standardizeEmail(loginDto.email),
      loginDto.password,
    );

    const accessToken = this.generateTokenJwt(user);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  private async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (!user || !(await this.hashService.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  private generateTokenJwt(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
    };
    return this.jwtService.sign(payload);
  }
}
