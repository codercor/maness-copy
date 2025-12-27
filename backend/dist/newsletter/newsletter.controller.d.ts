import { NewsletterService } from './newsletter.service';
declare class SubscribeDto {
    email: string;
    source?: string;
}
export declare class NewsletterController {
    private newsletterService;
    constructor(newsletterService: NewsletterService);
    subscribe(subscribeDto: SubscribeDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
export {};
