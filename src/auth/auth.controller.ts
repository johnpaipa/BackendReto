import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() user: { email: string; password: string }) {
    // validacion de usuario en DB
    const fakeUser = { id: 1, email: user.email }; 
    return this.authService.login(fakeUser);
  }
}
