import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    findAll(): Promise<User[]>;
}
