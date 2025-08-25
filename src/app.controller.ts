import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtected(@Request() req: any): string {
    
    return `Bienvenido usuario con id: ${req.user.userId} y email: ${req.user.email}`;
  }

  
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
