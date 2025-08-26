import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(correo: string, contrasena: string) {
    const user = await this.usersService.findByEmail(correo);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');

    // Retornamos el user sin contraseña
    const { contrasena: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { username: user.correo, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
