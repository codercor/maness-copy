import { Controller, Get, Post, Delete, Body, Query, Param, HttpCode } from '@nestjs/common';
import { IsEmail, IsString, IsOptional } from 'class-validator';
import { NewsletterService } from './newsletter.service';

class SubscribeDto {
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    source?: string;
}

@Controller('newsletter')
export class NewsletterController {
    constructor(private newsletterService: NewsletterService) { }

    @Get()
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.newsletterService.findAll(Number(page), Number(limit));
    }

    @Get('emails')
    async getAllEmails() {
        const emails = await this.newsletterService.getAllEmails();
        return { emails };
    }

    @Get('export')
    async export() {
        const subscribers = await this.newsletterService.export();
        return { data: subscribers };
    }

    @Post('subscribe')
    @HttpCode(200)
    async subscribe(@Body() subscribeDto: SubscribeDto) {
        await this.newsletterService.subscribe(
            subscribeDto.email,
            subscribeDto.source,
        );
        return { success: true, message: 'Successfully subscribed!' };
    }



    @Post('unsubscribe')
    @HttpCode(200)
    async unsubscribe(@Body() body: { email: string }) {
        await this.newsletterService.unsubscribe(body.email);
        return { success: true, message: 'Successfully unsubscribed!' };
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        await this.newsletterService.delete(id);
        return { success: true, message: 'Subscriber deleted' };
    }
}
