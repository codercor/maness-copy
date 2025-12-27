import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GalleryItem, GalleryItemDocument } from './schemas/gallery-item.schema';
import { PackagesService } from '../packages/packages.service';
import { Package } from '../packages/schemas/package.schema';

@Injectable()
export class GalleryService {
    constructor(
        @InjectModel(GalleryItem.name) private galleryModel: Model<GalleryItemDocument>,
        @Inject(forwardRef(() => PackagesService)) private packagesService: PackagesService,
    ) { }

    async findAll(): Promise<GalleryItem[]> {
        return this.galleryModel.find().exec();
    }

    async findOne(id: string): Promise<GalleryItem> {
        const item = await this.galleryModel.findById(id).exec();
        if (!item) {
            throw new NotFoundException(`Gallery item with ID ${id} not found`);
        }
        return item;
    }

    async create(data: Partial<GalleryItem>): Promise<GalleryItem> {
        const created = new this.galleryModel(data);
        return created.save();
    }

    async update(id: string, data: Partial<GalleryItem>): Promise<GalleryItem> {
        const updated = await this.galleryModel.findByIdAndUpdate(id, data, { new: true }).exec();
        if (!updated) {
            throw new NotFoundException(`Gallery item with ID ${id} not found`);
        }
        return updated;
    }

    async delete(id: string): Promise<void> {
        const result = await this.galleryModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Gallery item with ID ${id} not found`);
        }
    }

    async seed(items: Partial<GalleryItem>[]): Promise<void> {
        const count = await this.galleryModel.countDocuments().exec();
        if (count === 0 && items.length > 0) {
            await this.galleryModel.insertMany(items);
        }
    }

    /**
     * Get all packages that feature this destination.
     * Checks both new destinationId (single) and legacy destinationIds (array).
     */
    async getPackagesForDestination(destinationId: string): Promise<Package[]> {
        // First verify the destination exists
        const destination = await this.galleryModel.findById(destinationId).exec();
        if (!destination) {
            throw new NotFoundException(`Destination with ID ${destinationId} not found`);
        }

        // Get all packages and filter those that include this destination
        const allPackages = await this.packagesService.findAll();
        const packages: Package[] = [];

        for (const pkgId of Object.keys(allPackages)) {
            const pkg = allPackages[pkgId];
            // Check new single destinationId field
            if (pkg.destinationId === destinationId) {
                packages.push(pkg);
                continue;
            }
            // Also check legacy destinationIds array for backward compatibility
            if (pkg.destinationIds && pkg.destinationIds.includes(destinationId)) {
                packages.push(pkg);
            }
        }

        return packages;
    }
}
