import {
    Param,
    Body,
    Get,
    Post,
    Put,
    Delete,
    JsonController,
    Authorized,
    Req,
    BadRequestError,
    Header,
} from 'routing-controllers';
import { Request } from 'express';

@Authorized()
@JsonController('/hello-world')
export class HelloWorldController {
    @Header('Cache-control', 'max-age=18000')
    @Get('/')
    async getAll(@Req() request: Request): Promise<any> {
        console.log('request');
        return {
            data: 'Hello World',
        };
    }
}
