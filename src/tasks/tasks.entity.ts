export enum TaskType {
  TRAVAIL   = 'Travail',
  PERSONNEL = 'Personnel',
  SANTE     = 'Santé',
  ETUDE     = 'Étude',
}

export enum Priorite {
  HAUTE   = 'haute',
  NORMALE = 'normale',
  BASSE   = 'basse',
}

import {
  Entity, Column, PrimaryGeneratedColumn,
  ManyToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titre: string;

  @Column({ type: 'enum', enum: TaskType })
  type: TaskType;

  @Column({ type: 'enum', enum: Priorite, default: Priorite.NORMALE })
  priorite: Priorite;

  @Column({ default: false })
  terminee: boolean;

  @CreateDateColumn()
  dateCreation: Date;

  // Plusieurs tâches appartiennent à un utilisateur
  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: 'idUser' })
  user: User;

  // Plusieurs tâches appartiennent à une catégorie
  @ManyToOne(() => Category, (category) => category.tasks, { eager: true })
  @JoinColumn({ name: 'idCategory' })
  category: Category;
}
