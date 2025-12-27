import { Controller, Post, Get, Body, Headers, UnauthorizedException, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';

class LoginDto {
    username: string;
    password: string;
}

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(200)
    async login(@Body() loginDto: LoginDto) {
        const isValid = await this.authService.validateAdmin(
            loginDto.username,
            loginDto.password,
        );

        if (!isValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.authService.login(loginDto.username);
    }

    @Get('verify')
    async verify(@Headers('authorization') authHeader: string) {
        if (!authHeader) {
            throw new UnauthorizedException('No authorization header');
        }

        // Handle Basic Auth (from existing frontend)
        if (authHeader.startsWith('Basic ')) {
            const base64Credentials = authHeader.slice(6);
            const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
            const [username, password] = credentials.split(':');

            const isValid = await this.authService.validateAdmin(username, password);
            if (!isValid) {
                throw new UnauthorizedException('Invalid credentials');
            }

            return { valid: true, username };
        }

        // Handle Bearer token
        if (authHeader.startsWith('Bearer ')) {
            const token = authHeader.slice(7);
            const payload = this.authService.verifyToken(token);

            if (!payload) {
                throw new UnauthorizedException('Invalid token');
            }

            return { valid: true, username: payload.username };
        }

        throw new UnauthorizedException('Invalid authorization format');
    }
}
