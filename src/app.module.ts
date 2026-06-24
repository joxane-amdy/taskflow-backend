import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks/tasks.entity';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { Category } from './categories/category.entity';
import { CategoriesModule } from './categories/categories.module';
import { WeatherModule } from './weather/weather.controller';

@Module({
  imports: [TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'taskflow',
      entities: [Task, Category], // ← Category et User ajoutés ici
      synchronize: true,
    }),
    AuthModule,
    TasksModule,
    CategoriesModule, // ← ajouté ici
    WeatherModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
