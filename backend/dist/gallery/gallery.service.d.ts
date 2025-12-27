import { Model } from 'mongoose';
import { GalleryItem, GalleryItemDocument } from './schemas/gallery-item.schema';
export declare class GalleryService {
    private galleryModel;
    constructor(galleryModel: Model<GalleryItemDocument>);
    findAll(): Promise<GalleryItem[]>;
    seed(items: Partial<GalleryItem>[]): Promise<void>;
}
