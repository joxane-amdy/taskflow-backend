import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {

  constructor(

    // Injection du Repository User
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Création d'un nouvel utilisateur
  async create(dto: CreateUserDto): Promise<User> {

    // Vérifie que l'email n'existe pas déjà
    const existing = await this.findByEmail(dto.email);

    if (existing)
      throw new ConflictException('Email déjà utilisé');

    // Chiffrement du mot de passe avec bcrypt
    // Le nombre 10 représente le coût de hachage (salt rounds)
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Création de l'objet User
    const user = this.usersRepository.create({
      ...dto,
      password: hashedPassword,
    });

    // Sauvegarde dans la base de données
    return this.usersRepository.save(user);
  }

  // Recherche d'un utilisateur par email
  async findByEmail(email: string): Promise<User | null> {

    return this.usersRepository.findOne({
      where: { email },
    });
  }

  // Retourne tous les utilisateurs
  async findAll(): Promise<User[]> {

    return this.usersRepository.find();
  }

  // Recherche un utilisateur par son identifiant
  async findOne(id: number): Promise<User> {

    const user = await this.usersRepository.findOne({
      where: { id },
    });

    // Si aucun utilisateur n'est trouvé
    if (!user)
      throw new NotFoundException(
        `Utilisateur #${id} introuvable`,
      );

    return user;
  }

  // Suppression d'un utilisateur
  async remove(id: number): Promise<void> {

    // Vérifie d'abord que l'utilisateur existe
    const user = await this.findOne(id);

    // Suppression dans la base de données
    await this.usersRepository.remove(user);
  }
}