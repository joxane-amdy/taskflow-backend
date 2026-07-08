import { Controller, Post, Get, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorators';

@Controller('users')
export class UsersController {

  // Injection du service UsersService
  constructor(private readonly usersService: UsersService) {}

  // Route POST /users/register
  // Permet de créer un nouvel utilisateur
  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // Route GET /users/me
  // Accessible uniquement avec un JWT valide
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getProfile(@Req() req) {

    // Récupération de l'utilisateur connecté
    const user = await this.usersService.findOne(req.user.userId);

    // Suppression du mot de passe avant de renvoyer les informations
    const { password, ...sansMotDePasse } = user;

    return sansMotDePasse;
  }

  // Route GET /users
  // Réservée uniquement aux administrateurs
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get()
  async findAll() {

    const users = await this.usersService.findAll();

    // On retire le mot de passe de chaque utilisateur
    return users.map(({ password, ...rest }) => rest);
  }

  // Route DELETE /users/:id
  // Seul un administrateur peut supprimer un utilisateur
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {

    await this.usersService.remove(+id);

    return {
      message: 'Utilisateur supprimé avec succès',
    };
  }
}