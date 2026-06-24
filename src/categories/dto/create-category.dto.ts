import { IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  nom: string;

  @IsOptional()
  @IsString()
  couleur?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
