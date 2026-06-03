import { Request } from 'express';
import { IUser } from '../user/userModel';

export interface TokenPayload {
  id: string;
  role: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  referenceSelfieUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}
