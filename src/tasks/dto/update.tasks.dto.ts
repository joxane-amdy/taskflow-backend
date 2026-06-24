import { IsString, IsEnum, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { TaskType, Priorite } from '../task.entity';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  titre?: string;

  @IsOptional()
  @IsEnum(TaskType)
  type?: TaskType;

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
