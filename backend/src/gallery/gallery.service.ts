import { Injectable } from '@nestjs/common';
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

    async seed(items: Partial<GalleryItem>[]): Promise<void> {
        const count = await this.galleryModel.countDocuments().exec();
        if (count === 0 && items.length > 0) {
            await this.galleryModel.insertMany(items);
        }
    }
}
