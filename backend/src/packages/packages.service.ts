import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Package, PackageDocument } from './schemas/package.schema';

@Injectable()
export class PackagesService {
    constructor(
        @InjectModel(Package.name) private packageModel: Model<PackageDocument>,
    ) { }

    async findAll(): Promise<Record<string, Package>> {
        const packages = await this.packageModel.find().exec();
        const result: Record<string, Package> = {};
        for (const pkg of packages) {
            result[pkg.id] = pkg.toObject();
        }
        return result;
    }

    async findOne(id: string): Promise<Package> {
        const pkg = await this.packageModel.findOne({ id }).exec();
        if (!pkg) {
            throw new NotFoundException(`Package ${id} not found`);
        }
        return pkg;
    }

    async create(packageData: Partial<Package>): Promise<Package> {
        const created = new this.packageModel(packageData);
        return created.save();
    }

    async update(id: string, packageData: Partial<Package>): Promise<Package> {
        const updated = await this.packageModel
            .findOneAndUpdate({ id }, packageData, { new: true })
            .exec();
        if (!updated) {
            throw new NotFoundException(`Package ${id} not found`);
        }
        return updated;
    }

    async remove(id: string): Promise<void> {
        const result = await this.packageModel.deleteOne({ id }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException(`Package ${id} not found`);
        }
    }

    async bulkUpdate(packages: Record<string, Package>): Promise<Record<string, Package>> {
        // Delete all existing packages
        await this.packageModel.deleteMany({}).exec();

        // Insert all new packages
        const packageArray = Object.entries(packages).map(([id, pkg]) => ({
            ...pkg,
            id,
        }));

        if (packageArray.length > 0) {
            await this.packageModel.insertMany(packageArray);
        }

        return this.findAll();
    }

    async seed(packages: Record<string, Package>): Promise<void> {
        const count = await this.packageModel.countDocuments().exec();
        if (count === 0) {
            await this.bulkUpdate(packages);
        }
    }
}
