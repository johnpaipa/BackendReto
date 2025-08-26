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
import { UpdateCapituloDto } from './dto/update-capitulo.dto';
import { UpdateClaseDto } from './dto/update-clase.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';
import { UpdateInsigniaDto } from './dto/update-insignia.dto';
import { UpdateProgresoDto } from './dto/update-progreso.dto';
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

  // CURSOS CRUD
  async create(createCursoDto: CreateCursoDto) {
    const { moduloId, ...cursoData } = createCursoDto;

    const cursoCreateData: any = { ...cursoData };

    if (moduloId) {
      const modulo = await this.moduloRepo.findOne({ where: { id: moduloId } });
      if (!modulo) {
        throw new NotFoundException(`Módulo con id ${moduloId} no encontrado`);
      }
      cursoCreateData.modulo = modulo;
    }

    const curso = this.cursoRepo.create(cursoCreateData);
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
    if (curso.insignia) {
      await this.insigniaRepo.delete({ curso: { id } });
    }
    await this.progresoRepo.delete({ curso: { id } });

    if (curso.capitulos) {
      for (const capitulo of curso.capitulos) {
        await this.claseRepo.delete({ capitulo: { id: capitulo.id } });
      }
      await this.capituloRepo.delete({ curso: { id } });
    }

    return await this.cursoRepo.remove(curso);
  }

  // MODULOS CRUD 
  async createModulo(createModuloDto: CreateModuloDto) {
    const modulo = this.moduloRepo.create(createModuloDto);
    return await this.moduloRepo.save(modulo);
  }

  async findAllModulos() {
    return await this.moduloRepo.find({
      relations: ['cursos'],
    });
  }

  async findOneModulo(id: number) {
    const modulo = await this.moduloRepo.findOne({
      where: { id },
      relations: ['cursos', 'cursos.capitulos'],
    });
    if (!modulo) {
      throw new NotFoundException(`Módulo con id ${id} no encontrado`);
    }
    return modulo;
  }

  async updateModulo(id: number, updateModuloDto: UpdateModuloDto) {
    const modulo = await this.moduloRepo.preload({
      id,
      ...updateModuloDto,
    });
    if (!modulo) {
      throw new NotFoundException(`Módulo con id ${id} no encontrado`);
    }
    return await this.moduloRepo.save(modulo);
  }

  async removeModulo(id: number) {
    const modulo = await this.findOneModulo(id);
    return await this.moduloRepo.remove(modulo);
  }

  // CAPITULOS CRUD
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

  async findAllCapitulos() {
    return await this.capituloRepo.find({
      relations: ['curso', 'clases'],
    });
  }

  async findCapitulosByCurso(cursoId: number) {
    const curso = await this.cursoRepo.findOne({ where: { id: cursoId } });
    if (!curso) {
      throw new NotFoundException(`Curso con id ${cursoId} no encontrado`);
    }
    return await this.capituloRepo.find({
      where: { curso: { id: cursoId } },
      relations: ['clases'],
      order: { orden: 'ASC' },
    });
  }

  async findOneCapitulo(id: number) {
    const capitulo = await this.capituloRepo.findOne({
      where: { id },
      relations: ['curso', 'clases'],
    });
    if (!capitulo) {
      throw new NotFoundException(`Capítulo con id ${id} no encontrado`);
    }
    return capitulo;
  }

  async updateCapitulo(id: number, updateCapituloDto: UpdateCapituloDto) {
    const capitulo = await this.capituloRepo.preload({
      id,
      ...updateCapituloDto,
    });
    if (!capitulo) {
      throw new NotFoundException(`Capítulo con id ${id} no encontrado`);
    }
    return await this.capituloRepo.save(capitulo);
  }

  async removeCapitulo(id: number) {
    const capitulo = await this.findOneCapitulo(id);
    return await this.capituloRepo.remove(capitulo);
  }

  // CLASES CRUD  
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

  async findAllClases() {
    return await this.claseRepo.find({
      relations: ['capitulo', 'capitulo.curso'],
    });
  }

  async findClasesByCapitulo(capituloId: number) {
    const capitulo = await this.capituloRepo.findOne({ where: { id: capituloId } });
    if (!capitulo) {
      throw new NotFoundException(`Capítulo con id ${capituloId} no encontrado`);
    }
    return await this.claseRepo.find({
      where: { capitulo: { id: capituloId } },
      relations: ['capitulo'],
      order: { id: 'ASC' },
    });
  }

  async findOneClase(id: number) {
    const clase = await this.claseRepo.findOne({
      where: { id },
      relations: ['capitulo', 'capitulo.curso'],
    });
    if (!clase) {
      throw new NotFoundException(`Clase con id ${id} no encontrado`);
    }
    return clase;
  }

  async updateClase(id: number, updateClaseDto: UpdateClaseDto) {
    const clase = await this.claseRepo.preload({
      id,
      ...updateClaseDto,
    });
    if (!clase) {
      throw new NotFoundException(`Clase con id ${id} no encontrado`);
    }
    return await this.claseRepo.save(clase);
  }

  async removeClase(id: number) {
    const clase = await this.findOneClase(id);
    return await this.claseRepo.remove(clase);
  }


  // INSIGNIAS CRUD
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

  async findAllInsignias() {
    return await this.insigniaRepo.find({
      relations: ['curso'],
    });
  }

  async findInsigniasByCurso(cursoId: number) {
    const curso = await this.cursoRepo.findOne({ where: { id: cursoId } });
    if (!curso) {
      throw new NotFoundException(`Curso con id ${cursoId} no encontrado`);
    }
    return await this.insigniaRepo.find({
      where: { curso: { id: cursoId } },
      relations: ['curso'],
    });
  }

  async findOneInsignia(id: number) {
    const insignia = await this.insigniaRepo.findOne({
      where: { id },
      relations: ['curso'],
    });
    if (!insignia) {
      throw new NotFoundException(`Insignia con id ${id} no encontrado`);
    }
    return insignia;
  }

  async updateInsignia(id: number, updateInsigniaDto: UpdateInsigniaDto) {
    const insignia = await this.insigniaRepo.preload({
      id,
      ...updateInsigniaDto,
    });
    if (!insignia) {
      throw new NotFoundException(`Insignia con id ${id} no encontrado`);
    }
    return await this.insigniaRepo.save(insignia);
  }

  async removeInsignia(id: number) {
    const insignia = await this.findOneInsignia(id);
    return await this.insigniaRepo.remove(insignia);
  }


  // PROGRESO CRUD
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

  async findAllProgresos() {
    return await this.progresoRepo.find({
      relations: ['curso', 'user'],
    });
  }

  async findProgresosByUser(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
    }
    return await this.progresoRepo.find({
      where: { user: { id: userId } },
      relations: ['curso', 'curso.modulo'],
      order: { id: 'DESC' },
    });
  }

  async findProgresosByCurso(cursoId: number) {
    const curso = await this.cursoRepo.findOne({ where: { id: cursoId } });
    if (!curso) {
      throw new NotFoundException(`Curso con id ${cursoId} no encontrado`);
    }
    return await this.progresoRepo.find({
      where: { curso: { id: cursoId } },
      relations: ['user'],
    });
  }

  async findOneProgreso(id: number) {
    const progreso = await this.progresoRepo.findOne({
      where: { id },
      relations: ['curso', 'user'],
    });
    if (!progreso) {
      throw new NotFoundException(`Progreso con id ${id} no encontrado`);
    }
    return progreso;
  }

  async updateProgreso(id: number, updateProgresoDto: UpdateProgresoDto) {
    const progreso = await this.progresoRepo.preload({
      id,
      ...updateProgresoDto,
    });
    if (!progreso) {
      throw new NotFoundException(`Progreso con id ${id} no encontrado`);
    }
    return await this.progresoRepo.save(progreso);
  }

  async removeProgreso(id: number) {
    const progreso = await this.findOneProgreso(id);
    return await this.progresoRepo.remove(progreso);
  }


  // METODOS ESPECIALES DE CONSULTA

  async getCursoCompleto(cursoId: number) {
    const curso = await this.cursoRepo.findOne({
      where: { id: cursoId },
      relations: [
        'modulo',
        'capitulos',
        'capitulos.clases',
        'insignia',
        'progresos',
        'progresos.user'
      ],
      order: {
        capitulos: {
          orden: 'ASC'
        }
      }
    });

    if (!curso) {
      throw new NotFoundException(`Curso con id ${cursoId} no encontrado`);
    }
    if (curso.capitulos) {
      curso.capitulos.forEach(capitulo => {
        if (capitulo.clases) {
          capitulo.clases.sort((a, b) => a.id - b.id);
        }
      });
    }

    return curso;
  }
  async getUserDashboard(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
    }

    const progresos = await this.progresoRepo.find({
      where: { user: { id: userId } },
      relations: ['curso', 'curso.modulo'],
    });

    const cursosCompletados = progresos.filter(p => p.estado === 'completado').length;
    const cursosEnProgreso = progresos.filter(p => p.estado === 'en_progreso').length;
    const cursosInscritos = progresos.filter(p => p.estado === 'inscrito').length;

    return {
      usuario: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
      },
      estadisticas: {
        cursosCompletados,
        cursosEnProgreso,
        cursosInscritos,
        totalCursos: progresos.length,
      },
      progresos,
    };
  }

  async getCursoStats(cursoId: number) {
    const curso = await this.findOne(cursoId);

    const progresos = await this.progresoRepo.find({
      where: { curso: { id: cursoId } },
      relations: ['user'],
    });

    const totalEstudiantes = progresos.length;
    const completados = progresos.filter(p => p.estado === 'completado').length;
    const enProgreso = progresos.filter(p => p.estado === 'en_progreso').length;
    const inscritos = progresos.filter(p => p.estado === 'inscrito').length;

    return {
      curso: {
        id: curso.id,
        nombre: curso.nombre,
        descripcion: curso.descripcion,
      },
      estadisticas: {
        totalEstudiantes,
        completados,
        enProgreso,
        inscritos,
        tasaCompletacion: totalEstudiantes > 0 ? (completados / totalEstudiantes * 100).toFixed(2) : 0,
      },
      estudiantes: progresos.map(p => ({
        id: p.user.id,
        nombre: p.user.nombre,
        correo: p.user.correo,
        estado: p.estado,
      })),
    };
  }
}