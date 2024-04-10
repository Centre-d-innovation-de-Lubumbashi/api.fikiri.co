import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { UpdateUserSolutionDto } from './dto/update-user-solution.dto';
import { Solution } from './entities/solution.entity';
import { ArrayContains, Repository } from 'typeorm';
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
      relations: ['thematic', 'challenges', 'status', 'user', 'images', 'feedbacks'],
      order: { updated_at: 'DESC' },
    });
    return { data };
  }

  async findOne(id: number): Promise<{ data: Solution }> {
    const data: Solution = await this.solutionRepository.findOneOrFail({
      where: { id },
      relations: ['images', 'status', 'feedbacks', 'feedbacks.user', 'challenges', 'pole'],
    });
    if (!data) throw new NotFoundException('La solution n\'a pas été trouvé');
    return { data };
  }


  async userUpdateSolution(id: number, dto: UpdateUserSolutionDto) {
    try {
      const { data: solution } = await this.findOne(id);
      const updatedSolution: Solution & UpdateUserSolutionDto = Object.assign(solution, dto);
      const data: Solution = await this.solutionRepository.save(updatedSolution);
      return { data };
    } catch {
      throw new BadRequestException(
        'Erreur lors de la mise à jour de la solution',
      );
    }
  }

  async update(id: number, dto: UpdateSolutionDto): Promise<{ data: Solution }> {
    try {
      const { data: solution } = await this.findOne(id);
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
      const { data: solution } = await this.findOne(id);
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
      .find({
        where: {
          status: ArrayContains([2, 4, 4]),
        },
        relations: ['user', 'status', 'user', 'thematic', 'images', 'feedbacks'],
        order: { created_at: 'DESC' },
        take: take,
      });
    return { data };
  }

  async findOneMapped(solutionId: number): Promise<{ data: { solution: Solution, prev: number, next: number } }> {
    const data: Solution = await this.solutionRepository.findOne({
      where: {
        id: solutionId,
        status: ArrayContains([2, 3, 4]),
      },
      relations: ['user', 'status', 'user', 'thematic', 'images', 'feedbacks'],
    });
    const { prev, next } = await this.findNeighbors(solutionId);
    return {
      data: {
        solution: data,
        prev: prev,
        next: next,
      },
    };
  }

  async findNeighbors(solutionId: number): Promise<{ prev: number, next: number }> {
    const solutions: Solution[] = await this.solutionRepository.find({
      where: { status: ArrayContains([2, 3, 4]) },
      select: ['id'],
    });
    const currentIndex = solutions.findIndex((solution) => solution.id === solutionId);
    const prev = solutions[currentIndex - 1]?.id;
    const next = solutions[currentIndex + 1]?.id;
    return { prev, next };
  }

  async findConforms(): Promise<{ data: Solution[] }> {
    const data: Solution[] = await this.solutionRepository
      .createQueryBuilder('solution')
      .select([
        'solution.id',
        'solution.name',
        'solution.created_at',
        'solution.thematic',
        'solution.videoLink',
        'solution.imageLink',
      ])
      .leftJoinAndSelect('solution.images', 'images')
      .where('solution.videoLink IS NOT NULL OR solution.image_link IS NOT NULL')
      .orWhere('ARRAY_LENGTH(images) > 0')
      .getMany();
    return { data };
  }

  async findCurated(): Promise<{ data: Solution[] }> {
    const data: Solution[] = await this.solutionRepository
      .createQueryBuilder('solution')
      .select([
        'solution.id',
        'solution.name',
        'solution.created_at',
        'solution.feedbacks',
        'solution.thematic',
      ])
      .leftJoinAndSelect('solution.feedbacks', 'feedbacks')
      .where('ARRAY_LENGTH(feedbacks) > 0')
      .getMany();

    return { data };
  }

  async findNonConforms(): Promise<{ data: Solution[] }> {
    const data: Solution[] = await this.solutionRepository
      .createQueryBuilder('solution')
      .select([
        'solution.id',
        'solution.name',
        'solution.created_at',
        'solution.feedbacks',
        'solution.thematic',
        'solution.video_link',
        'solution.imageLink',
        'solution.images',
      ])
      .leftJoinAndSelect('solution.images', 'images')
      .where('solution.video_link IS NULL')
      .andWhere('solution.image_link IS NULL')
      .andWhere('ARRAY_LENGTH(images) <= 0')
      .getMany();
    return { data };
  }
}
