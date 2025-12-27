import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryItem } from './schemas/gallery-item.schema';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('gallery')
export class GalleryController {
    constructor(private galleryService: GalleryService) { }

    @Get()
    async findAll(): Promise<GalleryItem[]> {
        return this.galleryService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<GalleryItem> {
        return this.galleryService.findOne(id);
    }

    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() data: Partial<GalleryItem>): Promise<GalleryItem> {
        return this.galleryService.create(data);
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    async update(@Param('id') id: string, @Body() data: Partial<GalleryItem>): Promise<GalleryItem> {
        return this.galleryService.update(id, data);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async delete(@Param('id') id: string): Promise<void> {
        return this.galleryService.delete(id);
    }
}
