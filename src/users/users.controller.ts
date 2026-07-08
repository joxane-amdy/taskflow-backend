import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // Profil de l'utilisateur connecté (à partir du token JWT)
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Req() req) {
    return this.usersService.findOne(req.user.userId);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}