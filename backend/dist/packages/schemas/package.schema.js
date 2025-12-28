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
exports.PackageSchema = exports.Package = exports.DestinationInfo = exports.ItineraryDay = exports.ItineraryDayTranslationsSchema = exports.ItineraryDayTranslations = exports.ItineraryDayContentSchema = exports.ItineraryDayContent = exports.Partner = exports.PackageTranslationsSchema = exports.PackageTranslations = exports.TranslatedContentSchema = exports.TranslatedContent = exports.DEFAULT_LANGUAGE = exports.SUPPORTED_LANGUAGES = void 0;
exports.getTranslatedContent = getTranslatedContent;
const mongoose_1 = require("@nestjs/mongoose");
exports.SUPPORTED_LANGUAGES = ['en', 'de', 'el'];
exports.DEFAULT_LANGUAGE = 'en';
let TranslatedContent = class TranslatedContent {
    title;
    description;
    quickLook;
};
exports.TranslatedContent = TranslatedContent;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TranslatedContent.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], TranslatedContent.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], TranslatedContent.prototype, "quickLook", void 0);
exports.TranslatedContent = TranslatedContent = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], TranslatedContent);
exports.TranslatedContentSchema = mongoose_1.SchemaFactory.createForClass(TranslatedContent);
let PackageTranslations = class PackageTranslations {
    en;
    de;
    el;
};
exports.PackageTranslations = PackageTranslations;
__decorate([
    (0, mongoose_1.Prop)({ type: exports.TranslatedContentSchema, required: true }),
    __metadata("design:type", TranslatedContent)
], PackageTranslations.prototype, "en", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.TranslatedContentSchema }),
    __metadata("design:type", TranslatedContent)
], PackageTranslations.prototype, "de", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.TranslatedContentSchema }),
    __metadata("design:type", TranslatedContent)
], PackageTranslations.prototype, "el", void 0);
exports.PackageTranslations = PackageTranslations = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], PackageTranslations);
exports.PackageTranslationsSchema = mongoose_1.SchemaFactory.createForClass(PackageTranslations);
let Partner = class Partner {
    name;
    url;
};
exports.Partner = Partner;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Partner.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Partner.prototype, "url", void 0);
exports.Partner = Partner = __decorate([
    (0, mongoose_1.Schema)()
], Partner);
let ItineraryDayContent = class ItineraryDayContent {
    title;
    items;
};
exports.ItineraryDayContent = ItineraryDayContent;
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], ItineraryDayContent.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], ItineraryDayContent.prototype, "items", void 0);
exports.ItineraryDayContent = ItineraryDayContent = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ItineraryDayContent);
exports.ItineraryDayContentSchema = mongoose_1.SchemaFactory.createForClass(ItineraryDayContent);
let ItineraryDayTranslations = class ItineraryDayTranslations {
    en;
    de;
    el;
};
exports.ItineraryDayTranslations = ItineraryDayTranslations;
__decorate([
    (0, mongoose_1.Prop)({ type: exports.ItineraryDayContentSchema, required: true }),
    __metadata("design:type", ItineraryDayContent)
], ItineraryDayTranslations.prototype, "en", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.ItineraryDayContentSchema }),
    __metadata("design:type", ItineraryDayContent)
], ItineraryDayTranslations.prototype, "de", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.ItineraryDayContentSchema }),
    __metadata("design:type", ItineraryDayContent)
], ItineraryDayTranslations.prototype, "el", void 0);
exports.ItineraryDayTranslations = ItineraryDayTranslations = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ItineraryDayTranslations);
exports.ItineraryDayTranslationsSchema = mongoose_1.SchemaFactory.createForClass(ItineraryDayTranslations);
let ItineraryDay = class ItineraryDay {
    day;
    translations;
    title;
    items;
};
exports.ItineraryDay = ItineraryDay;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ItineraryDay.prototype, "day", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.ItineraryDayTranslationsSchema }),
    __metadata("design:type", ItineraryDayTranslations)
], ItineraryDay.prototype, "translations", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ItineraryDay.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], ItineraryDay.prototype, "items", void 0);
exports.ItineraryDay = ItineraryDay = __decorate([
    (0, mongoose_1.Schema)()
], ItineraryDay);
let DestinationInfo = class DestinationInfo {
    title;
    dates;
    price;
    image;
    quickLook;
};
exports.DestinationInfo = DestinationInfo;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DestinationInfo.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DestinationInfo.prototype, "dates", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DestinationInfo.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DestinationInfo.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DestinationInfo.prototype, "quickLook", void 0);
exports.DestinationInfo = DestinationInfo = __decorate([
    (0, mongoose_1.Schema)()
], DestinationInfo);
let Package = class Package {
    id;
    name;
    translations;
    dates;
    price;
    image;
    destinationId;
    destinationIds;
    includedServices;
    destination;
    departures;
    spots;
    partner;
    itinerary;
    showOnHomepage;
    isSelected;
};
exports.Package = Package;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Package.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Package.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.PackageTranslationsSchema }),
    __metadata("design:type", PackageTranslations)
], Package.prototype, "translations", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Package.prototype, "dates", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Package.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Package.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Package.prototype, "destinationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Package.prototype, "destinationIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Package.prototype, "includedServices", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: DestinationInfo }),
    __metadata("design:type", DestinationInfo)
], Package.prototype, "destination", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], required: true }),
    __metadata("design:type", Array)
], Package.prototype, "departures", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Package.prototype, "spots", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Partner, required: true }),
    __metadata("design:type", Partner)
], Package.prototype, "partner", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ItineraryDay], required: true }),
    __metadata("design:type", Array)
], Package.prototype, "itinerary", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Package.prototype, "showOnHomepage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Package.prototype, "isSelected", void 0);
exports.Package = Package = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Package);
exports.PackageSchema = mongoose_1.SchemaFactory.createForClass(Package);
function getTranslatedContent(pkg, language = 'en') {
    if (!pkg.translations) {
        if (pkg.destination) {
            return {
                title: pkg.destination.title,
                description: pkg.destination.quickLook,
                quickLook: pkg.destination.quickLook,
            };
        }
        return null;
    }
    const content = pkg.translations[language] || pkg.translations.en;
    return content || null;
}
//# sourceMappingURL=package.schema.js.map