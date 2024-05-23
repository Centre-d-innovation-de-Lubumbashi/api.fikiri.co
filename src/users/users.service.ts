import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs-extra';
import { promisify } from 'util';
import { SignupDto } from '../auth/dto/register.dto';
import CreateUserDto from './dto/create-user.dto';
import { CreateWithGoogleDto } from './dto/create-with-google.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import UpdateProfileDto from '../auth/dto/update-profile.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { Repository } from 'typeorm';
import { RoleEnum } from '../auth/enums/role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EmailService } from '../email/email.service';
import { randomPassword } from '../helpers/random-password';

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService
  ) {}

  async create(dto: CreateUserDto): Promise<{ data: User }> {
    try {
      const exists: boolean = await this.userRepository.exists({
        where: { email: dto.email }
      });
      if (exists) new ConflictException("L'utilisateur existe déjà");
      const password: string = randomPassword();
      const user: User = await this.userRepository.save({
        ...dto,
        password,
        organisation: { id: dto.organisation },
        pole: { id: dto.pole },
        roles: dto.roles.map((id) => ({ id }))
      });
      await this.emailService.sendRegistrationEmail(user, password);
      return { data: user };
    } catch {
      throw new BadRequestException("Erreur lors de la création de l'utilisateur");
    }
  }

  async register(dto: SignupDto): Promise<{ data: User }> {
    const exists: boolean = await this.userRepository.exists({
      where: { email: dto.email }
    });
    if (exists) new ConflictException();
    delete dto.password_confirm;
    const data: User = await this.userRepository.save({
      ...dto,
      roles: [{ name: RoleEnum.User }]
    });
    return { data };
  }

  async findUsers(): Promise<{ data: User[] }> {
    const data: User[] = await this.userRepository.find({
      // relations: ['roles'],
      // where: { roles: { name: RoleEnum.User } },
      order: { created_at: 'DESC' }
    });
    // move profiles
    data.forEach((user) => {
      if (user.profile && fs.existsSync(`./uploads/${user.profile}`)) {
        fs.move(`./uploads/${user.profile}`, `./uploads/profiles/${user.profile}`);
      }
    });
    return { data };
  }

  async findCurators(): Promise<{ data: User[] }> {
    const data: User[] = await this.userRepository.find({
      where: { roles: { name: RoleEnum.Curator } },
      relations: ['roles', 'organisation', 'pole']
    });
    return { data };
  }

  async findAdmins(): Promise<{ data: User[] }> {
    const data: User[] = await this.userRepository.find({
      where: { roles: { name: RoleEnum.Admin } },
      relations: ['roles', 'organisation', 'pole']
    });
    return { data };
  }

  async findOne(id: number): Promise<{ data: User }> {
    try {
      const data: User = await this.userRepository.findOneOrFail({
        where: { id },
        relations: ['roles', 'pole', 'organisation']
      });
      return { data };
    } catch {
      throw new BadRequestException('Aucun utilisateur trouvé avec cet identifiant');
    }
  }

  async findByEmail(email: string): Promise<{ data: User | null }> {
    const data: User | null = await this.userRepository.findOne({
      where: { email },
      relations: ['roles']
    });
    return { data };
  }

  async findOrCreate(dto: CreateWithGoogleDto): Promise<{ data: User }> {
    try {
      const existingUser: User = await this.userRepository.findOne({
        where: { email: dto.email }
      });
      if (existingUser && !existingUser.profile) {
        existingUser.google_image = dto.google_image;
        await this.userRepository.save(existingUser);
      }
      if (existingUser) return { data: existingUser };
      const newUser: User = await this.userRepository.save({
        ...dto,
        roles: [{ name: RoleEnum.User }]
      });
      return { data: newUser };
    } catch {
      throw new BadRequestException("Erreur lors de la récupération de l'utilisateur");
    }
  }

  async update(id: number, dto: UpdateUserDto): Promise<{ data: User }> {
    try {
      const { data: user } = await this.findOne(id);
      const data: User = await this.userRepository.save({
        ...user,
        ...dto,
        organisation: { id: dto.organisation || user.organisation?.id },
        pole: { id: dto.pole || user.pole?.id },
        roles: dto?.roles?.map((id) => ({ id })) || user.roles.map((role) => ({ id: role.id }))
      });
      return { data };
    } catch {
      throw new BadRequestException("Erreur lors de la modification de l'utilisateur");
    }
  }

  async updateProfile(@CurrentUser() user: User, dto: UpdateProfileDto): Promise<{ data: User }> {
    try {
      const data: User = await this.userRepository.save({
        ...user,
        ...dto
      });
      return { data };
    } catch {
      throw new BadRequestException('Erreur lors de la modification du profil');
    }
  }

  async uploadImage(id: number, image: Express.Multer.File): Promise<{ data: User }> {
    const { data: user } = await this.findOne(id);
    try {
      await unlinkAsync(`./uploads/${user.profile}`);
    } catch {
    } finally {
      user.profile = image.filename;
      await this.userRepository.save(user);
      return { data: user };
    }
  }

  async deleteProfileImage(id: number): Promise<{ data: { message: string } }> {
    try {
      const { data: user } = await this.findOne(id);
      await unlinkAsync(`./uploads/${user.profile}`);
      await this.userRepository.update(id, { profile: null });
      return { data: { message: 'Image de profil supprimée avec succès' } };
    } catch {
      throw new BadRequestException("Erreur lors de la suppression de l'image");
    }
  }

  async findByResetToken(token: string): Promise<{ data: User }> {
    try {
      const data: User = await this.userRepository.findOneByOrFail({ token });
      return { data };
    } catch {
      throw new NotFoundException('le code fourni est invalide');
    }
  }

  async updatePassword(id: number, password: string): Promise<{ data: User }> {
    try {
      const { data: user } = await this.findOne(id);
      user.password = password;
      const updatedUser = await this.userRepository.save(user);
      return { data: updatedUser };
    } catch {
      throw new BadRequestException('Erreur lors de la réinitialisation du mot de passe');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.findOne(id);
      await this.userRepository.delete(id);
    } catch {
      throw new BadRequestException("Erreur lors de la suppression de l'utilisateur");
    }
  }
}
