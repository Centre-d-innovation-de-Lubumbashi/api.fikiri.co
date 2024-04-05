import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { promisify } from 'util';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { UpdateUserSolutionDto } from './dto/update-user-solution.dto';
import { Solution } from './entities/solution.entity';
import { ArrayContains, Repository } from 'typeorm';
import { ImagesService } from '../images/images.service';
import { InjectRepository } from '@nestjs/typeorm';

const unlinkAsync = promisify(fs.unlink);

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
      throw new BadRequestException(
        'Erreur lors de la création de la solution',
      );
    }
  }

  async findAll(): Promise<{ data: Solution[] }> {
    const data: Solution[] = await this.solutionRepository.find({
      relations: ['thematic', 'challenges', 'status', 'user', 'images', 'feedbacks'],
      order: { updatedAt: 'DESC' },
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
        pole: { id: dto.pole ?? solution.poleId },
        thematic: { id: dto.thematic ?? solution.thematicId },
        user: { email: dto.user ?? solution.user.email },
        call: { id: dto.call ?? solution.callId },
        status: { id: dto.status ?? solution.statusId },
        challenges: dto?.challenges?.map((id: number) => ({ id })) ?? solution.challenges,
      });
      return { data };
    } catch {
      throw new BadRequestException(
        'Erreur lors de la mise à jour de la solution',
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.findOne(id);
      await this.solutionRepository.delete(id);
    } catch {
      throw new BadRequestException(
        'Erreur lors de la suppression de la solution',
      );
    }
  }

  async uploadImages(id: number, file: Express.Multer.File): Promise<void> {
    try {
      const { data: solution } = await this.findOne(id);
      const { data: image } = await this.imageService.create({ imageLink: file.filename });
      solution.images = [...solution.images, image];
      await this.solutionRepository.save(solution);
    } catch {
      throw new BadRequestException('Erreur lors de l\'ajout des images à la solution');
    }
  }

  async deleteImage(id: number): Promise<void> {
    try {
      const { data: image } = await this.imageService.findOne(id);
      await unlinkAsync(`./uploads/${image.imageLink}`);
      await this.imageService.remove(id);
    } catch {
      throw new BadRequestException('Erreur lors de la suppression de l\'image');
    }
  }

  async findByPole(poleId: number): Promise<{ data: Solution[] }> {
    try {
      const data: Solution[] = await this.solutionRepository.find({
        where: { poleId },
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
          statusId: ArrayContains([2, 4, 4]),
        },
        relations: ['user', 'status', 'user', 'thematic', 'images', 'feedbacks'],
        order: { createdAt: 'DESC' },
        take: take,
      });
    return { data };
  }

  async findOneMapped(solutionId: number): Promise<{ data: { solution: Solution, prev: number, next: number } }> {
    const data = await this.solutionRepository.findOne({
      where: {
        id: solutionId,
        statusId: ArrayContains([2, 3, 4]),
      },
      relations: ['user', 'status', 'user', 'thematic', 'images', 'feedbacks'],
    });
    const { prev, next } = await this.findPrevAndNext(solutionId);
    return {
      data: {
        solution: data,
        prev: prev,
        next: next,
      },
    };
  }

  async findPrevAndNext(solutionId: number): Promise<{ prev: number, next: number }> {
    const solutions: Solution[] = await this.solutionRepository.find({
      where: {
        statusId: ArrayContains([2, 3, 4]),
      },
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
        'solution.createdAt',
        'solution.thematic',
        'solution.videoLink',
        'solution.imageLink',
      ])
      .leftJoinAndSelect('solution.images', 'images')
      .where('solution.videoLink IS NOT NULL OR solution.imageLink IS NOT NULL')
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
        'solution.createdAt',
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
        'solution.createdAt',
        'solution.feedbacks',
        'solution.thematic',
        'solution.videoLink',
        'solution.imageLink',
        'solution.images',
      ])
      .leftJoinAndSelect('solution.images', 'images')
      .where('solution.videoLink IS NULL')
      .andWhere('solution.imageLink IS NULL')
      .andWhere('ARRAY_LENGTH(images) <= 0')
      .getMany();
    return { data };
  }

}
