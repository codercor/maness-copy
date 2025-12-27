import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GalleryItem, GalleryItemDocument } from './schemas/gallery-item.schema';

@Injectable()
export class GalleryService {
    constructor(
        @InjectModel(GalleryItem.name) private galleryModel: Model<GalleryItemDocument>,
    ) { }

    async findAll(): Promise<GalleryItem[]> {
        return this.galleryModel.find().exec();
    }

    async findOne(id: string): Promise<GalleryItem> {
        const item = await this.galleryModel.findById(id).exec();
        if (!item) {
            throw new NotFoundException(`Gallery item with ID ${id} not found`);
        }
        return item;
    }

    async create(data: Partial<GalleryItem>): Promise<GalleryItem> {
        const created = new this.galleryModel(data);
        return created.save();
    }

    async update(id: string, data: Partial<GalleryItem>): Promise<GalleryItem> {
        const updated = await this.galleryModel.findByIdAndUpdate(id, data, { new: true }).exec();
        if (!updated) {
            throw new NotFoundException(`Gallery item with ID ${id} not found`);
        }
        return updated;
    }

    async delete(id: string): Promise<void> {
        const result = await this.galleryModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Gallery item with ID ${id} not found`);
        }
    }

    async seed(items: Partial<GalleryItem>[]): Promise<void> {
        const count = await this.galleryModel.countDocuments().exec();
        if (count === 0 && items.length > 0) {
            await this.galleryModel.insertMany(items);
        }
    }
}
