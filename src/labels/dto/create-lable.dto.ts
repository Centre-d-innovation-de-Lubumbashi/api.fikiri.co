import { IsNotEmpty } from 'class-validator';

export class CreateLableDto {
  @IsNotEmpty({
    message: "Le nom est obligatoire"
  })
  name: string;
}
