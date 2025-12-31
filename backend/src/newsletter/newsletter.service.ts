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

    async bulkSubscribe(subscribers: { email: string; source?: string }[]): Promise<number> {
        let count = 0;
        for (const sub of subscribers) {
            try {
                await this.subscribe(sub.email, sub.source || 'import');
                count++;
            } catch (e) {
                // Continue on duplicate/error
            }
        }
        return count;
    }

    async unsubscribe(email: string): Promise<void> {
        await this.subscriberModel.updateOne({ email }, { active: false }).exec();
    }

    async delete(id: string): Promise<void> {
        await this.subscriberModel.findByIdAndDelete(id).exec();
    }

    async findAll(page = 1, limit = 10): Promise<{ data: Subscriber[]; total: number }> {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.subscriberModel.find({ active: true })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.subscriberModel.countDocuments({ active: true }).exec(),
        ]);
        return { data, total };
    }

    async getAllEmails(): Promise<string[]> {
        const subscribers = await this.subscriberModel.find({ active: true }).select('email').exec();
        return subscribers.map(s => s.email);
    }

    async export(): Promise<Subscriber[]> {
        return this.subscriberModel.find({ active: true }).sort({ createdAt: -1 }).exec();
    }
}
