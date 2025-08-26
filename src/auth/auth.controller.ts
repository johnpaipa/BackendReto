import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body('correo') correo: string,
    @Body('contrasena') contrasena: string,
  ) {
    const user = await this.authService.validateUser(correo, contrasena);
    return this.authService.login(user);
  }
}
