import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Curso } from './entities/curso.entity';
import { Capitulo } from './entities/capitulo.entity';
import { Clase } from './entities/clase.entity';
import { Insignia } from './entities/insignia.entity';
import { Progreso } from './entities/progreso.entity';
import { Modulo } from './entities/modulo.entity';
import { CreateInsigniaDto } from './dto/create-insignia.dto';
import { CreateProgresoDto } from './dto/create-progreso.dto';
import { CreateCapituloDto } from './dto/create-capitulo.dto';
import { CreateClaseDto } from './dto/create-clase.dto';
import { CreateModuloDto } from './dto/create-modulo.dto';

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepo: Repository<Curso>,

    @InjectRepository(Capitulo)
    private readonly capituloRepo: Repository<Capitulo>,

    @InjectRepository(Clase)
    private readonly claseRepo: Repository<Clase>,

    @InjectRepository(Insignia)
    private readonly insigniaRepo: Repository<Insignia>,

    @InjectRepository(Progreso)
    private readonly progresoRepo: Repository<Progreso>,

    @InjectRepository(Modulo)
    private readonly moduloRepo: Repository<Modulo>,

  ) { }

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
  // -------------------------------
  // CAPÍTULOS
  // -------------------------------
async createCapitulo(createCapituloDto: CreateCapituloDto) {
  const { cursoId, ...data } = createCapituloDto;
  const curso = await this.cursoRepo.findOne({ where: { id: cursoId } });
  if (!curso) {
    throw new NotFoundException(`Curso con id ${cursoId} no encontrado`);
  }
  const capitulo = this.capituloRepo.create({
    ...data,
    curso, 
  });
  return await this.capituloRepo.save(capitulo);
}


  // -------------------------------
  // CLASES
  // -------------------------------
 async createClase(createClaseDto: CreateClaseDto) {
  const { capituloId, ...data } = createClaseDto;

  const capitulo = await this.capituloRepo.findOne({ where: { id: capituloId } });
  if (!capitulo) {
    throw new NotFoundException(`Capítulo con id ${capituloId} no encontrado`);
  }
  const clase = this.claseRepo.create({
    ...data,
    capitulo, 
  });
  return await this.claseRepo.save(clase);
}

    // -------------------------------
  // Modulos
  // -------------------------------
  async createModulo(createModuloDto: CreateModuloDto) {
    const modulo = this.moduloRepo.create(createModuloDto);
    return await this.moduloRepo.save(modulo);
  }

  // -------------------------------
  // INSIGNIAS
  // -------------------------------
async createInsignia(createInsigniaDto: CreateInsigniaDto) {
  const { cursoId, ...data } = createInsigniaDto;
  const curso = await this.cursoRepo.findOne({ where: { id: cursoId } });
  if (!curso) {
    throw new NotFoundException(`Curso con id ${cursoId} no encontrado`);
  }
  const insignia = this.insigniaRepo.create({
    ...data,
    curso,
  });
  return await this.insigniaRepo.save(insignia);
}


  // -------------------------------
  // PROGRESO
  // -------------------------------
  async createProgreso(cursoId: number, userId: number) {
    const curso = await this.findOne(cursoId);

    const progreso = this.progresoRepo.create({
      estado: "inscrito",
      curso,
      user: { id: userId } as any,
    });

    return await this.progresoRepo.save(progreso);
  }
}
