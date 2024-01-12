import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { SolutionsService } from './solutions.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('solutions')
export class SolutionsController {
  constructor(private readonly solutionsService: SolutionsService) {
  }

  @Post()
  create(@Body() data: CreateSolutionDto) {
    return this.solutionsService.create(data);
  }

  @Public()
  @Get('approved')
  findApproved() {
    return this.solutionsService.findApproved();
  }

  @Get()
  findAll() {
    return this.solutionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solutionsService.findOne(+id);
  }

  @Get('user/:email')
  findByUser(@Param('email') email: string) {
    return this.solutionsService.findbyUser(email);
  }

  @Get('challenge/:id')
  findByCall(@Param('id') id: string) {
    return this.solutionsService.findByCall(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateSolutionDto) {
    return this.solutionsService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.solutionsService.remove(+id);
  }

  @UseInterceptors(
    FilesInterceptor('thumbs', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: function(_req, file, cb) {
          cb(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`);
        },
      }),
    }),
  )
  @Post(':id/images')
  uploadImage(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]) {
    return this.solutionsService.uploadImage(+id, files);
  }

  @Delete(':id/image/delete')
  removeImage(@Param('id') id: string) {
    return this.solutionsService.deleteImage(+id);
  }
}
