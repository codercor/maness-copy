import { Controller, Get } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryItem } from './schemas/gallery-item.schema';

@Controller('gallery')
export class GalleryController {
    constructor(private galleryService: GalleryService) { }

    @Get()
    async findAll(): Promise<GalleryItem[]> {
        return this.galleryService.findAll();
    }
}
