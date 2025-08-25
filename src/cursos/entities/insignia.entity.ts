import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Curso } from "./curso.entity";
@Entity()
export class Insignia {


  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Curso, (curso) => curso.insignia)
  @JoinColumn()
  curso: Curso;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

}
