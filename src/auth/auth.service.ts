import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return this.buildToken(user.id, user.email, user.role);
  }

  async login(email: string, password: string) {
    // 1. Trouver l'utilisateur
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Identifiants invalides');

    // 2. Comparer le mot de passe avec le hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Identifiants invalides');

    return this.buildToken(user.id, user.email, user.role);
  }

  private buildToken(userId: number, email: string, role: string) {
    // Créer le payload JWT
    const payload = {
      sub: userId,
      email,
      role,
    };

    // Signer et retourner le token
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
