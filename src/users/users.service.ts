import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { promisify } from 'util';
import { SignupDto } from '../auth/dto/register.dto';
import CreateUserDto from './dto/create-user.dto';
import { CreateWithGoogleDto } from './dto/create-with-google.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {
  }

  async create(createUserDto: CreateUserDto): Promise<any> {
    const { email } = createUserDto;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (user)
      throw new HttpException('L\'utilisateur existe déjà', HttpStatus.CONFLICT);
    try {
      const password: string = 'admin1234';
      const hash = await this.hashPassword(password);
      await this.prismaService.user.create({
        data: {
          ...createUserDto,
          password: hash,
          roles: {
            connect: createUserDto.roles.map((id) => ({ id })),
          },
        },
      });
    } catch {
      throw new HttpException('Mauvaise demande, essayez à nouveau', HttpStatus.BAD_REQUEST);
    }
    return {
      statusCode: HttpStatus.CREATED,
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
      throw new HttpException('L\'utilisateur existe déjà', HttpStatus.CONFLICT);

    await this.prismaService.user.create({
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
      statusCode: HttpStatus.CREATED,
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
      statusCode: HttpStatus.OK,
      data: users,
    };
  }

  async findById(id: number): Promise<any> {
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
    if (!user) throw new HttpException('L\'utilisateur n\'a pas été trouvé', HttpStatus.NOT_FOUND);
    return {
      statusCode: HttpStatus.OK,
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

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: {
        roles: true,
      },
    });
    if (user) return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    try {
      await this.prismaService.user.update({
        where: { id },
        data: {
          ...updateUserDto,
          roles: {
            connect: updateUserDto.roles.map((id) => ({ id })),
          },
        },
      });
    } catch {
      throw new HttpException('Rôles non valides', HttpStatus.BAD_REQUEST);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Mise à jour de l\'utilisateur réussie',
    };
  }

  async updateProfile(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        roles: true,
      },
    });
    if (!user) throw new HttpException('L\'utilisateur n\'a pas été trouvé', HttpStatus.NOT_FOUND);
    try {
      await this.prismaService.user.update({
        where: { id },
        data: {
          ...updateUserDto,
          roles: {
            connect: user.roles,
          },
        },
      });
    } catch {
      throw new HttpException('Rôles non valides', HttpStatus.BAD_REQUEST);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Mise à jour de l\'utilisateur réussie',
    };
  }

  async remove(id: number): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) throw new HttpException('L\'utilisateur n\'a pas été trouvé', HttpStatus.NOT_FOUND);
    await this.prismaService.user.delete({
      where: { id },
    });
    return {
      statusCode: HttpStatus.OK,
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
      statusCode: HttpStatus.OK,
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
      statusCode: HttpStatus.OK,
      message: 'L\'image a été suppimé',
    };
  }
}
