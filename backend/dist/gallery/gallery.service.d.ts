import { Model } from 'mongoose';
import { GalleryItem, GalleryItemDocument } from './schemas/gallery-item.schema';
import { PackagesService } from '../packages/packages.service';
import { Package } from '../packages/schemas/package.schema';
export declare class GalleryService {
    private galleryModel;
    private packagesService;
    constructor(galleryModel: Model<GalleryItemDocument>, packagesService: PackagesService);
    findAll(): Promise<GalleryItem[]>;
    findOne(id: string): Promise<GalleryItem>;
    create(data: Partial<GalleryItem>): Promise<GalleryItem>;
    update(id: string, data: Partial<GalleryItem>): Promise<GalleryItem>;
    delete(id: string): Promise<void>;
    seed(items: Partial<GalleryItem>[]): Promise<void>;
    getPackagesForDestination(destinationId: string): Promise<Package[]>;
}
