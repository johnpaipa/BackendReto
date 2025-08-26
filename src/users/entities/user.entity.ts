import { Progreso } from "src/cursos/entities/progreso.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from 'class-transformer';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;
  // Relación 1:N
  @OneToMany(() => Progreso, (progreso) => progreso.user)
  progresos: Progreso[];

  @Column()
  nombre: string;

  @Column()
  correo: string;

  @Column()
  @Exclude()
  contrasena: string;
}
