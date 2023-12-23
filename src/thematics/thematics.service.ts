import { PrismaService } from './../database/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ThematicsService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async create(createThematicDto: Prisma.ThematicCreateInput) {
        await this.prismaService.thematic.create({
            data: {
                ...createThematicDto
            },

        })
        return {
            statusCode: HttpStatus.CREATED,
            message: 'La thématique ajouté avec succès',
        };
    }

    async findAll() {
        const thematics = await this.prismaService.thematic.findMany();
        return {
            statusCode: HttpStatus.OK,
            data: thematics
        }
    }

    async findOne(id: number) {
        const thematic = await this.prismaService.thematic.findUnique({
            where: { id },
            include: {
                challenges: true
            }
        })
        if (!thematic) throw new HttpException("La thématique n'a pas été trouvé", HttpStatus.NOT_FOUND);
        return {
            statusCode: HttpStatus.OK,
            data: thematic,
        };
    }

    async update(id: number, updateThematicDto: Prisma.ThematicUpdateInput) {
        const thematic = await this.prismaService.thematic.findUnique({
            where: { id }
        });
        if (!thematic) throw new HttpException("La thématique n'a pas été trouvé", HttpStatus.NOT_FOUND);
        await this.prismaService.thematic.update({
            data: updateThematicDto,
            where: { id }
        });
        return {
            statusCode: HttpStatus.OK,
            message: 'La thématique est mis à jour avec succès',
        };
    }

    async remove(id: number) {
        const thematic = await this.prismaService.thematic.findUnique({
            where: { id }
        });
        if (!thematic) throw new HttpException("La thématique n'a pas été trouvé", HttpStatus.NOT_FOUND);
        await this.prismaService.thematic.delete({
            where: { id }
        });
        return {
            statusCode: HttpStatus.OK,
            message: 'La thématique a été supprimé avec succès',
        };
    }
}
