import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Task } from '../tasks/tasks.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string; // ex: "Travail", "Personnel", "Santé", "Étude"

  @Column({ nullable: true })
  couleur: string; // code hex ex: #378ADD

  @Column({ nullable: true })
  description: string;

  // Une catégorie a plusieurs tâches
  @OneToMany(() => Task, (task) => task.category)
  tasks: Task[];
}
