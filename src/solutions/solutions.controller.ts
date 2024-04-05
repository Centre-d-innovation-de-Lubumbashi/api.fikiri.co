import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SolutionsService } from './solutions.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { UpdateUserSolutionDto } from './dto/update-user-solution.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/auth/enums/role.enum';
import { Solution } from './entities/solution.entity';

@Controller('solutions')
export class SolutionsController {
  constructor(private readonly solutionsService: SolutionsService) {
  }

  @Post('')
  create(@Body() data: CreateSolutionDto): Promise<{ data: Solution }> {
    return this.solutionsService.create(data);
  }

  @Get('')
  findAll(): Promise<{ data: Solution[] }> {
    return this.solutionsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string): Promise<{ data: Solution }> {
    return this.solutionsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(RoleEnum.Admin)
  update(@Param('id') id: string, @Body() data: UpdateSolutionDto): Promise<{ data: Solution }> {
    return this.solutionsService.update(+id, data);
  }

  @Delete(':id')
  @Roles(RoleEnum.Admin)
  remove(@Param('id') id: string): Promise<void> {
    return this.solutionsService.remove(+id);
  }

  @Patch(':id/user')
  updateUserSolution(@Param('id') id: string, @Body() data: UpdateUserSolutionDto): Promise<{ data: Solution }> {
    return this.solutionsService.userUpdateSolution(+id, data);
  }

  @UseInterceptors(
    FilesInterceptor('thumbs', 3, {
      storage: diskStorage({
        destination: './uploads',
        filename: function(_req, file, cb) {
          cb(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`);
        },
      }),
    }),
  )
  @Post(':id/images')
  uploadImages(@Param('id') id: string, @UploadedFile() file: Express.Multer.File): Promise<void> {
    return this.solutionsService.uploadImages(+id, file);
  }

  @Delete(':id/image/delete')
  @Roles(RoleEnum.Admin)
  removeImage(@Param('id') id: string): Promise<void> {
    return this.solutionsService.deleteImage(+id);
  }

  @Public()
  @Get('mapped/all')
  findMapped(@Query('cursor') cursor: string): Promise<{ data: Solution[] }> {
    return this.solutionsService.findMapped(+cursor);
  }

  @Public()
  @Get('mapped/one/:id')
  findOneMapped(@Param('id') id: string): Promise<{ data: { solution: Solution, prev: number, next: number } }> {
    return this.solutionsService.findOneMapped(+id);
  }


  @Get('pole/:poleId')
  getByPole(@Param('poleId') poleId: string): Promise<{ data: Solution[] }> {
    return this.solutionsService.findByPole(+poleId);
  }

  @Get('conforms/all')
  findConforms(): Promise<{ data: Solution[] }> {
    return this.solutionsService.findConforms();
  }

  @Get('non-conforms/all')
  findNonConforms(): Promise<{ data: Solution[] }> {
    return this.solutionsService.findNonConforms();
  }

  @Get('curated/all')
  findCurated(): Promise<{ data: Solution[] }> {
    return this.solutionsService.findCurated();
  }
}
