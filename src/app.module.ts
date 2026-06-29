import { Module } from '@nestjs/common';
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
  imports: [TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'taskflow',
      entities: [User,Task], // ← Category et User ajoutés ici
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
