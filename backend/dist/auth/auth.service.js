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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const google_auth_library_1 = require("google-auth-library");
const user_schema_1 = require("./schemas/user.schema");
let AuthService = class AuthService {
    jwtService;
    configService;
    userModel;
    googleClient;
    constructor(jwtService, configService, userModel) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.userModel = userModel;
        const clientId = this.configService.get('GOOGLE_CLIENT_ID');
        const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
        console.log('AuthService initialized with:', {
            clientId: clientId ? 'set' : 'undefined',
            clientSecret: clientSecret ? 'set' : 'undefined',
        });
        this.googleClient = new google_auth_library_1.OAuth2Client(clientId, clientSecret, 'postmessage');
    }
    async validateAdmin(username, password) {
        const user = await this.userModel.findOne({ email: username }).exec();
        if (!user || user.role !== 'admin') {
            return false;
        }
        if (user.password) {
            const bcrypt = require('bcryptjs');
            return bcrypt.compare(password, user.password);
        }
        return false;
    }
    async changePassword(userId, newPass) {
        const user = await this.userModel.findById(userId).exec();
        if (!user)
            return false;
        const bcrypt = require('bcryptjs');
        const hashed = await bcrypt.hash(newPass, 10);
        user.password = hashed;
        await user.save();
        return true;
    }
    async login(user) {
        let payload;
        if (typeof user === 'string') {
            const adminUser = await this.userModel.findOne({ email: user }).exec();
            if (!adminUser)
                throw new Error('User not found');
            payload = {
                sub: adminUser._id.toString(),
                email: adminUser.email,
                name: adminUser.name,
                role: adminUser.role
            };
        }
        else {
            payload = {
                sub: user._id?.toString() || user.sub || 'admin',
                email: user.email || user.username,
                name: user.name || 'Admin',
                role: user.role || 'admin'
            };
        }
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: payload.sub,
                email: payload.email,
                name: payload.name,
                role: payload.role
            }
        };
    }
    verifyToken(token) {
        try {
            return this.jwtService.verify(token);
        }
        catch {
            return null;
        }
    }
    async findOrCreateUser(googleUser) {
        let user = await this.userModel.findOne({ googleId: googleUser.sub }).exec();
        if (!user) {
            user = await this.userModel.findOne({ email: googleUser.email }).exec();
            if (user) {
                user.googleId = googleUser.sub;
                user.picture = googleUser.picture;
                await user.save();
            }
            else {
                user = await this.userModel.create({
                    email: googleUser.email,
                    name: googleUser.name,
                    picture: googleUser.picture,
                    googleId: googleUser.sub,
                    role: 'user',
                });
            }
        }
        else {
            user.name = googleUser.name;
            user.picture = googleUser.picture;
            await user.save();
        }
        return user;
    }
    async googleLogin(code) {
        try {
            console.log('Exchanging code for tokens:', code ? 'Code received' : 'No code');
            const { tokens } = await this.googleClient.getToken(code);
            const idToken = tokens.id_token;
            if (!idToken) {
                console.error('No ID token received from Google');
                return null;
            }
            const ticket = await this.googleClient.verifyIdToken({
                idToken,
                audience: this.configService.get('GOOGLE_CLIENT_ID'),
            });
            const payload = ticket.getPayload();
            if (!payload)
                return null;
            const googleUser = {
                email: payload.email,
                name: payload.name || payload.email,
                picture: payload.picture,
                sub: payload.sub,
            };
            const user = await this.findOrCreateUser(googleUser);
            const jwtPayload = {
                sub: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
            };
            return {
                access_token: this.jwtService.sign(jwtPayload),
                user: {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    picture: user.picture,
                    role: user.role,
                },
            };
        }
        catch (error) {
            console.error('Google login error:', error);
            return null;
        }
    }
    async getUserById(userId) {
        return this.userModel.findById(userId).exec();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        mongoose_2.Model])
], AuthService);
//# sourceMappingURL=auth.service.js.map