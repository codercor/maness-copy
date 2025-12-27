import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { PackagesModule } from './packages/packages.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { GalleryModule } from './gallery/gallery.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    // Environment configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // MongoDB connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/menescape',
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    AuthModule,
    PackagesModule,
    NewsletterModule,
    GalleryModule,
    TestimonialsModule,
    UploadModule,
  ],
})
export class AppModule { }

