import { Controller, Post, Get, Body, Headers, UnauthorizedException, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsString, IsNotEmpty } from 'class-validator';

class LoginDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

class GoogleLoginDto {
    @IsString()
    @IsNotEmpty()
    code: string;
}

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    // Admin login (database backed)
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

        // We can optionally return the user object from validateAdmin if we refactor it,
        // but for now let's just use the known username (email) to generate the token.
        // It's safer to pass the actual user object, but `login` in service now handles string lookups too.
        return this.authService.login(loginDto.username);
    }

    @Post('change-password')
    @HttpCode(200)
    async changePassword(
        @Body() body: { oldPass: string; newPass: string },
        @Headers('authorization') authHeader: string
    ) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('No authorization header');
        }

        const token = authHeader.slice(7);
        const payload = this.authService.verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            throw new UnauthorizedException('Unauthorized');
        }

        const success = await this.authService.changePassword(payload.sub, body.newPass);
        if (!success) {
            throw new UnauthorizedException('Could not change password');
        }

        return { success: true };
    }

    // Google OAuth login (Authorization Code Flow)
    @Post('google')
    @HttpCode(200)
    async googleLogin(@Body() googleLoginDto: GoogleLoginDto) {
        const result = await this.authService.googleLogin(googleLoginDto.code);

        if (!result) {
            throw new UnauthorizedException('Google authentication failed');
        }

        return result;
    }

    // Verify token (existing + enhanced)
    @Get('verify')
    async verify(@Headers('authorization') authHeader: string) {
        if (!authHeader) {
            throw new UnauthorizedException('No authorization header');
        }

        // Handle Basic Auth (from admin frontend)
        if (authHeader.startsWith('Basic ')) {
            const base64Credentials = authHeader.slice(6);
            const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
            const [username, password] = credentials.split(':');

            const isValid = await this.authService.validateAdmin(username, password);
            if (!isValid) {
                throw new UnauthorizedException('Invalid credentials');
            }

            return { valid: true, username, role: 'admin' };
        }

        // Handle Bearer token (JWT from Google login)
        if (authHeader.startsWith('Bearer ')) {
            const token = authHeader.slice(7);
            const payload = this.authService.verifyToken(token);

            if (!payload) {
                throw new UnauthorizedException('Invalid token');
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

        throw new UnauthorizedException('Invalid authorization format');
    }

    // Get current user profile
    @Get('me')
    async getMe(@Headers('authorization') authHeader: string) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('No valid authorization');
        }

        const token = authHeader.slice(7);
        const payload = this.authService.verifyToken(token);

        if (!payload) {
            throw new UnauthorizedException('Invalid token');
        }

        const user = await this.authService.getUserById(payload.sub);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            picture: user.picture,
            role: user.role,
        };
    }
}
