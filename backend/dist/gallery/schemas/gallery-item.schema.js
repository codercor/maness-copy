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
exports.GalleryItemSchema = exports.GalleryItem = exports.GalleryTranslationsSchema = exports.GalleryTranslations = exports.GalleryTranslatedContentSchema = exports.GalleryTranslatedContent = exports.DEFAULT_LANGUAGE = exports.SUPPORTED_LANGUAGES = void 0;
exports.getGalleryTranslatedContent = getGalleryTranslatedContent;
const mongoose_1 = require("@nestjs/mongoose");
exports.SUPPORTED_LANGUAGES = ['en', 'de', 'el'];
exports.DEFAULT_LANGUAGE = 'en';
let GalleryTranslatedContent = class GalleryTranslatedContent {
    title;
    description;
    quickLook;
};
exports.GalleryTranslatedContent = GalleryTranslatedContent;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], GalleryTranslatedContent.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], GalleryTranslatedContent.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], GalleryTranslatedContent.prototype, "quickLook", void 0);
exports.GalleryTranslatedContent = GalleryTranslatedContent = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], GalleryTranslatedContent);
exports.GalleryTranslatedContentSchema = mongoose_1.SchemaFactory.createForClass(GalleryTranslatedContent);
let GalleryTranslations = class GalleryTranslations {
    en;
    de;
    el;
};
exports.GalleryTranslations = GalleryTranslations;
__decorate([
    (0, mongoose_1.Prop)({ type: exports.GalleryTranslatedContentSchema, required: true }),
    __metadata("design:type", GalleryTranslatedContent)
], GalleryTranslations.prototype, "en", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.GalleryTranslatedContentSchema }),
    __metadata("design:type", GalleryTranslatedContent)
], GalleryTranslations.prototype, "de", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.GalleryTranslatedContentSchema }),
    __metadata("design:type", GalleryTranslatedContent)
], GalleryTranslations.prototype, "el", void 0);
exports.GalleryTranslations = GalleryTranslations = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], GalleryTranslations);
exports.GalleryTranslationsSchema = mongoose_1.SchemaFactory.createForClass(GalleryTranslations);
let GalleryItem = class GalleryItem {
    translations;
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
    (0, mongoose_1.Prop)({ type: exports.GalleryTranslationsSchema }),
    __metadata("design:type", GalleryTranslations)
], GalleryItem.prototype, "translations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], GalleryItem.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
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
    (0, mongoose_1.Prop)({ required: false }),
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
function getGalleryTranslatedContent(item, language = 'en') {
    if (item.translations) {
        const content = item.translations[language] || item.translations.en;
        if (content) {
            return {
                title: content.title,
                description: content.description || '',
                quickLook: content.quickLook || '',
            };
        }
    }
    return {
        title: item.title || '',
        description: item.description || '',
        quickLook: item.quickLook || '',
    };
}
//# sourceMappingURL=gallery-item.schema.js.map