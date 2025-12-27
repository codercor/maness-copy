import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private jwtService;
    private configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    validateAdmin(username: string, password: string): Promise<boolean>;
    login(username: string): Promise<{
        access_token: string;
    }>;
    verifyToken(token: string): any;
}
