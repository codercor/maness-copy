import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { HeroCarouselService } from './hero-carousel.service';
import { HeroSlide } from './schemas/hero-slide.schema';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('hero-carousel')
export class HeroCarouselController {
    constructor(private readonly heroCarouselService: HeroCarouselService) { }

    // Public endpoint - get active slides
    @Get()
    async findAll(): Promise<HeroSlide[]> {
        return this.heroCarouselService.findAll();
    }

    // Admin endpoint - get all slides (including inactive)
    @Get('admin')
    @UseGuards(AuthGuard)
    async findAllAdmin(): Promise<HeroSlide[]> {
        return this.heroCarouselService.findAllAdmin();
    }

    // Admin endpoint - create new slide
    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() createDto: Partial<HeroSlide>): Promise<HeroSlide> {
        return this.heroCarouselService.create(createDto);
    }

    // Admin endpoint - update slide
    @Put(':id')
    @UseGuards(AuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updateDto: Partial<HeroSlide>,
    ): Promise<HeroSlide | null> {
        return this.heroCarouselService.update(id, updateDto);
    }

    // Admin endpoint - delete slide
    @Delete(':id')
    @UseGuards(AuthGuard)
    async delete(@Param('id') id: string): Promise<HeroSlide | null> {
        return this.heroCarouselService.delete(id);
    }

    // Admin endpoint - bulk reorder slides
    @Put('reorder/bulk')
    @UseGuards(AuthGuard)
    async reorder(
        @Body() orders: { id: string; order: number }[],
    ): Promise<{ success: boolean }> {
        await this.heroCarouselService.reorder(orders);
        return { success: true };
    }
}
