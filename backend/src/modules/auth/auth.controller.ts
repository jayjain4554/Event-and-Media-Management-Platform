import { Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { AuthenticatedRequest } from './auth.types';
import { AppError } from '../../shared/errors';

// Helper to set cookie
const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Helper to clear cookie
const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

export const register = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;

    const result = await authService.register(name, email, password, role);

    if (result.refreshToken) {
      setRefreshTokenCookie(res, result.refreshToken);
    }

    res.status(201).json({
      status: 'success',
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken, // Included for non-cookie web/mobile clients
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    if (result.refreshToken) {
      setRefreshTokenCookie(res, result.refreshToken);
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Support retrieving token from request body, headers, or cookies
    const refreshTokenString = 
      req.body.refreshToken || 
      req.cookies?.refreshToken || 
      req.headers['x-refresh-token'] as string;

    if (!refreshTokenString) {
      return next(new AppError('Refresh token is required.', 400));
    }

    const result = await authService.refresh(refreshTokenString);

    if (result.refreshToken) {
      setRefreshTokenCookie(res, result.refreshToken);
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const refreshTokenString = 
      req.body.refreshToken || 
      req.cookies?.refreshToken || 
      req.headers['x-refresh-token'] as string;

    if (refreshTokenString) {
      await authService.logout(refreshTokenString);
    }

    clearRefreshTokenCookie(res);

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('No authenticated user context found.', 401));
    }

    const userResponse = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      referenceSelfieUrl: req.user.referenceSelfieUrl,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    };

    res.status(200).json({
      status: 'success',
      data: { user: userResponse },
    });
  } catch (error) {
    next(error);
  }
};
