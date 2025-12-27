import { GalleryService } from './gallery.service';
import { GalleryItem } from './schemas/gallery-item.schema';
export declare class GalleryController {
    private galleryService;
    constructor(galleryService: GalleryService);
    findAll(): Promise<GalleryItem[]>;
    findOne(id: string): Promise<GalleryItem>;
    create(data: Partial<GalleryItem>): Promise<GalleryItem>;
    update(id: string, data: Partial<GalleryItem>): Promise<GalleryItem>;
    delete(id: string): Promise<void>;
}
