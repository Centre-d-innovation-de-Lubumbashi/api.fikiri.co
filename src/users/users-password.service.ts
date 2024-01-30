import { PrismaService } from "src/database/prisma.service";
import * as bcrypt from "bcrypt"
import { NotFoundException } from "@nestjs/common";

export class UsersPasswordService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async updatePassword(id: number, password: string): Promise<void> {
        const passwordHash: string = await bcrypt.hash(password, 10);
        await this.prisma.user.update({
            where: { id },
            data: { password: passwordHash },
        });
    }

    async saveResetToken(id: number, token: string): Promise<any> {
        await this.prisma.user.update({
            where: { id },
            data: { token },
        });
    }

    async findByResetToken(token: string) {
        const user = await this.prisma.user.findFirst({
            where: { token },
        });
        if (!user) throw new NotFoundException('le code fourni est invalide');
        return user;
    }

    async removeResetToken(id: number) {
        await this.prisma.user.update({
            where: { id },
            data: { token: null },
        });
    }
}