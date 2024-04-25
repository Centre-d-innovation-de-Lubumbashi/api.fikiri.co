import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { Repository } from 'typeorm';
import { Call } from './entities/call.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CallsService {
  constructor(
    @InjectRepository(Call)
    private readonly callRepository: Repository<Call>,
  ) {}

  async create(dto: CreateCallDto): Promise<{ data: Call }> {
    try {
      const data: Call = await this.callRepository.save(dto);
      return { data };
    } catch {
      throw new BadRequestException("Impossible de créer l'appel à solution");
    }
  }

  async findAll(): Promise<{ data: Call[] }> {
    const data: Call[] = await this.callRepository.find({
      relations: ['thematics'],
    });
    return { data };
  }

  async findRecent(): Promise<{ data: { call: Call; prev: number; next: number } }> {
    const call: Call = await this.callRepository.createQueryBuilder('c').orderBy('c.created_at', 'DESC').getOne();
    const { prev, next } = await this.findNeighbours(call.id);
    return {
      data: { call, prev, next },
    };
  }

  async findOne(id: number): Promise<{ data: { call: Call; prev: number; next: number } }> {
    try {
      const call: Call = await this.callRepository.findOneOrFail({ where: { id } });
      const { prev, next } = await this.findNeighbours(id);
      return {
        data: { call, prev, next },
      };
    } catch {
      throw new NotFoundException("Impossible de récupérer l'appel à solution");
    }
  }

  async findNeighbours(id: number): Promise<{ prev: number; next: number }> {
    const data: Call[] = await this.callRepository.createQueryBuilder('c').select('c.id').getMany();

    const index: number = data.findIndex((call) => call.id === id);
    const prev: number = data[index - 1]?.id ?? null;
    const next: number = data[index + 1]?.id ?? null;
    return { prev, next };
  }

  async update(id: number, dto: UpdateCallDto): Promise<{ data: Call }> {
    try {
      const { data: result } = await this.findOne(id);
      const { call } = result;
      const updatedCall: Call & UpdateCallDto = Object.assign(call, dto);
      const data: Call = await this.callRepository.save(updatedCall);
      return { data };
    } catch {
      throw new BadRequestException("Impossible de mettre à jour l'appel à solution");
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.findOne(id);
      await this.callRepository.delete(id);
    } catch {
      throw new BadRequestException("Impossible de supprimer l'appel à solution");
    }
  }
}
