import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';

@Injectable()
export class NewsletterService {
    constructor(
        @InjectModel(Subscriber.name) private subscriberModel: Model<SubscriberDocument>,
    ) { }

    async subscribe(email: string, source = 'website'): Promise<Subscriber> {
        // Check if already exists
        const existing = await this.subscriberModel.findOne({ email }).exec();
        if (existing) {
            // Reactivate if previously unsubscribed
            if (!existing.active) {
                existing.active = true;
                await existing.save();
            }
            return existing;
        }

        const subscriber = new this.subscriberModel({ email, source });
        return subscriber.save();
    }

    async unsubscribe(email: string): Promise<void> {
        await this.subscriberModel.updateOne({ email }, { active: false }).exec();
    }

    async findAll(): Promise<Subscriber[]> {
        return this.subscriberModel.find({ active: true }).exec();
    }
}
