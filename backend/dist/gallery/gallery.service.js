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
exports.GalleryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const gallery_item_schema_1 = require("./schemas/gallery-item.schema");
let GalleryService = class GalleryService {
    galleryModel;
    constructor(galleryModel) {
        this.galleryModel = galleryModel;
    }
    async findAll() {
        return this.galleryModel.find().exec();
    }
    async findOne(id) {
        const item = await this.galleryModel.findById(id).exec();
        if (!item) {
            throw new common_1.NotFoundException(`Gallery item with ID ${id} not found`);
        }
        return item;
    }
    async create(data) {
        const created = new this.galleryModel(data);
        return created.save();
    }
    async update(id, data) {
        const updated = await this.galleryModel.findByIdAndUpdate(id, data, { new: true }).exec();
        if (!updated) {
            throw new common_1.NotFoundException(`Gallery item with ID ${id} not found`);
        }
        return updated;
    }
    async delete(id) {
        const result = await this.galleryModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Gallery item with ID ${id} not found`);
        }
    }
    async seed(items) {
        const count = await this.galleryModel.countDocuments().exec();
        if (count === 0 && items.length > 0) {
            await this.galleryModel.insertMany(items);
        }
    }
};
exports.GalleryService = GalleryService;
exports.GalleryService = GalleryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(gallery_item_schema_1.GalleryItem.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], GalleryService);
//# sourceMappingURL=gallery.service.js.map