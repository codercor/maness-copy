import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { GalleryItem, GalleryItemSchema } from './schemas/gallery-item.schema';
import { AuthModule } from '../auth/auth.module';
import { PackagesModule } from '../packages/packages.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: GalleryItem.name, schema: GalleryItemSchema }]),
        AuthModule,
        forwardRef(() => PackagesModule),
    ],
    controllers: [GalleryController],
    providers: [GalleryService],
    exports: [GalleryService],
})
export class GalleryModule { }
