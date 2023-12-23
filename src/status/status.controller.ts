import {Controller, Get} from '@nestjs/common';
import {StatusService} from "./status.service";

@Controller('status')
export class StatusController {
    constructor(
        private statusService: StatusService
    ) {
    }

    @Get()
    findAll(){
        return this.statusService.findAll()
    }
}
