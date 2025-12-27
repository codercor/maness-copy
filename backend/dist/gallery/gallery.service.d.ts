import { Model } from 'mongoose';
import { GalleryItem, GalleryItemDocument } from './schemas/gallery-item.schema';
export declare class GalleryService {
    private galleryModel;
    constructor(galleryModel: Model<GalleryItemDocument>);
    findAll(): Promise<GalleryItem[]>;
    findOne(id: string): Promise<GalleryItem>;
    create(data: Partial<GalleryItem>): Promise<GalleryItem>;
    update(id: string, data: Partial<GalleryItem>): Promise<GalleryItem>;
    delete(id: string): Promise<void>;
    seed(items: Partial<GalleryItem>[]): Promise<void>;
}
