import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import { User, UserDocument } from './schemas/user.schema';

export interface GoogleUserPayload {
    email: string;
    name: string;
    picture?: string;
    sub: string; // Google ID
}

export interface JwtPayload {
    sub: string;
    email: string;
    name: string;
    role: string;
}

@Injectable()
export class AuthService {
    private googleClient: OAuth2Client;

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {
        const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
        const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');

        console.log('AuthService initialized with:', {
            clientId: clientId ? 'set' : 'undefined',
            clientSecret: clientSecret ? 'set' : 'undefined',
        });

        this.googleClient = new OAuth2Client(
            clientId,
            clientSecret,
            'postmessage',
        );
    }

    // Admin authentication (existing)
    async validateAdmin(username: string, password: string): Promise<boolean> {
        const adminUsername = this.configService.get<string>('ADMIN_USERNAME') || 'admin';
        const adminPassword = this.configService.get<string>('ADMIN_PASSWORD') || 'menescape';
        return username === adminUsername && password === adminPassword;
    }

    async login(username: string): Promise<{ access_token: string }> {
        const payload = { username, sub: 'admin', role: 'admin' };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    verifyToken(token: string): JwtPayload | null {
        try {
            return this.jwtService.verify<JwtPayload>(token);
        } catch {
            return null;
        }
    }

    // Helper to find or create user
    async findOrCreateUser(googleUser: GoogleUserPayload): Promise<UserDocument> {
        let user = await this.userModel.findOne({ googleId: googleUser.sub }).exec();

        if (!user) {
            // Check if user exists by email (merge accounts)
            user = await this.userModel.findOne({ email: googleUser.email }).exec();

            if (user) {
                // Update existing user with Google ID
                user.googleId = googleUser.sub;
                user.picture = googleUser.picture;
                await user.save();
            } else {
                // Create new user
                user = await this.userModel.create({
                    email: googleUser.email,
                    name: googleUser.name,
                    picture: googleUser.picture,
                    googleId: googleUser.sub,
                    role: 'user',
                });
            }
        } else {
            // Update user info from Google
            user.name = googleUser.name;
            user.picture = googleUser.picture;
            await user.save();
        }

        return user;
    }

    // Google OAuth via Authorization Code
    async googleLogin(code: string): Promise<{ access_token: string; user: any } | null> {
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
                audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
            });
            const payload = ticket.getPayload();

            if (!payload) return null;

            const googleUser: GoogleUserPayload = {
                email: payload.email!,
                name: payload.name || payload.email!,
                picture: payload.picture,
                sub: payload.sub,
            };

            const user = await this.findOrCreateUser(googleUser);

            const jwtPayload: JwtPayload = {
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
        } catch (error) {
            console.error('Google login error:', error);
            return null;
        }
    }

    async getUserById(userId: string): Promise<UserDocument | null> {
        return this.userModel.findById(userId).exec();
    }
}
