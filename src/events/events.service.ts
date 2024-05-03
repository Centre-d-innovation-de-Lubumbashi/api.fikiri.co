import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateCallDto } from './dto/update-event.dto';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly callRepository: Repository<Event>
  ) {}

  async create(dto: CreateEventDto): Promise<{ data: Event }> {
    try {
      const data: Event = await this.callRepository.save(dto);
      return { data };
    } catch {
      throw new BadRequestException("Impossible de créer l'appel à solution");
    }
  }

  async findAll(): Promise<{ data: Event[] }> {
    const data: Event[] = await this.callRepository.find({
      relations: ['thematics']
    });
    return { data };
  }

  async findRecent(): Promise<{
    data: { call: Event; prev: number; next: number };
  }> {
    const call: Event = await this.callRepository.createQueryBuilder('c').orderBy('c.created_at', 'DESC').getOne();
    const { prev, next } = await this.findNeighbours(call.id);
    return {
      data: { call, prev, next }
    };
  }

  async findOne(id: number): Promise<{ data: { call: Event; prev: number; next: number } }> {
    try {
      const call: Event = await this.callRepository.findOneOrFail({
        where: { id }
      });
      const { prev, next } = await this.findNeighbours(id);
      return {
        data: { call, prev, next }
      };
    } catch {
      throw new NotFoundException("Impossible de récupérer l'appel à solution");
    }
  }

  async findNeighbours(id: number): Promise<{ prev: number; next: number }> {
    const data: Event[] = await this.callRepository.createQueryBuilder('c').select('c.id').getMany();
    const index: number = data.findIndex((call) => call.id === id);
    const prev: number = data[index - 1]?.id ?? null;
    const next: number = data[index + 1]?.id ?? null;
    return { prev, next };
  }

  async update(id: number, dto: UpdateCallDto): Promise<{ data: Event }> {
    try {
      const { data: result } = await this.findOne(id);
      const { call } = result;
      const updatedCall: Event & UpdateCallDto = Object.assign(call, dto);
      const data: Event = await this.callRepository.save(updatedCall);
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
