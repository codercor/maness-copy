import { Model } from 'mongoose';
import { Package, PackageDocument, SupportedLanguage } from './schemas/package.schema';
export declare class PackagesService {
    private packageModel;
    constructor(packageModel: Model<PackageDocument>);
    findAll(): Promise<Record<string, Package>>;
    findOne(id: string): Promise<Package>;
    create(packageData: Partial<Package>): Promise<Package>;
    update(id: string, packageData: Partial<Package>): Promise<Package>;
    remove(id: string): Promise<void>;
    bulkUpdate(packages: Record<string, Package>): Promise<Record<string, Package>>;
    seed(packages: Record<string, Package>): Promise<void>;
    private migratePackage;
    private ensureTranslations;
    getTranslatedContent(pkg: Package, language?: SupportedLanguage): import("./schemas/package.schema").TranslatedContent | null;
}
