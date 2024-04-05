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
    private readonly callRepository: Repository<Call>
  ) {
  }

  async create(dto: CreateCallDto): Promise<{ data: Call }> {
    try {
      const data: Call = await this.callRepository.save(dto);
      return { data };
    } catch {
      throw new BadRequestException('Impossible de créer l\'appel à solution');
    }
  }

  async findAll(): Promise<{ data: [Call[], number] }> {
    const data: [Call[], number] = await this.callRepository.findAndCount({
      relations: ['thematics'],
    });
    return { data };
  }

  async findRecent(): Promise<{ data: Call }> {
    const data: Call = await this.callRepository.findOne({
      order: { id: 'DESC' },
    });
    return { data };
  }

  async findOne(id: number): Promise<{ data: Call }> {
    try {
      const data: Call = await this.callRepository.findOneOrFail({ where: { id } });
      return { data };
    } catch {
      throw new NotFoundException('Impossible de récupérer l\'appel à solution');
    }
  }

  async update(id: number, dto: UpdateCallDto): Promise<{ data: Call }> {
    try {
      const { data: call } = await this.findOne(id);
      const updatedCall: Call & UpdateCallDto = Object.assign(call, dto);
      const data: Call = await this.callRepository.save(updatedCall);
      return { data };
    } catch {
      throw new BadRequestException(
        'Impossible de mettre à jour l\'appel à solution',
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.findOne(id);
      await this.callRepository.delete(id);
    } catch {
      throw new BadRequestException(
        'Impossible de supprimer l\'appel à solution',
      );
    }
  }
}
