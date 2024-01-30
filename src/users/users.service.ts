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

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService
  ) {
  }

  async create(dto: CreateUserDto) {
    const { email } = dto;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    let newUser = null;
    if (user)
      throw new ConflictException('L\'utilisateur existe déjà');
    try {
      const password: string = 'admin1234';
      const hash = await this.hashPassword(password);
      newUser = await this.prismaService.user.create({
        data: {
          ...dto,
          password: hash,
          pole: {
            connect: {
              id: dto.pole
            }
          },
          roles: {
            connect: dto.roles.map((id) => ({ id })),
          },
        },
      });
    } catch {
      throw new BadRequestException('Mauvaise demande, essayez à nouveau');
    }
    return {
      data: newUser,
      message: 'L\'utilisateur a été ajouté avec succès',
    };
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async register(registerDto: SignupDto) {
    const email: string = registerDto.email as string;
    const password: string = registerDto.password as string;
    const hash = await this.hashPassword(password);
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (user)
      throw new ConflictException('L\'utilisateur existe déjà');

    const newUser = await this.prismaService.user.create({
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
    return {
      data: newUser,
      message: 'L\'inscription est réussie',
    };
  }

  async findAll() {
    const users = await this.prismaService.user.findMany({
      include: {
        roles: true,
      },
    });
    return {
      data: users,
    };
  }

  async findOne(id: number): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        roles: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('L\'utilisateur n\'a pas été trouvé');
    return {
      data: user,
    };
  }

  async findOrCreate(createWithGoofleDto: CreateWithGoogleDto) {
    let user = await this.prismaService.user.findUnique({
      where: { email: createWithGoofleDto.email },
    });
    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          ...createWithGoofleDto,
          roles: {
            connectOrCreate: {
              where: { name: 'USER' },
              create: { name: 'USER' },
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
    let user = null;
    try {
      user = await this.prismaService.user.update({
        where: { id },
        data: {
          ...dto,
          pole: {
            connect: {
              id: dto.pole
            }
          },
          roles: {
            connect: dto.roles.map((id) => ({ id })),
          },
        },
      });
    } catch {
      throw new BadRequestException('Echec lors de la mise à jour de l\'utlisateur');
    }
    return {
      data: user,
      message: 'Mise à jour de l\'utilisateur réussie',
    };
  }

  async updateProfile(id: number, data: UpdateProfileDto) {
    let user = null;
    try {
      user = await this.prismaService.user.update({
        where: { id },
        data,
      });
    } catch {
      throw new BadRequestException('Echec lors de la mise à jour du profile');
    }
    return {
      message: 'Mise à jour du profile réussie',
      data: user,
    };
  }

  async remove(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException('L\'utilisateur n\'a pas été trouvé');
    await this.prismaService.user.delete({
      where: { id },
    });
    return {
      message: 'L\'utilisateur est supprimé avec succès',
    };
  }


  async uploadImage(id: number, image: Express.Multer.File): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    try {
      if (user.profile) await unlinkAsync(`./uploads/${user.profile}`);
    } finally {
      await this.prismaService.user.update({
        where: { id },
        data: {
          profile: image.filename,
        },
      });
    }
    return {
      message: 'L\'image a été téléchargée avec succès',
    };
  }


  async deleteImage(id: number): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException('L\'utilisateur n\'existe pas');
    await unlinkAsync(`./uploads/${user.profile}`);
    await this.prismaService.user.update({
      where: { id },
      data: {
        profile: null,
      },
    });
    return {
      message: 'L\'image a été suppimé',
    };
  }
}
