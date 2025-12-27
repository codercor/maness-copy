import { GalleryService } from './gallery.service';
import { GalleryItem } from './schemas/gallery-item.schema';
export declare class GalleryController {
    private galleryService;
    constructor(galleryService: GalleryService);
    findAll(): Promise<GalleryItem[]>;
}
