export enum Role {
  ADMIN = 'admin',
  USER  = 'user',
}

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from '../tasks/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  prenom: string;

  @Column()
  nom: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Sera hashé avec bcrypt

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  // Un utilisateur possède plusieurs tâches
  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
