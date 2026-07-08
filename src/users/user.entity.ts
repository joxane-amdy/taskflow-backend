// Définition des rôles possibles
export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from '../tasks/tasks.entity';

// Cette classe représente la table User dans la base de données.
@Entity()
export class User {

  // Clé primaire générée automatiquement
  @PrimaryGeneratedColumn()
  id: number;

  // Colonne prénom
  @Column()
  prenom: string;

  // Colonne nom
  @Column()
  nom: string;

  // Adresse email unique
  @Column({ unique: true })
  email: string;

  // Mot de passe (stocké après chiffrement avec bcrypt)
  @Column()
  password: string;

  // Rôle de l'utilisateur
  // Par défaut : USER
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  // Relation OneToMany
  // Un utilisateur peut posséder plusieurs tâches
  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}