"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackagesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const package_schema_1 = require("./schemas/package.schema");
let PackagesService = class PackagesService {
    packageModel;
    constructor(packageModel) {
        this.packageModel = packageModel;
    }
    async findAll() {
        const packages = await this.packageModel.find().exec();
        const result = {};
        for (const pkg of packages) {
            result[pkg.id] = pkg.toObject();
        }
        return result;
    }
    async findOne(id) {
        const pkg = await this.packageModel.findOne({ id }).exec();
        if (!pkg) {
            throw new common_1.NotFoundException(`Package ${id} not found`);
        }
        return pkg;
    }
    async create(packageData) {
        const created = new this.packageModel(packageData);
        return created.save();
    }
    async update(id, packageData) {
        const updated = await this.packageModel
            .findOneAndUpdate({ id }, packageData, { new: true })
            .exec();
        if (!updated) {
            throw new common_1.NotFoundException(`Package ${id} not found`);
        }
        return updated;
    }
    async remove(id) {
        const result = await this.packageModel.deleteOne({ id }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException(`Package ${id} not found`);
        }
    }
    async bulkUpdate(packages) {
        await this.packageModel.deleteMany({}).exec();
        const packageArray = Object.entries(packages).map(([id, pkg]) => ({
            ...pkg,
            id,
        }));
        if (packageArray.length > 0) {
            await this.packageModel.insertMany(packageArray);
        }
        return this.findAll();
    }
    async seed(packages) {
        const count = await this.packageModel.countDocuments().exec();
        if (count === 0) {
            await this.bulkUpdate(packages);
        }
    }
};
exports.PackagesService = PackagesService;
exports.PackagesService = PackagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(package_schema_1.Package.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PackagesService);
//# sourceMappingURL=packages.service.js.map