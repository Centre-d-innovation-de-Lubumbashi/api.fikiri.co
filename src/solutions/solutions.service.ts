import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as fs from 'fs';
import { promisify } from 'util';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { UpdateUserSolutionDto } from './dto/update-user-solution.dto';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class SolutionsService {
  constructor(
    private prismaService: PrismaService,
    private mailService: MailerService,
    private configService: ConfigService,
  ) {
  }

  async create(data: CreateSolutionDto) {
    let solution = null;
    try {
      solution = await this.prismaService.solution.create({
        data: {
          ...data,
          thematic: {
            connect: {
              id: data.thematic,
            },
          },
          user: {
            connect: {
              email: data.user,
            },
          },
          call: {
            connect: {
              id: data.call,
            },
          },
          status: {
            connect: {
              id: 1,
            },
          },
          challenges: {
            connect: data.challenges.map((id) => ({ id })),
          },
        },
      });
    } catch {
      throw new BadRequestException('Mauvaise demande, essayez à nouveau');
    }
    return {
      message: 'La solution a été ajouté avec succès',
      data: solution,
    };
  }

  async findApproved() {
    const solutions = await this.prismaService.solution.findMany({
      include: {
        thematic: true,
        status: true,
      },
    });
    const solutionsToDisplay = solutions.filter((solution) => solution.status.id > 1);
    return {
      data: solutionsToDisplay,
    };
  }

  async findAll() {
    const solutions = await this.prismaService.solution.findMany({
      include: {
        thematic: true,
        status: true,
        images: true,
      },
    });
    return {
      data: solutions,
    };
  }

  async findOne(id: number) {
    const solution = await this.prismaService.solution.findUnique({
      where: { id },
      include: {
        thematic: true,
        status: true,
        images: true,
      },
    });
    if (!solution)
      throw new NotFoundException('La solution n\'a pas été trouvé');
    return {
      data: solution,
    };
  }

  async findbyUser(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (user) {
      const solutions = await this.prismaService.solution.findMany({
        where: { userId: user.id },
        include: {
          status: true,
          images: true,
        },
      });
      return {
        data: solutions,
      };
    }
  }

  async findByCall(callId: number) {
    const solutions = await this.prismaService.solution.findMany({
      where: { callId },
      include: { thematic: true },
    });
    return {
      statusCode: HttpStatus.OK,
      data: solutions,
    };
  }

  async updateUserSolution(id: number, data: UpdateUserSolutionDto) {
    const soultion = await this.prismaService.solution.findUnique({
      where: { id },
    });
    if (!soultion) throw new NotFoundException('La solution est introuvable');
    let newSolution = null;
    try {
      newSolution = await this.prismaService.solution.update({
        where: { id },
        data: {
          ...data,
        },
      });
    } catch {
      throw new HttpException(
        'Erreur survenue lors de la mise à jour',
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      data: newSolution,
      message: 'La solution a été mise à jour',
    };
  }

  async update(id: number, data: UpdateSolutionDto) {
    const soultion = await this.prismaService.solution.findUnique({
      where: { id },
    });
    if (!soultion) throw new NotFoundException('La solution est introuvable');
    let newSolution = null;
    try {
      newSolution = await this.prismaService.solution.update({
        where: { id },
        data: {
          ...data,
          thematic: {
            connect: {
              id: data.thematic,
            },
          },
          user: {
            connect: {
              email: data.user,
            },
          },
          call: {
            connect: {
              id: data.call,
            },
          },
          status: {
            connect: {
              id: 1,
            },
          },
          challenges: {
            connect: data.challenges.map((id: number) => ({ id })),
          },
        },
      });
    } catch {
      throw new BadRequestException('Mauvaise demande, essayez à nouveau');
    }
    return {
      message: 'La solution a été mise à jour',
      data: newSolution,
    };
  }

  async remove(id: number) {
    const solution = await this.prismaService.solution.findUnique({
      where: { id },
    });
    if (!solution) throw new NotFoundException('La solution n\'a pas été trouvé');
    await this.prismaService.solution.delete({
      where: { id },
    });
    return {
      message: 'La solution est supprimé avec succès',
    };
  }

  async uploadImages(id: number, images: Express.Multer.File[]) {
    await this.prismaService.solution.update({
      where: { id },
      data: {
        images: {
          create: images.map((image) => ({ imageLink: image.filename })),
        },
      },
    });
    return {
      message: 'L\'upload a réussi',
    };
  }

  async deleteImage(id: number): Promise<any> {
    const image = await this.prismaService.solutionImages.findUnique({
      where: { id },
    });
    if (!image) throw new NotFoundException('L\'image n\'a pas été trouvée');
    await unlinkAsync(`./uploads/${image.imageLink}`);
    await this.prismaService.solutionImages.delete({
      where: { id },
    });
    return {
      message: 'L\'image a été suppimé',
    };
  }

  async sendComment(to: string, comment: string) {
    let from = `Support fikiri <${this.configService.get('MAIL_USERNAME')}>`;
    await this.mailService.sendMail({
      to,
      from,
      subject: 'Objet : Commentaire sur votre solution soumise sur fikiri',
      text: comment,
    });
  }

  async addFeedback(id: number, feedback: CreateFeedbackDto) {
    const solution = await this.prismaService.solution.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
    if (!solution) throw new NotFoundException('La solution n\'a pas été trouvé');
    const label = await this.prismaService.feedback.create({
      data: {
        ...feedback,
        user: {
          connect: {
            email: feedback.user,
          },
        },
        labels: {
          connect: feedback.labels.map((id) => ({ id })),
        },
      },
    });

    await this.prismaService.solution.update({
      where: { id },
      data: {
        feedbacks: {
          connect: {
            id: label.id,
          },
        },
      },
    });

    await this.sendComment(solution.user.email, feedback.userComment);
    return {
      message: 'Le feedback a été ajouté',
    };
  }

  async solutionsByPole(pole: number) {
    const data = await this.prismaService.solution.findMany({
      where: { pole },
    });
    return { data };
  }

  async sendEmail(solution: any) {
    const from = `Support fikiri <${this.configService.get('MAIL_USERNAME')}>`;

    await this.mailService.sendMail({
      to: solution.user.email,
      from,
      subject: 'Objet : Urgent - Soumission de Preuves Cruciale pour Fikiri',
      text: `
Bonjour ${solution.user.name},

Nous espérons que ce message vous trouve bien. Nous vous rappelons l'importance vitale de fournir des preuves pour les solutions que vous avez soumises. Votre avancement dans le processus de sélection dépend de cette étape cruciale.

Votre implication jusqu'à présent a été exceptionnelle, et nous comprenons que cette dernière étape peut sembler exigeante. Cependant, la qualité des preuves est essentielle pour évaluer la pertinence et l'applicabilité de vos solutions.

Nous vous encourageons à soumettre ces preuves dans les plus brefs délais. L'avenir du pays dépend de votre engagement à fournir des solutions solides. Votre succès contribuera à l'avancement global de Fikiri en tant que plateforme d'innovation cruciale pour notre nation.

Nous sommes là pour vous soutenir, et nous vous remercions sincèrement pour votre contribution précieuse.

Cordialement,
L'équipe Fikiri.
 `,
    });
  }

  async sendMailToUserWithoutImageLink() {
    const solutions = await this.prismaService.solution.findMany({
      include: {
        user: true,
        images: true,
      },
    });
    const solutionsWithImages = solutions.filter((solution) => solution.images.length > 0 || solution.imageLink);
    const solutionsWithVideos = solutions.filter((solution) => solution.videoLink && !solutionsWithImages.includes(solution));
    const videosAndImages = solutions.filter((solution) => solution.videoLink && (solution.images.length > 0 || solution.imageLink));

    for (const solution of solutions) {
      if (!solutionsWithImages.includes(solution) && !solutionsWithVideos.includes(solution)) {
        if (solution.user.email) {
          await this.sendEmail(solution);
        }
      }
    }

    return {
      total: solutions.length,
      withImages: solutionsWithImages.length,
      withVideos: solutionsWithVideos.length,
      withVideosAndImages: videosAndImages.length,
    };
  }
}
