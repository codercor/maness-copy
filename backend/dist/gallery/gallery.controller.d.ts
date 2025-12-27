import { GalleryService } from './gallery.service';
import { GalleryItem } from './schemas/gallery-item.schema';
import { Package } from '../packages/schemas/package.schema';
export declare class GalleryController {
    private galleryService;
    constructor(galleryService: GalleryService);
    findAll(): Promise<GalleryItem[]>;
    findOne(id: string): Promise<GalleryItem>;
    getPackagesForDestination(id: string): Promise<Package[]>;
    create(data: Partial<GalleryItem>): Promise<GalleryItem>;
    update(id: string, data: Partial<GalleryItem>): Promise<GalleryItem>;
    delete(id: string): Promise<void>;
}
