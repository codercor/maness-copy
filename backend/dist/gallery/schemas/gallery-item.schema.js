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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryItemSchema = exports.GalleryItem = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let GalleryItem = class GalleryItem {
    title;
    description;
    duration;
    image;
    quickLook;
    featured;
    price;
    packageId;
};
exports.GalleryItem = GalleryItem;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], GalleryItem.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], GalleryItem.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], GalleryItem.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], GalleryItem.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], GalleryItem.prototype, "quickLook", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], GalleryItem.prototype, "featured", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], GalleryItem.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], GalleryItem.prototype, "packageId", void 0);
exports.GalleryItem = GalleryItem = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], GalleryItem);
exports.GalleryItemSchema = mongoose_1.SchemaFactory.createForClass(GalleryItem);
//# sourceMappingURL=gallery-item.schema.js.map