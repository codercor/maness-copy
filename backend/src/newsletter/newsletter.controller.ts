import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';

class SubscribeDto {
    email: string;
    source?: string;
}

@Controller('newsletter')
export class NewsletterController {
    constructor(private newsletterService: NewsletterService) { }

    @Post('subscribe')
    @HttpCode(200)
    async subscribe(@Body() subscribeDto: SubscribeDto) {
        await this.newsletterService.subscribe(
            subscribeDto.email,
            subscribeDto.source,
        );
        return { success: true, message: 'Successfully subscribed!' };
    }
}
