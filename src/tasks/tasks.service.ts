import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { CreateTaskDto } from './dto/create.tasks.dto';
import { UpdateTaskDto } from './dto/update.tasks.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(userId: number, dto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create({
      titre: dto.titre,
      type: dto.type,
      priorite: dto.priorite,
      terminee: dto.terminee,
      user: { id: userId } as any,
    });
    return this.tasksRepository.save(task);
  }

  // Récupère uniquement les tâches de l'utilisateur connecté
  async findAll(userId: number): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { user: { id: userId } },
      relations: { user: true },
      order: { dateCreation: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!task) throw new NotFoundException(`Tâche #${id} introuvable`);
    if (task.user.id !== userId) {
      throw new ForbiddenException('Accès interdit à cette tâche');
    }
    return task;
  }

  async update(id: number, userId: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id, userId);

    if (dto.titre !== undefined) task.titre = dto.titre;
    if (dto.type !== undefined) task.type = dto.type;
    if (dto.priorite !== undefined) task.priorite = dto.priorite;
    if (dto.terminee !== undefined) task.terminee = dto.terminee;

    return this.tasksRepository.save(task);
  }

  async remove(id: number, userId: number): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.tasksRepository.remove(task);
  }

  // Statistiques pour les graphiques du dashboard
  async getStats(userId: number) {
    const tasks = await this.findAll(userId);
    const total = tasks.length;
    const terminees = tasks.filter((t) => t.terminee).length;

    return {
      total,
      terminees,
      enCours: total - terminees,
    };
  }
}
