import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async login(loginDto: LoginDto): Promise<{
    access_token: string;
    refresh_token: string;
    user: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
    }
  }> {
    // Find user by email
    const user = await this.userService.findOneByEmail(loginDto.email);

    // Verify user exists and password matches
    if (!user || !(await this.userService.compareHashPassword(loginDto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create JWT payload
    const payload = { sub: user.id, email: user.email };

    // Generate access token
    const accessToken = await this.jwtService.signAsync(payload);

    // Generate refresh token with longer expiration
    const refreshToken = await this.jwtService.signAsync(
      payload,
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    // Return tokens and user data
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    };
  }
}
