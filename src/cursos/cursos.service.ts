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
import { User } from 'src/users/entities/user.entity';

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

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

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
   async createProgreso(createProgresoDto: CreateProgresoDto) {
    const { cursoId, usuarioId, estado } = createProgresoDto;

    const curso = await this.findOne(cursoId);
    if (!curso) throw new NotFoundException(`Curso ${cursoId} no encontrado`);

    const user = await this.userRepo.findOne({ where: { id: usuarioId } });
    if (!user) throw new NotFoundException(`Usuario ${usuarioId} no encontrado`);

    let progreso = await this.progresoRepo.findOne({
      where: { curso: { id: cursoId }, user: { id: usuarioId } },
    });

    if (progreso) {
      progreso.estado = estado || progreso.estado; 
      progreso = await this.progresoRepo.save(progreso);
    } else {
      progreso = this.progresoRepo.create({
        estado: estado || 'inscrito',
        curso,
        user,
      });
      progreso = await this.progresoRepo.save(progreso);
    }
    return {
      id: progreso.id,
      estado: progreso.estado,
      curso: {
        id: curso.id,
        nombre: curso.nombre,
        descripcion: curso.descripcion,
      },
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
      },
    };
  }

}
