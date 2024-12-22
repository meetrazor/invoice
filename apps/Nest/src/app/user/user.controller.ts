import {
  Body,
  Controller,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string
  ) {
    const user = await this.userService.register(email, password);
    return { message: 'User registered successfully', user };
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string
  ) {
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwtService.sign(
      { userId: user.id, email: user.email },
      { secret: 'test' }
    );
    await this.userService.saveToken(user.id, token);
    return { message: 'Login successful', token };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    const userId = req.user.userId; // Extracted from validated JWT
    await this.userService.logout(userId);
    return { message: 'Logout successful' };
  }
}
