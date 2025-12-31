import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HeroCarouselController } from './hero-carousel.controller';
import { HeroCarouselService } from './hero-carousel.service';
import { HeroSlide, HeroSlideSchema } from './schemas/hero-slide.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: HeroSlide.name, schema: HeroSlideSchema },
        ]),
        AuthModule, // Import to make AuthGuard work
    ],
    controllers: [HeroCarouselController],
    providers: [HeroCarouselService],
    exports: [HeroCarouselService],
})
export class HeroCarouselModule { }
