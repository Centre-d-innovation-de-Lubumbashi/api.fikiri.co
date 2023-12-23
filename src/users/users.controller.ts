import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {
  }

  @Post()
  create(@Body() createUserDto: Prisma.UserCreateInput & { roles: number[] }): Promise<any> {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Query('page') page: string = '1'): Promise<any> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<any> {
    return this.userService.findById(+id);
  }

  @Post('create')
  findOrCreate(@Body() userDto: Prisma.UserCreateInput) {
    return this.userService.findOrCreate(userDto.email, userDto.name);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ): Promise<any> {
    return this.userService.update(+id, updateUserDto);
  }

  @UseInterceptors(
    FileInterceptor('thumb', {
      storage: diskStorage({
        destination: './uploads',
        filename: function(_req, file, cb) {
          cb(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`);
        },
      }),
    }),
  )
  @Post(':id/image')
  uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.uploadImage(+id, file);
  }

  @Delete(':id/image/delete')
  removeImage(@Param('id') id: string) {
    return this.userService.deleteImage(+id);
  }


  @Delete(':id')
  remove(@Param('id') id: string): Promise<any> {
    return this.userService.remove(+id);
  }
}
