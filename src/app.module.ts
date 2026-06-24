import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks/tasks.entity';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'taskflow',
      entities: [Task, ], // ← Category et User ajoutés ici
      synchronize: true,
    }),
    AuthModule,
    TasksModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
