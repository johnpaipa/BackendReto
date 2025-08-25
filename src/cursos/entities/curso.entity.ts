import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Progreso } from "./progreso.entity";
import { Modulo } from "./modulo.entity";
import { Insignia } from "./insignia.entity";
import { Capitulo } from "./capitulo.entity";
@Entity()
export class Curso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @ManyToOne(() => Modulo, (modulo) => modulo.cursos)
  modulo: Modulo;

  @OneToOne(() => Insignia, (insignia) => insignia.curso, { cascade: true })
  insignia: Insignia;

  @OneToMany(() => Capitulo, (capitulo) => capitulo.curso, { cascade: true })
  capitulos: Capitulo[];

  @OneToMany(() => Progreso, (progreso) => progreso.curso)
  progresos: Progreso[];
}
