import { IsString, IsEnum, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { TaskType, Priorite } from '../task.entity';

export class CreateTaskDto {
  @IsString()
  titre: string;

  @IsEnum(TaskType)
  type: TaskType;

  @IsOptional()
  @IsEnum(Priorite)
  priorite?: Priorite;

  @IsOptional()
  @IsBoolean()
  terminee?: boolean;

  @IsOptional()
  @IsInt()
  categoryId?: number;
}
