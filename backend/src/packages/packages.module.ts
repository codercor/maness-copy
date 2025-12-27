import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { Package, PackageSchema } from './schemas/package.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Package.name, schema: PackageSchema }]),
        AuthModule,
    ],
    controllers: [PackagesController],
    providers: [PackagesService],
    exports: [PackagesService],
})
export class PackagesModule { }
