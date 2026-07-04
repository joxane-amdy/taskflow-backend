import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // charge le fichier .env
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks/tasks.entity';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { WeatherModule } from './weather/weather.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // rend process.env.X disponible partout

    TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.MYSQLHOST,
  port: Number(process.env.MYSQLPORT),
  username: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  entities: [User, Task],
  synchronize: true,
}),
    UsersModule,
    AuthModule,
    TasksModule, 
    WeatherModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
