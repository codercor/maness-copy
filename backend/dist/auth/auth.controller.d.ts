import { AuthService } from './auth.service';
declare class LoginDto {
    username: string;
    password: string;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    verify(authHeader: string): Promise<{
        valid: boolean;
        username: any;
    }>;
}
export {};
