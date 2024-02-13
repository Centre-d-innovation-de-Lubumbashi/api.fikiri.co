import { IsNotEmpty } from 'class-validator';

export class CreateLableDto {
  @IsNotEmpty({
    message: "Le nom est obligatoire"
  })
  name: string;

  @IsNotEmpty({ message: "La quotation est obligatoire" })
  average: number;
}
