import { PrismaService } from './../database/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChallengesService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async create(createDto: Prisma.ChallengeCreateInput) {
        await this.prismaService.challenge.create({
            data: createDto
        })
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Le défi ajouté avec succès',
        };
    }

    async findAll() {
        const thematics = await this.prismaService.challenge.findMany();
        return {
            statusCode: HttpStatus.OK,
            data: thematics
        }
    }

    async findOne(id: number) {
        const thematic = await this.prismaService.challenge.findUnique({
            where: { id }
        })
        if (!thematic) throw new HttpException("Le défi n'a pas été trouvé", HttpStatus.NOT_FOUND);
        return {
            statusCode: HttpStatus.OK,
            data: thematic,
        };
    }

}
