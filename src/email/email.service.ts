import { BadRequestException, Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EmailService {
  from = `Support fikiri <${this.configService.get('MAIL_USERNAME')}>`;

  constructor(
    private readonly mailerSerive: MailerService,
    private configService: ConfigService,
  ) {
  }

  async sendResetPasswordRequest(to: User, token: string): Promise<void> {
    const mail: ISendMailOptions = {
      to: to.email,
      from: this.from,
      subject: 'Code de Réinitialisation de Mot de Passe Fikiri',
      text: `
Cher(e) ${to.name},

Pour réinitialiser votre mot de passe, utilisez le code suivant : ${token}.
          
Veuillez vous rendre sur la page de réinitialisation et suivre les instructions pour finaliser le processus.
      
Si vous n'avez pas initié cette demande, veuillez contacter notre équipe de support dès que possible.
          
Merci,
L'équipe Fikiri.`,
    };
    try {
      await this.mailerSerive.sendMail(mail);
    } catch (e) {
      console.log(e);
      throw new BadRequestException(
        'Une erreur est survenenue lors de l\'envoie d\'email',
      );
    }
  }

  async sendRegisteringCurator(to: User, password: string): Promise<void> {
    const mail: ISendMailOptions = {
      to: to.email,
      from: this.from,
      subject: 'Code currateur par défaut',
      text: `
Cher(e) ${to},

Vous avez été ajouté(e) en tant que currateur sur la plateforme Fikiri.

Voici votre mot de passe par défaut: ${password}

Vous pouvez le modifier une fois connecté(e).

Connectez-vous à l'adresse suivante: https://admin.fikiri.co

Merci,
L'équipe Fikiri.`,
    };
    try {
      await this.mailerSerive.sendMail(mail);
    } catch {
      throw new BadRequestException(
        'Une erreur est survenenue lors de l\'envoie d\'email',
      );
    }
  }
}
