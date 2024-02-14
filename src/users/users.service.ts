import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { promisify } from 'util';
import { SignupDto } from '../auth/dto/register.dto';
import CreateUserDto from './dto/create-user.dto';
import { CreateWithGoogleDto } from './dto/create-with-google.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import UpdateProfileDto from '../auth/dto/update-profile.dto';
import { User } from '@prisma/client';
import { randomPassword } from 'src/helpers/random-password';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { paginate } from 'src/helpers/paginate';

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
  }

  async registerEmail(to: string, password: string) {
    let from = `Support fikiri <${this.configService.get('MAIL_USERNAME')}>`;
    await this.mailerService.sendMail({
      to,
      from,
      subject: 'Code currateur par défaut',
      text: `
Cher(e) ${to},

Vous avez été ajouté(e) en tant que currateur sur la plateforme Fikiri.

Voici votre mot de passe par défaut: ${password}

Vous pouvez le modifier une fois connecté(e).

Connectez-vous à l'adresse suivante: https://admin.fikiri.co

Merci,
L'équipe Fikiri.`,
    });
  }


  async create(dto: CreateUserDto) {
    await this.userExist(dto.email);
    const password: string = randomPassword();
    const hash = await this.hashPassword(password);
    await this.prismaService.user.create({
      data: {
        ...dto,
        password: hash,
        organisation: {
          connect: {
            id: dto.organisation,
          },
        },
        pole: {
          connect: {
            id: dto.pole,
          },
        },
        roles: {
          connect: dto.roles.map((id) => ({ id })),
        },
      },
    });
    await this.registerEmail(dto.email, password);
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async userExist(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (user) throw new ConflictException('L\'utilisateur existe déjà');
  }

  async register(registerDto: SignupDto) {
    await this.userExist(registerDto.email);
    const password: string = registerDto.password as string;
    const hash = await this.hashPassword(password);
    const data = await this.prismaService.user.create({
      data: {
        ...registerDto,
        password: hash,
        roles: {
          connect: {
            id: 3,
          },
        },
      },
    });
    return { data };
  }

  async findAll(page: number) {
    const { limit, offset } = paginate(page, 10);
    const data: User[] = await this.prismaService.user.findMany({
      // skip: offset,
      // take: limit,
      include: {
        roles: true,
      },
    });
    return { data };
  }

  async findAllCurators(page: number) {
    const { limit, offset } = paginate(page, 10);
    const data = await this.prismaService.user.findMany({
      // skip: offset,
      // take: limit,
      where: {
        roles: {
          some: {
            id: 1,
          },
        },
      },
      include: {
        roles: true,
      },
    });
    return { data };
  }

  async findAllAdmins(page: number) {
    const { limit, offset } = paginate(page, 10);
    const data = await this.prismaService.user.findMany({
      // skip: offset,
      // take: limit,
      where: {
        roles: {
          some: {
            id: 4,
          },
        },
      },
      include: {
        roles: true,
      },
    });
    return { data };
  }

  async findOne(id: number) {
    const data = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        roles: true,
      },
    });
    if (!data) throw new NotFoundException('L\'utilisateur n\'a pas été trouvé');
    return { data };
  }

  async findOrCreate(dto: CreateWithGoogleDto) {
    let user = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          ...dto,
          roles: {
            connect: {
              id: 3,
            },
          },
        },
      });
    }
    return user;
  }

  async findBy(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: {
        roles: true,
      },
    });
    if (!user) throw new NotFoundException('L\'utilisateur n\'a pas été trouvé');
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const { data: user } = await this.findOne(id);
    const data: User = await this.prismaService.user.update({
      where: { id },
      data: {
        ...dto,
        organisation: {
          connect: {
            id: dto.organisation || user.organisationId,
          },
        },
        pole: {
          connect: {
            id: dto.pole || user.poleId,
          },
        },
        roles: {
          set: dto?.roles?.map((id) => ({ id })) || user.roles,
        },
      },
    });
    return { data };
  }

  async passwordMatch(password: string, hash: string) {
    if (!hash) throw new BadRequestException('Les identifiants saisis sont invalides');
    return await bcrypt.compare(password, hash);
  }

  async updateProfile(id: number, dto: UpdateProfileDto) {
    const data: User = await this.prismaService.user.update({
      where: { id },
      data: {
        name: dto.name,
        address: dto.address,
        phoneNumber: dto.phoneNumber,
      },
    });
    const isMatch = dto.oldPassword && dto.password && await this.passwordMatch(dto.oldPassword, data.password);
    if (isMatch) {
      await this.updatePassword(id, dto.password);
    } else if (dto.oldPassword && dto.password) throw new BadRequestException('Les identifiants saisis sont invalides');
    return { data };
  }


  async remove(id: number) {
    await this.findOne(id);
    await this.prismaService.user.delete({
      where: { id },
    });
  }


  async uploadImage(id: number, image: Express.Multer.File): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (user.profile) await unlinkAsync(`./uploads/${user.profile}`);
    await this.prismaService.user.update({
      where: { id },
      data: {
        profile: image.filename,
      },
    });
  }

  async deleteImage(id: number): Promise<any> {
    const { data: user } = await this.findOne(id);
    await unlinkAsync(`./uploads/${user.profile} `);
    await this.prismaService.user.update({
      where: { id },
      data: { profile: null },
    });
  }

  async updatePassword(id: number, password: string) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash: string = await bcrypt.hash(password, salt);
    await this.prismaService.user.update({
      where: { id },
      data: { password: passwordHash },
    });
  }

  async saveResetToken(email: string, token: string) {
    await this.prismaService.user.update({
      where: { email },
      data: { token },
    });
  }

  async findByResetToken(token: string) {
    const user = await this.prismaService.user.findFirst({
      where: { token },
    });
    if (!user) throw new NotFoundException('le code fourni est invalide');
    return user;
  }

  async removeResetToken(id: number) {
    await this.prismaService.user.update({
      where: { id },
      data: { token: null },
    });
  }
}
