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
exports.PackageSchema = exports.Package = exports.ItineraryDay = exports.Partner = exports.DestinationInfo = void 0;
const mongoose_1 = require("@nestjs/mongoose");
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
let ItineraryDay = class ItineraryDay {
    day;
    title;
    items;
};
exports.ItineraryDay = ItineraryDay;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ItineraryDay.prototype, "day", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ItineraryDay.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], required: true }),
    __metadata("design:type", Array)
], ItineraryDay.prototype, "items", void 0);
exports.ItineraryDay = ItineraryDay = __decorate([
    (0, mongoose_1.Schema)()
], ItineraryDay);
let Package = class Package {
    id;
    name;
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
    (0, mongoose_1.Prop)({ type: DestinationInfo, required: true }),
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
//# sourceMappingURL=package.schema.js.map