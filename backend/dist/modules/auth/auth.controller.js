"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.refresh = exports.login = exports.register = void 0;
const auth_service_1 = require("./auth.service");
const errors_1 = require("../../shared/errors");
// Helper to set cookie
const setRefreshTokenCookie = (res, token) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};
// Helper to clear cookie
const clearRefreshTokenCookie = (res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
};
const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const result = await auth_service_1.authService.register(name, email, password, role);
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
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await auth_service_1.authService.login(email, password);
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
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const refresh = async (req, res, next) => {
    try {
        // Support retrieving token from request body, headers, or cookies
        const refreshTokenString = req.body.refreshToken ||
            req.cookies?.refreshToken ||
            req.headers['x-refresh-token'];
        if (!refreshTokenString) {
            return next(new errors_1.AppError('Refresh token is required.', 400));
        }
        const result = await auth_service_1.authService.refresh(refreshTokenString);
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
    }
    catch (error) {
        next(error);
    }
};
exports.refresh = refresh;
const logout = async (req, res, next) => {
    try {
        const refreshTokenString = req.body.refreshToken ||
            req.cookies?.refreshToken ||
            req.headers['x-refresh-token'];
        if (refreshTokenString) {
            await auth_service_1.authService.logout(refreshTokenString);
        }
        clearRefreshTokenCookie(res);
        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully.',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
const getMe = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new errors_1.AppError('No authenticated user context found.', 401));
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
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
