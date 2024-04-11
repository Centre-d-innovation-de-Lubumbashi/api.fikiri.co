import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { UpdateUserSolutionDto } from './dto/update-user-solution.dto';
import { Solution } from './entities/solution.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ImagesService } from '../images/images.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SolutionsService {
  constructor(
    @InjectRepository(Solution)
    private readonly solutionRepository: Repository<Solution>,
    private readonly imageService: ImagesService,
  ) {
  }

  async create(dto: CreateSolutionDto): Promise<{ data: Solution }> {
    try {
      const data: Solution = await this.solutionRepository.save({
        ...dto,
        thematic: { id: dto.thematic },
        user: { email: dto.user },
        call: { id: dto.call },
        status: { id: 1 },
        challenges: dto.challenges.map((id) => ({ id })),
      });
      return { data };
    } catch {
      throw new BadRequestException('Erreur lors de la création de la solution');
    }
  }

  async saveSolution(user: Solution): Promise<{ data: Solution }> {
    const data: Solution = await this.solutionRepository.save(user);
    return { data };
  }

  async findAll(): Promise<{ data: Solution[] }> {
    const data: Solution[] = await this.solutionRepository.find({
      select: ['id', 'name', 'created_at'],
      relations: ['thematic', 'feedbacks'],
      order: { updated_at: 'DESC' },
    });
    return { data };
  }

  async findOne(id: number): Promise<{ data: { solution: Solution, prev: number, next: number } }> {
    try {
      const solution: Solution = await this.solutionRepository
        .createQueryBuilder('s')
        .leftJoinAndSelect('s.images', 'images')
        .leftJoinAndSelect('s.status', 'status')
        .leftJoinAndSelect('s.feedbacks', 'feedbacks')
        .leftJoinAndSelect('s.challenges', 'challenges')
        .leftJoinAndSelect('s.thematic', 'thematic')
        .leftJoinAndSelect('feedbacks.user', 'feedbackUser')
        .leftJoinAndSelect('feedbackUser.organisation', 'feedbackuserOrganisation')
        .leftJoinAndSelect('feedbackUser.pole', 'feedbackuserPole')
        .leftJoinAndSelect('s.user', 'user')
        .getOne();
      const { prev, next } = await this.findNeighbors(id);
      return {
        data: { solution, prev, next },
      };
    } catch {
      throw new NotFoundException('La solution n\'a pas été trouvé');
    }
  }

  async userUpdateSolution(id: number, dto: UpdateUserSolutionDto) {
    try {
      const { data: oldSolution } = await this.findOne(id);
      const { solution } = oldSolution;
      const updatedSolution: Solution & UpdateUserSolutionDto = Object.assign(solution, dto);
      const data: Solution = await this.solutionRepository.save(updatedSolution);
      return { data };
    } catch {
      throw new BadRequestException('Erreur lors de la mise à jour de la solution');
    }
  }

  async update(id: number, dto: UpdateSolutionDto): Promise<{ data: Solution }> {
    try {
      const { data: oldSolution } = await this.findOne(id);
      const { solution } = oldSolution;
      const updatedSolution: Solution & UpdateSolutionDto = Object.assign(solution, dto);
      const data = await this.solutionRepository.save({
        ...updatedSolution,
        pole: { id: dto.pole || solution.pole?.id },
        thematic: { id: dto.thematic || solution.thematic?.id },
        user: { email: dto.user || solution.user?.email },
        call: { id: dto.call || solution.call?.id },
        status: { id: dto.status || solution.status?.id },
        challenges: dto?.challenges?.map((id: number) => ({ id })) ?? solution.challenges,
      });
      return { data };
    } catch {
      throw new BadRequestException('Erreur lors de la mise à jour de la solution');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.findOne(id);
      await this.solutionRepository.delete(id);
    } catch {
      throw new BadRequestException('Erreur lors de la suppression de la solution');
    }
  }

  async uploadImage(id: number, file: Express.Multer.File): Promise<void> {
    try {
      const { data: oldSolution } = await this.findOne(id);
      const { solution } = oldSolution;
      const { data: image } = await this.imageService.create({ image_link: file.filename });
      solution.images = [...solution.images, image];
      await this.solutionRepository.save(solution);
    } catch {
      throw new BadRequestException('Erreur lors de l\'ajout des images à la solution');
    }
  }

  async findByPole(poleId: number): Promise<{ data: Solution[] }> {
    try {
      const data: Solution[] = await this.solutionRepository.find({
        where: { pole: { id: poleId } },
        relations: ['user', 'status', 'user', 'thematic', 'images', 'feedbacks'],
      });
      return { data };
    } catch {
      throw new BadRequestException(
        'Erreur lors de la récupération des solutions par pôle',
      );
    }
  }

  async findMapped(cursor: number): Promise<{ data: Solution[] }> {
    if (isNaN(cursor) || cursor <= 0) cursor = 1;
    const take: number = cursor * 8;
    const data: Solution[] = await this.solutionRepository
      .createQueryBuilder('s')
      .select(['s.id', 's.name', 's.created_at'])
      .leftJoinAndSelect('s.images', 'images')
      .leftJoinAndSelect('s.user', 'user')
      .orderBy('s.updated_at', 'DESC')
      .take(take)
      .where('status.id IN (2, 3, 4)')
      .getMany();
    return { data };
  }

  async findOneMapped(solutionId: number): Promise<{ data: { solution: Solution, prev: number, next: number } }> {
    const solution: Solution = await this.solutionRepository
      .createQueryBuilder('s')
      .select(['s.id', 's.name', 's.description', 's.targeted_problem', 's.created_at'])
      .leftJoinAndSelect('s.thematic', 'thematic')
      .leftJoinAndSelect('s.feedbacks', 'feedbacks')
      .leftJoinAndSelect('s.images', 'images')
      .leftJoinAndSelect('s.status', 'status')
      .leftJoinAndSelect('s.user', 'user')
      .leftJoinAndSelect('s.challenges', 'challenges')
      .where('status.id IN (2, 3, 4)')
      .getOne();
    if (!solution) throw new NotFoundException('La solution n\'a pas été trouvé');
    const { prev, next } = await this.findNeighbors(solutionId, true);
    return {
      data: { solution, prev, next },
    };
  }

  async findNeighbors(solutionId: number, filtered: boolean = false): Promise<{ prev: number, next: number }> {
    const query: SelectQueryBuilder<Solution> = this.solutionRepository
      .createQueryBuilder('s')
      .select(['s.id']);
    if (filtered) query.where('s.status.id IN (2, 3, 4)');
    const solutions: Solution[] = await query.getMany();
    const currentIndex: number = solutions.findIndex((solution) => solution.id === solutionId);
    const prev: number = solutions[currentIndex - 1]?.id ?? null;
    const next: number = solutions[currentIndex + 1]?.id ?? null;
    return { prev, next };
  }

  async findConforms(): Promise<{ data: Solution[] }> {
    const data: Solution[] = await this.solutionRepository
      .createQueryBuilder('s')
      .select(['s.id', 's.name', 's.created_at'])
      .leftJoin('s.images', 'images')
      .leftJoinAndSelect('s.thematic', 'thematic')
      .where('images.id IS NOT NULL OR s.image_link IS NOT NULL OR LENGTH(s.video_link) > 0')
      .getMany();
    return { data };
  }

  async findCurated(): Promise<{ data: Solution[] }> {
    const data: Solution[] = await this.solutionRepository
      .createQueryBuilder('s')
      .select(['s.id', 's.name', 's.created_at'])
      .leftJoinAndSelect('s.thematic', 'thematic')
      .leftJoinAndSelect('s.feedbacks', 'feedbacks')
      .where('feedbacks.id IS NOT NULL')
      .getMany();
    return { data };
  }
}
