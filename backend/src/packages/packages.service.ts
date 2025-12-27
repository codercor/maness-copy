import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    Package,
    PackageDocument,
    SupportedLanguage,
    DEFAULT_LANGUAGE,
    getTranslatedContent,
} from './schemas/package.schema';

@Injectable()
export class PackagesService {
    constructor(
        @InjectModel(Package.name) private packageModel: Model<PackageDocument>,
    ) { }

    async findAll(): Promise<Record<string, Package>> {
        const packages = await this.packageModel.find().exec();
        const result: Record<string, Package> = {};
        for (const pkg of packages) {
            result[pkg.id] = this.migratePackage(pkg.toObject());
        }
        return result;
    }

    async findOne(id: string): Promise<Package> {
        const pkg = await this.packageModel.findOne({ id }).exec();
        if (!pkg) {
            throw new NotFoundException(`Package ${id} not found`);
        }
        return this.migratePackage(pkg);
    }

    async create(packageData: Partial<Package>): Promise<Package> {
        const migrated = this.ensureTranslations(packageData);
        const created = new this.packageModel(migrated);
        return created.save();
    }

    async update(id: string, packageData: Partial<Package>): Promise<Package> {
        const migrated = this.ensureTranslations(packageData);
        const updated = await this.packageModel
            .findOneAndUpdate({ id }, migrated, { new: true })
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

        // Insert all new packages with migrations
        const packageArray = Object.entries(packages).map(([id, pkg]) => ({
            ...this.ensureTranslations(pkg),
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

    // Migrate old package format to new translations format
    private migratePackage(pkg: any): Package {
        // If package already has translations, return as is
        if (pkg.translations?.en) {
            return pkg;
        }

        // Migrate from legacy destination format
        if (pkg.destination) {
            return {
                ...pkg,
                translations: {
                    en: {
                        title: pkg.destination.title,
                        description: pkg.destination.quickLook || '',
                        quickLook: pkg.destination.quickLook || '',
                    },
                },
                dates: pkg.destination.dates || pkg.dates,
                price: pkg.destination.price || pkg.price,
                image: pkg.destination.image || pkg.image,
                destinationIds: pkg.destinationIds || [],
            };
        }

        return pkg;
    }

    // Ensure package has translations structure
    private ensureTranslations(pkg: Partial<Package>): Partial<Package> {
        // If translations already exist, return as is
        if (pkg.translations?.en) {
            return {
                ...pkg,
                destinationIds: pkg.destinationIds || [],
            };
        }

        // If legacy destination exists, migrate it
        if (pkg.destination) {
            return {
                ...pkg,
                translations: {
                    en: {
                        title: pkg.destination.title,
                        description: pkg.destination.quickLook || '',
                        quickLook: pkg.destination.quickLook || '',
                    },
                },
                dates: pkg.destination.dates || (pkg as any).dates,
                price: pkg.destination.price || (pkg as any).price,
                image: pkg.destination.image || (pkg as any).image,
                destinationIds: pkg.destinationIds || [],
            };
        }

        // Return with defaults
        return {
            ...pkg,
            translations: pkg.translations || {
                en: {
                    title: pkg.name || 'Untitled',
                    description: '',
                    quickLook: '',
                },
            },
            destinationIds: pkg.destinationIds || [],
        };
    }

    // Get translated content for a package
    getTranslatedContent(pkg: Package, language: SupportedLanguage = DEFAULT_LANGUAGE) {
        return getTranslatedContent(pkg, language);
    }
}
