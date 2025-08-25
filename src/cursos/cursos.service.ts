import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Curso } from './entities/curso.entity';

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepo: Repository<Curso>,
  ) {}

  async create(createCursoDto: CreateCursoDto) {
    const curso = this.cursoRepo.create(createCursoDto);
    return await this.cursoRepo.save(curso);
  }

  async findAll() {
    return await this.cursoRepo.find({
      relations: ['capitulos', 'insignia', 'modulo'], 
    });
  }

  async findOne(id: number) {
    const curso = await this.cursoRepo.findOne({
      where: { id },
      relations: ['capitulos', 'insignia', 'modulo', 'progresos'],
    });
    if (!curso) {
      throw new NotFoundException(`Curso con id ${id} no encontrado`);
    }
    return curso;
  }

  async update(id: number, updateCursoDto: UpdateCursoDto) {
    const curso = await this.cursoRepo.preload({
      id,
      ...updateCursoDto,
    });
    if (!curso) {
      throw new NotFoundException(`Curso con id ${id} no encontrado`);
    }
    return await this.cursoRepo.save(curso);
  }

  async remove(id: number) {
    const curso = await this.findOne(id);
    return await this.cursoRepo.remove(curso);
  }
}
