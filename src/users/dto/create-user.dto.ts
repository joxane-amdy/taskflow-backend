// Importation des décorateurs de validation
import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../user.entity';

// DTO (Data Transfer Object)
// Sert à valider les données envoyées par le client lors de l'inscription.
export class CreateUserDto {

  // Vérifie que le prénom est une chaîne de caractères
  @IsString()
  prenom: string;

  // Vérifie que le nom est une chaîne de caractères
  @IsString()
  nom: string;

  // Vérifie que l'email est au bon format
  @IsEmail()
  email: string;

  // Vérifie que le mot de passe est une chaîne
  // et contient au moins 6 caractères
  @IsString()
  @MinLength(6, {
    message: 'Le mot de passe doit faire au moins 6 caractères',
  })
  password: string;

  // Le rôle est facultatif
  // S'il est renseigné, il doit être "admin" ou "user"
  @IsOptional()
  @IsEnum(Role, {
    message: 'role doit être "admin" ou "user"',
  })
  role?: Role;
}