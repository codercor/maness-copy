import { Controller, Get, UseGuards, UnauthorizedException, Headers } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) { }

    @Get()
    async findAll(@Headers('authorization') authHeader: string) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('No authorization header');
        }

        const token = authHeader.slice(7);
        const payload = this.authService.verifyToken(token);

        if (!payload || payload.role !== 'admin') {
            throw new UnauthorizedException('Admin access required');
        }

        return this.usersService.findAll();
    }
}
