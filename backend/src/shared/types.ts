import { Request } from 'express';
import { IUser } from '../modules/user/userModel';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}
