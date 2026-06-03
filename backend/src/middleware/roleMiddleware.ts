import { Response, NextFunction } from 'express';
import { AppError } from '../shared/errors';
import { AuthenticatedRequest } from '../shared/types';
import { UserRole } from '../modules/user/userModel';

export const restrictTo = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication context is missing.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }

    next();
  };
};
