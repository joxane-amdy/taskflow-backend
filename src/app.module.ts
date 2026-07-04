import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        // Compatible XAMPP local ET Railway en production
        host:     config.get('MYSQLHOST')     || config.get('DB_HOST')     || 'localhost',
        port:     Number(config.get('MYSQLPORT')    || config.get('DB_PORT'))    || 3306,
        username: config.get('MYSQLUSER')     || config.get('DB_USERNAME') || 'root',
        password: config.get('MYSQLPASSWORD') || config.get('DB_PASSWORD') || '',
        database: config.get('MYSQLDATABASE') || config.get('DB_NAME')     || 'taskflow',
        entities: [User, Task],
        synchronize: true,
      }),
    }),

    UsersModule,
    AuthModule,
    TasksModule,
    WeatherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}