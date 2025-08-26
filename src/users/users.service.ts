import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }



  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.contrasena, salt);

    const user = this.userRepo.create({
      ...createUserDto,
      contrasena: hashedPassword,
    });

    return await this.userRepo.save(user);
  }
  
  async validateUser(correo: string, contrasena: string) {
  const user = await this.userRepo.findOne({ where: { correo } });
  if (!user) return null;

  const isMatch = await bcrypt.compare(contrasena, user.contrasena);
  if (isMatch) {
    return user;
  }
  return null;
}


  async findAll() {
    return await this.userRepo.find({
      relations: ['progresos'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['progresos'],
    });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.preload({
      id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return await this.userRepo.save(user);
  }

  async findByEmail(correo: string) {
    return await this.userRepo.findOne({ where: { correo } });
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return await this.userRepo.remove(user);
  }

}
