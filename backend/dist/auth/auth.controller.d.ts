import { AuthService } from './auth.service';
declare class LoginDto {
    username: string;
    password: string;
}
declare class GoogleLoginDto {
    code: string;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    googleLogin(googleLoginDto: GoogleLoginDto): Promise<{
        access_token: string;
        user: any;
    }>;
    verify(authHeader: string): Promise<{
        valid: boolean;
        username: string;
        role: string;
        user?: undefined;
    } | {
        valid: boolean;
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
        };
        username?: undefined;
        role?: undefined;
    }>;
    getMe(authHeader: string): Promise<{
        id: string;
        email: string;
        name: string;
        picture: string | undefined;
        role: string;
    }>;
}
export {};
