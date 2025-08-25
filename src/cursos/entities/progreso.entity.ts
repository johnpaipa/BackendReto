import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Curso } from "./curso.entity";
@Entity()
export class Progreso {


    @PrimaryGeneratedColumn()
    id: number;

    // Relación 1:N
    @ManyToOne(() => User, (user) => user.progresos)
    @JoinColumn()
    user: User;


    // Relación 1:N
    @ManyToOne(() => Curso, (curso) => curso.progresos)
    @JoinColumn()
    curso: Curso;

    @Column()
    estado: string;

}
