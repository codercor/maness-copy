import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

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

    verifyToken(token: string): any {
        try {
            return this.jwtService.verify(token);
        } catch {
            return null;
        }
    }
}
