import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile
} from '@nestjs/common';
import {SolutionsService} from './solutions.service';
import {Prisma} from '@prisma/client';
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {v4 as uuidv4} from 'uuid';

@Controller('solutions')
export class SolutionsController {
    constructor(private readonly solutionsService: SolutionsService) {
    }

    @Post()
    create(@Body() createSolutionDto: Prisma.SolutionCreateInput & {
        thematic: number,
        call: number,
        challenges: number[],
        user: string
    }) {
        return this.solutionsService.create(createSolutionDto);
    }

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
    update(@Param('id') id: string, @Body() updateSolutionDto: Prisma.SolutionUpdateInput & { status: number }) {
        return this.solutionsService.update(+id, updateSolutionDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.solutionsService.remove(+id);
    }

    @UseInterceptors(
        FileInterceptor('thumb', {
            storage: diskStorage({
                destination: './uploads',
                filename: function (_req, file, cb) {
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
        return this.solutionsService.uploadImage(+id, file);
    }

    @Delete(':id/image/delete')
    removeImage(@Param('id') id: string) {
        return this.solutionsService.deleteImage(+id);
    }
}
