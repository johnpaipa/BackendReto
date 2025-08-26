import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, ParseIntPipe, UsePipes } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';
import { CreateCapituloDto } from './dto/create-capitulo.dto';
import { UpdateCapituloDto } from './dto/update-capitulo.dto';
import { CreateClaseDto } from './dto/create-clase.dto';
import { UpdateClaseDto } from './dto/update-clase.dto';
import { CreateInsigniaDto } from './dto/create-insignia.dto';
import { UpdateInsigniaDto } from './dto/update-insignia.dto';
import { CreateProgresoDto } from './dto/create-progreso.dto';
import { UpdateProgresoDto } from './dto/update-progreso.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('cursos')
export class CursosController {
  constructor(
    private readonly cursosService: CursosService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  @Get('/progreso')
  @UseInterceptors()
  @UsePipes()
  findAllProgresos() {
    return this.cursosService.findAllProgresos();
  }

  @Get('/modulos')
  findAllModulos() {
    return this.cursosService.findAllModulos();
  }

  @Get('/capitulos')
  findAllCapitulos() {
    return this.cursosService.findAllCapitulos();
  }

  @Get('/clases')
  findAllClases() {
    return this.cursosService.findAllClases();
  }
  
  @Get('/insignias')
  findAllInsignias() {
    return this.cursosService.findAllInsignias();
  }

  // CURSOS ENDPOINTS
  @Post()
  create(@Body() createCursoDto: CreateCursoDto) {
    return this.cursosService.create(createCursoDto);
  }

  @Get()
  findAll() {
    return this.cursosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cursosService.findOne(id);
  }

  @Get(':id/completo')
  getCursoCompleto(@Param('id', ParseIntPipe) id: number) {
    return this.cursosService.getCursoCompleto(id);
  }

  @Get(':id/stats')
  getCursoStats(@Param('id', ParseIntPipe) id: number) {
    return this.cursosService.getCursoStats(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCursoDto: UpdateCursoDto) {
    return this.cursosService.update(id, updateCursoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cursosService.remove(id);
  }


  // MODULOS ENDPOINTS 
  @Post('/modulos')
  createModulo(@Body() createModuloDto: CreateModuloDto) {
    return this.cursosService.createModulo(createModuloDto);
  }



  @Get('/modulos/:id')
  findOneModulo(@Param('id', ParseIntPipe) id: number) {
    return this.cursosService.findOneModulo(id);
  }

  @Patch('/modulos/:id')
  updateModulo(@Param('id', ParseIntPipe) id: number, @Body() updateModuloDto: UpdateModuloDto) {
    return this.cursosService.updateModulo(id, updateModuloDto);
  }

  @Delete('/modulos/:id')
  removeModulo(@Param('id', ParseIntPipe) id: number) {
    return this.cursosService.removeModulo(id);
  }


  // CAPITULOS ENDPOINTS

  @Post('/capitulos')
  createCapitulo(@Body() createCapituloDto: CreateCapituloDto) {
    return this.cursosService.createCapitulo(createCapituloDto);
  }

  @Get('/capitulos/curso/:cursoId')
  findCapitulosByCurso(@Param('cursoId', ParseIntPipe) cursoId: number) {
    return this.cursosService.findCapitulosByCurso(cursoId);
  }

  @Get('/capitulos/:id')
  findOneCapitulo(@Param('id', ParseIntPipe) id: number) {
    return this.cursosService.findOneCapitulo(id);
  }

  @Patch('/capitulos/:id')
  updateCapitulo(@Param('id', ParseIntPipe) id: number, @Body() updateCapituloDto: UpdateCapituloDto) {
    return this.cursosService.updateCapitulo(id, updateCapituloDto);
  }

  @Delete('/capitulos/:id')
  removeCapitulo(@Param('id', ParseIntPipe) id: number) {
    return this.cursosService.removeCapitulo(id);
  }

  // CLASES ENDPOINTS
  @Post('/clases/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadClase(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { nombre: string; tipo: string; capituloId: number },
  ) {
    const result = await this.cloudinaryService.uploadFile(file);
    const nuevaClase = {
      nombre: body.nombre,
      tipo: body.tipo,
      url_recurso: result.secure_url,
      capituloId: Number(body.capituloId),
    };
    return this.cursosService.createClase(nuevaClase);
  }

  @Post('/clases')
  createClase(@Body() createClaseDto: CreateClaseDto) {
    return this.cursosService.createClase(createClaseDto);
  }

  @Get('/clases/capitulo/:capituloId')
  findClasesByCapitulo(@Param('capituloId', ParseIntPipe) capituloId: number) {
    return this.cursosService.findClasesByCapitulo(capituloId);
  }

  @Get('/clases/:id')
  findOneClase(@Param('id', ParseIntPipe) id: number) {
    return this.cursosService.findOneClase(id);
  }

  @Patch('/clases/:id')
  updateClase(@Param('id', ParseIntPipe) id: number, @Body() updateClaseDto: UpdateClaseDto) {
    return this.cursosService.updateClase(id, updateClaseDto);
  }

  @Delete('/clases/:id')
  removeClase(@Param('id', ParseIntPipe) id: number) {
    return this.cursosService.removeClase(id);
  }

  // INSIGNIAS ENDPOINTS
  @Post('/insignias')
  createInsignia(@Body() createInsigniaDto: CreateInsigniaDto) {
    return this.cursosService.createInsignia(createInsigniaDto);
  }


  @Get('/insignias/curso/:cursoId')
  findInsigniasByCurso(@Param('cursoId', ParseIntPipe) cursoId: number) {
    return this.cursosService.findInsigniasByCurso(cursoId);
  }

  @Get('/insignias/:id')
  findOneInsignia(@Param('id', ParseIntPipe) id: number) {
    return this.cursosService.findOneInsignia(id);
  }

  @Patch('/insignias/:id')
  updateInsignia(@Param('id', ParseIntPipe) id: number, @Body() updateInsigniaDto: UpdateInsigniaDto) {
    return this.cursosService.updateInsignia(id, updateInsigniaDto);
  }

  @Delete('/insignias/:id')
  removeInsignia(@Param('id', ParseIntPipe) id: number) {
    return this.cursosService.removeInsignia(id);
  }


  // PROGRESO ENDPOINTS
  @Post('/progreso')
  async createProgreso(@Body() createProgresoDto: CreateProgresoDto) {
    createProgresoDto.cursoId = Number(createProgresoDto.cursoId);
    createProgresoDto.usuarioId = Number(createProgresoDto.usuarioId);
    return this.cursosService.createProgreso(createProgresoDto);
  }

  @Get('/progreso/usuario/:userId')
  findProgresosByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.cursosService.findProgresosByUser(userId);
  }

  @Get('/progreso/curso/:cursoId')
  findProgresosByCurso(@Param('cursoId', ParseIntPipe) cursoId: number) {
    return this.cursosService.findProgresosByCurso(cursoId);
  }

  @Get('/progreso/:id')
  findOneProgreso(@Param('id', ParseIntPipe) id: number) {
    return this.cursosService.findOneProgreso(id);
  }

  @Patch('/progreso/:id')
  updateProgreso(@Param('id', ParseIntPipe) id: number, @Body() updateProgresoDto: UpdateProgresoDto) {
    return this.cursosService.updateProgreso(id, updateProgresoDto);
  }

  @Delete('/progreso/:id')
  removeProgreso(@Param('id', ParseIntPipe) id: number) {
    return this.cursosService.removeProgreso(id);
  }


  // ENDPOINTS ESPECIALES
  // Dashboard completo del usuario
  @Get('/dashboard/usuario/:userId')
  getUserDashboard(@Param('userId', ParseIntPipe) userId: number) {
    return this.cursosService.getUserDashboard(userId);
  }
  // Inscripcion rapida a curso
  @Post(':cursoId/inscribir/:usuarioId')
  async inscribirUsuario(
    @Param('cursoId', ParseIntPipe) cursoId: number,
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    const createProgresoDto: CreateProgresoDto = {
      cursoId,
      usuarioId,
      estado: 'inscrito',
    };
    return this.cursosService.createProgreso(createProgresoDto);
  }


  @Patch(':cursoId/completar/:usuarioId')
  async completarCurso(
    @Param('cursoId', ParseIntPipe) cursoId: number,
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    const progresos = await this.cursosService.findProgresosByUser(usuarioId);
    const progreso = progresos.find(p => p.curso.id === cursoId);

    if (!progreso) {
      const createProgresoDto: CreateProgresoDto = {
        cursoId,
        usuarioId,
        estado: 'completado',
      };
      return this.cursosService.createProgreso(createProgresoDto);
    } else {
      const updateProgresoDto: UpdateProgresoDto = {
        estado: 'completado',
      };
      return this.cursosService.updateProgreso(progreso.id, updateProgresoDto);
    }
  }

  @Patch(':cursoId/iniciar/:usuarioId')
  async iniciarCurso(
    @Param('cursoId', ParseIntPipe) cursoId: number,
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    const progresos = await this.cursosService.findProgresosByUser(usuarioId);
    const progreso = progresos.find(p => p.curso.id === cursoId);

    if (!progreso) {
      const createProgresoDto: CreateProgresoDto = {
        cursoId,
        usuarioId,
        estado: 'en_progreso',
      };
      return this.cursosService.createProgreso(createProgresoDto);
    } else {
      const updateProgresoDto: UpdateProgresoDto = {
        estado: 'en_progreso',
      };
      return this.cursosService.updateProgreso(progreso.id, updateProgresoDto);
    }
  }
}