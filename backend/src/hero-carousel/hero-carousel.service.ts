import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HeroSlide, HeroSlideDocument } from './schemas/hero-slide.schema';

@Injectable()
export class HeroCarouselService {
    constructor(
        @InjectModel(HeroSlide.name)
        private heroSlideModel: Model<HeroSlideDocument>,
    ) { }

    // Get all active slides ordered by 'order' field (for public display)
    async findAll(): Promise<HeroSlide[]> {
        return this.heroSlideModel
            .find({ isActive: true })
            .sort({ order: 1 })
            .exec();
    }

    // Get all slides (including inactive) for admin
    async findAllAdmin(): Promise<HeroSlide[]> {
        return this.heroSlideModel.find().sort({ order: 1 }).exec();
    }

    // Get single slide by ID
    async findOne(id: string): Promise<HeroSlide | null> {
        return this.heroSlideModel.findById(id).exec();
    }

    // Create new slide
    async create(createDto: Partial<HeroSlide>): Promise<HeroSlide> {
        // Auto-assign order if not provided
        if (createDto.order === undefined) {
            const maxOrder = await this.heroSlideModel
                .findOne()
                .sort({ order: -1 })
                .exec();
            createDto.order = maxOrder ? maxOrder.order + 1 : 0;
        }

        const newSlide = new this.heroSlideModel(createDto);
        return newSlide.save();
    }

    // Update existing slide
    async update(id: string, updateDto: Partial<HeroSlide>): Promise<HeroSlide | null> {
        return this.heroSlideModel
            .findByIdAndUpdate(id, updateDto, { new: true })
            .exec();
    }

    // Delete slide
    async delete(id: string): Promise<HeroSlide | null> {
        return this.heroSlideModel.findByIdAndDelete(id).exec();
    }

    // Bulk reorder slides
    async reorder(orders: { id: string; order: number }[]): Promise<void> {
        const bulkOps = orders.map(({ id, order }) => ({
            updateOne: {
                filter: { _id: new Types.ObjectId(id) },
                update: { order },
            },
        }));

        await this.heroSlideModel.bulkWrite(bulkOps);
    }
}
