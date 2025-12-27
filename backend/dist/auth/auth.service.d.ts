import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
export interface GoogleUserPayload {
    email: string;
    name: string;
    picture?: string;
    sub: string;
}
export interface JwtPayload {
    sub: string;
    email: string;
    name: string;
    role: string;
}
export declare class AuthService {
    private jwtService;
    private configService;
    private userModel;
    private googleClient;
    constructor(jwtService: JwtService, configService: ConfigService, userModel: Model<UserDocument>);
    validateAdmin(username: string, password: string): Promise<boolean>;
    changePassword(userId: string, newPass: string): Promise<boolean>;
    login(user: any): Promise<{
        access_token: string;
        user: any;
    }>;
    verifyToken(token: string): JwtPayload | null;
    findOrCreateUser(googleUser: GoogleUserPayload): Promise<UserDocument>;
    googleLogin(code: string): Promise<{
        access_token: string;
        user: any;
    } | null>;
    getUserById(userId: string): Promise<UserDocument | null>;
}
