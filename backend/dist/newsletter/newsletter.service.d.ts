import { Model } from 'mongoose';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';
export declare class NewsletterService {
    private subscriberModel;
    constructor(subscriberModel: Model<SubscriberDocument>);
    subscribe(email: string, source?: string): Promise<Subscriber>;
    unsubscribe(email: string): Promise<void>;
    findAll(): Promise<Subscriber[]>;
}
