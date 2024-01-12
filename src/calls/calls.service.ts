import { Injectable, HttpStatus, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';

@Injectable()
export class CallsService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {
  }

  async create(data: CreateCallDto) {
    await this.prismaService.call.create({ data });
    return {
      statusCode: HttpStatus.CREATED,
      message: 'L\'appel à solution est ajouté',
    };
  }

  async findAll() {
    const calls = await this.prismaService.call.findMany({});
    return {
      statusCode: HttpStatus.OK,
      data: calls,
    };
  }

  async findOne(id: number) {
    const call = await this.prismaService.call.findUnique({
      where: { id },
      include: {
        thematics: true,
      },
    });
    if (!call) throw new NotFoundException('L\'appel à solution introuvable');
    return {
      statusCode: HttpStatus.OK,
      data: call,
    };
  }

  async update(id: number, data: UpdateCallDto) {
    const call = await this.prismaService.call.findUnique({
      where: { id },
    });
    if (!call) throw new NotFoundException('L\'appel à solution introuvable');
    await this.prismaService.call.update({
      data,
      where: { id },
    });
  }

  async remove(id: number) {
    const call = await this.prismaService.call.findUnique({
      where: { id },
    });
    if (!call) throw new NotFoundException('L\'appel à solution introuvable');
    await this.prismaService.call.delete({
      where: { id },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'L\'appel à solution est mis à jour',
    };
  }
}
