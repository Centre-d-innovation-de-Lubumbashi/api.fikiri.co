import {HttpStatus, Injectable} from '@nestjs/common';
import {PrismaService} from "../database/prisma.service";

@Injectable()
export class StatusService {
    constructor(
        private readonly prismaService: PrismaService
    ) {
    }

    async findAll() {
        const status = await this.prismaService.status.findMany()
        return {
            statusCode: HttpStatus.OK,
            data: status
        }
    }
}
