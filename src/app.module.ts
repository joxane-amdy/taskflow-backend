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
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'taskflow-db',
      entities: [User, Task], // ← Task et Category ajoutées ici
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
