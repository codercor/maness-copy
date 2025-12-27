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
import { PackagesService } from './packages.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Package } from './schemas/package.schema';

@Controller('packages')
export class PackagesController {
    constructor(private packagesService: PackagesService) { }

    @Get()
    async findAll(): Promise<{ packages: Record<string, Package> }> {
        const packages = await this.packagesService.findAll();
        return { packages };
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Package> {
        return this.packagesService.findOne(id);
    }

    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() packageData: Partial<Package>): Promise<Package> {
        return this.packagesService.create(packageData);
    }

    @Put('bulk')
    @UseGuards(AuthGuard)
    async bulkUpdate(
        @Body() body: { packages: Record<string, Package> },
    ): Promise<{ packages: Record<string, Package> }> {
        const packages = await this.packagesService.bulkUpdate(body.packages);
        return { packages };
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    async update(
        @Param('id') id: string,
        @Body() packageData: Partial<Package>,
    ): Promise<Package> {
        return this.packagesService.update(id, packageData);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async remove(@Param('id') id: string): Promise<{ success: boolean }> {
        await this.packagesService.remove(id);
        return { success: true };
    }
}
