import { PackagesService } from './packages.service';
import { Package } from './schemas/package.schema';
export declare class PackagesController {
    private packagesService;
    constructor(packagesService: PackagesService);
    findAll(): Promise<{
        packages: Record<string, Package>;
    }>;
    findOne(id: string): Promise<Package>;
    create(packageData: Partial<Package>): Promise<Package>;
    bulkUpdate(body: {
        packages: Record<string, Package>;
    }): Promise<{
        packages: Record<string, Package>;
    }>;
    update(id: string, packageData: Partial<Package>): Promise<Package>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
