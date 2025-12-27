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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const class_validator_1 = require("class-validator");
class LoginDto {
    username;
    password;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class GoogleLoginDto {
    code;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GoogleLoginDto.prototype, "code", void 0);
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto) {
        const isValid = await this.authService.validateAdmin(loginDto.username, loginDto.password);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(loginDto.username);
    }
    async googleLogin(googleLoginDto) {
        const result = await this.authService.googleLogin(googleLoginDto.code);
        if (!result) {
            throw new common_1.UnauthorizedException('Google authentication failed');
        }
        return result;
    }
    async verify(authHeader) {
        if (!authHeader) {
            throw new common_1.UnauthorizedException('No authorization header');
        }
        if (authHeader.startsWith('Basic ')) {
            const base64Credentials = authHeader.slice(6);
            const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
            const [username, password] = credentials.split(':');
            const isValid = await this.authService.validateAdmin(username, password);
            if (!isValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            return { valid: true, username, role: 'admin' };
        }
        if (authHeader.startsWith('Bearer ')) {
            const token = authHeader.slice(7);
            const payload = this.authService.verifyToken(token);
            if (!payload) {
                throw new common_1.UnauthorizedException('Invalid token');
            }
            return {
                valid: true,
                user: {
                    id: payload.sub,
                    email: payload.email,
                    name: payload.name,
                    role: payload.role,
                }
            };
        }
        throw new common_1.UnauthorizedException('Invalid authorization format');
    }
    async getMe(authHeader) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('No valid authorization');
        }
        const token = authHeader.slice(7);
        const payload = this.authService.verifyToken(token);
        if (!payload) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        const user = await this.authService.getUserById(payload.sub);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            picture: user.picture,
            role: user.role,
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('google'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GoogleLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleLogin", null);
__decorate([
    (0, common_1.Get)('verify'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMe", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map