import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
export declare class UsersController {
    private usersService;
    private authService;
    constructor(usersService: UsersService, authService: AuthService);
    findAll(authHeader: string): Promise<import("../auth/schemas/user.schema").User[]>;
}
