import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('No authorization header');
        }

        // Handle Basic Auth
        if (authHeader.startsWith('Basic ')) {
            const base64Credentials = authHeader.slice(6);
            const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
            const [username, password] = credentials.split(':');

            const isValid = await this.authService.validateAdmin(username, password);
            if (!isValid) {
                throw new UnauthorizedException('Invalid credentials');
            }

            request.user = { username, role: 'admin' };
            return true;
        }

        // Handle Bearer token
        if (authHeader.startsWith('Bearer ')) {
            const token = authHeader.slice(7);
            const payload = this.authService.verifyToken(token);

            if (!payload) {
                throw new UnauthorizedException('Invalid token');
            }

            request.user = payload;
            return true;
        }

        throw new UnauthorizedException('Invalid authorization format');
    }
}
