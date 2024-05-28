import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { UpdateUserSolutionDto } from './dto/update-user-solution.dto';
import { Solution } from './entities/solution.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ImagesService } from '../images/images.service';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryParams } from './types/query-params.interface';
import { SearchService } from 'src/search/search.service';
import { SearchParams, SearchResponse } from 'meilisearch';

@Injectable()
export class SolutionsService {
  constructor(
    @InjectRepository(Solution)
    private readonly solutionRepository: Repository<Solution>,
    private readonly imageService: ImagesService,
    private readonly searchService: SearchService
  ) {}

  async create(dto: CreateSolutionDto): Promise<{ data: Solution }> {
    try {
      const data: Solution = await this.solutionRepository.save({
        ...dto,
        thematic: { id: dto.thematic },
        user: { email: dto.user },
        call: { id: dto.call },
        status: { id: 1 },
        challenges: dto.challenges.map((id) => ({ id }))
      });
      return { data };
    } catch {
      throw new BadRequestException('Erreur lors de la création de la solution');
    }
  }

  async saveSolution(solution: Solution): Promise<{ data: Solution }> {
    const data: Solution = await this.solutionRepository.save(solution);
    return { data };
  }

  async findAll(): Promise<{ data: Solution[] }> {
    const data: Solution[] = await this.solutionRepository
      .createQueryBuilder('s')
      .select(['s.id', 's.name', 's.video_link', 's.created_at'])
      .leftJoinAndSelect('s.thematic', 'thematic')
      .leftJoinAndSelect('s.feedbacks', 'feedbacks')
      .leftJoinAndSelect('s.images', 'images')
      .orderBy('s.created_at', 'ASC')
      .getMany();
    return { data };
  }

  async findOne(id: number): Promise<{ data: { solution: Solution; prev: number; next: number } }> {
    const solution: Solution = await this.solutionRepository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.user', 'innovator')
      .leftJoinAndSelect('s.images', 'images')
      .leftJoinAndSelect('s.status', 'status')
      .leftJoinAndSelect('s.feedbacks', 'feedbacks')
      .leftJoinAndSelect('s.challenges', 'challenges')
      .leftJoinAndSelect('s.thematic', 'thematic')
      .leftJoinAndSelect('feedbacks.user', 'feedbackUser')
      .leftJoinAndSelect('feedbackUser.organisation', 'feedbackuserOrganisation')
      .leftJoinAndSelect('feedbackUser.pole', 'feedbackuserPole')
      .where('s.id = :id', { id })
      .getOne();
    if (!solution) throw new NotFoundException("La solution n'a pas été trouvé");
    const { prev, next } = await this.findNeighbors(id);
    return {
      data: { solution, prev, next }
    };
  }

  async userUpdateSolution(id: number, dto: UpdateUserSolutionDto) {
    try {
      const { data: oldSolution } = await this.findOne(id);
      const { solution } = oldSolution;
      const updatedSolution: Solution & UpdateUserSolutionDto = Object.assign(solution, dto);
      const data: Solution = await this.solutionRepository.save(updatedSolution);
      return { data };
    } catch {
      throw new BadRequestException('Erreur lors de la mise à jou r de la solution');
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
        call: { id: dto.call || solution.event?.id },
        status: { id: dto.status || solution.status?.id },
        challenges: dto?.challenges?.map((id: number) => ({ id })) ?? solution.challenges
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

  async uploadImage(id: number, file: Express.Multer.File): Promise<{ data: Solution }> {
    try {
      const { data: oldSolution } = await this.findOne(id);
      const { solution } = oldSolution;
      const { data: image } = await this.imageService.create({
        image_link: file.filename
      });
      solution.images = [...solution.images, image];
      const data = await this.solutionRepository.save(solution);
      return { data };
    } catch {
      throw new BadRequestException("Erreur lors de l'ajout des images à la solution");
    }
  }

  async findByPole(poleId: number): Promise<{ data: Solution[] }> {
    try {
      const data: Solution[] = await this.solutionRepository.find({
        where: { pole: { id: poleId } },
        relations: ['user', 'status', 'user', 'thematic', 'images', 'feedbacks']
      });
      return { data };
    } catch {
      throw new BadRequestException('Erreur lors de la récupération des solutions par pôle');
    }
  }

  async findMapped(queryParams: QueryParams): Promise<{ data: { solutions: Solution[]; count: number } }> {
    const { page, thematic, event } = queryParams;
    const query = this.solutionRepository
      .createQueryBuilder('s')
      .select(['s.id', 's.name', 's.description', 's.created_at'])
      .leftJoinAndSelect('s.thematic', 'thematic')
      .leftJoinAndSelect('s.images', 'solutionImages')
      .leftJoinAndSelect('s.thematic', 'solutionThematic')
      .leftJoinAndSelect('s.user', 'user')
      .leftJoin('s.feedbacks', 'feedbacks')
      .leftJoin('s.event', 'event')
      .where('feedbacks.id IS NOT NULL');
    if (event) query.andWhere('event.id = :event', { event });
    if (thematic) query.andWhere('thematic.id = :thematic', { thematic: +thematic });
    const pageSize: number = 20;
    const skip = ((page || 1) - 1) * pageSize;
    const count: number = await query.getCount();
    const data: Solution[] = await query.skip(skip).take(pageSize).getMany();
    return { data: { solutions: data, count: count } };
  }

  async findWinningSolutions(): Promise<{ data: Solution[] }> {
    const data: Solution[] = await this.solutionRepository
      .createQueryBuilder('s')
      .select(['s.id', 's.name', 's.description', 's.created_at'])
      .leftJoinAndSelect('s.thematic', 'thematic')
      .leftJoinAndSelect('s.images', 'solutionImages')
      .leftJoinAndSelect('s.user', 'user')
      .leftJoin('s.status', 'status')
      .where('status.id IN (2,3,4)')
      .getMany();
    return { data };
  }

  async findOneMapped(id: number): Promise<{ data: { solution: Solution; prev: number; next: number } }> {
    const solution: Solution = await this.solutionRepository
      .createQueryBuilder('s')
      .select(['s.id', 's.name', 's.description', 's.targeted_problem', 's.created_at'])
      .leftJoinAndSelect('s.thematic', 'thematic')
      .leftJoinAndSelect('s.feedbacks', 'feedbacks')
      .leftJoinAndSelect('s.images', 'images')
      .leftJoinAndSelect('s.status', 'status')
      .leftJoinAndSelect('s.user', 'user')
      .leftJoinAndSelect('s.challenges', 'challenges')
      .leftJoin('s.feedbacks', 'feedbacks')
      .where('feedbacks.id IS NOT NULL')
      .getOne();
    if (!solution) throw new NotFoundException("La solution n'a pas été trouvé");
    const { prev, next } = await this.findNeighbors(id, true);
    return {
      data: { solution, prev, next }
    };
  }

  async findNeighbors(solutionId: number, filtered: boolean = false): Promise<{ prev: number; next: number }> {
    const query: SelectQueryBuilder<Solution> = this.solutionRepository
      .createQueryBuilder('s')
      .select(['s.id'])
      .leftJoin('s.feedbacks', 'feedbacks');
    if (filtered) query.where('feedbacks.id IS NOT NULL');
    const solutions: Solution[] = await query.getMany();
    const currentIndex: number = solutions.findIndex((solution) => solution.id === solutionId);
    const prev: number = solutions[currentIndex - 1]?.id ?? null;
    const next: number = solutions[currentIndex + 1]?.id ?? null;
    return { prev, next };
  }

  async findConforms(): Promise<{ data: Solution[] }> {
    const data: Solution[] = await this.solutionRepository
      .createQueryBuilder('s')
      .leftJoin('s.images', 'images')
      .leftJoinAndSelect('s.thematic', 'thematic')
      .leftJoinAndSelect('s.feedbacks', 'feedbacks')
      .where('(images.id IS NOT NULL) OR (s.video_link IS NOT NULL)')
      .getMany();
    return { data };
  }

  async findCurated(): Promise<{ data: Solution[] }> {
    const data: Solution[] = await this.solutionRepository
      .createQueryBuilder('s')
      .select(['s.id', 's.name', 's.description', 's.created_at'])
      .leftJoinAndSelect('s.thematic', 'thematic')
      .leftJoinAndSelect('s.status', 'status')
      .leftJoinAndSelect('s.images', 'solutionImages')
      .leftJoinAndSelect('s.feedbacks', 'feedbacks')
      .leftJoinAndSelect('s.user', 'user')
      .leftJoinAndSelect('feedbacks.user', 'feedbacksUser')
      .leftJoinAndSelect('feedbacksUser.organisation', 'feedbackuserOrganisation')
      .leftJoinAndSelect('feedbacksUser.pole', 'feedbackuserPole')
      .where('feedbacks.id IS NOT NULL')
      .getMany();
    return { data };
  }

  async search(query: string): Promise<{ data: SearchResponse<Record<string, any>, SearchParams> }> {
    const searchParams: SearchParams = {
      attributesToRetrieve: ['id', 'name', 'description', 'created_at', 'video_link'],
      attributesToCrop: ['description'],
      attributesToHighlight: ['name', 'description'],
      limit: 20
    };
    const { data } = await this.searchService.search('solutions', query, searchParams);
    return { data };
  }

  async addDocument(): Promise<void> {
    const { data: solutions } = await this.findCurated();
    this.searchService.addDocument<Solution>('solutions', solutions);
    this.searchService.updateFilterableAttributes('solutions', ['thematic']);
  }
}
