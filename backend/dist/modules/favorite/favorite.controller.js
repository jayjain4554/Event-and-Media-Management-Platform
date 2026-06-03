"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyFavorites = exports.toggleFavorite = void 0;
const favorite_service_1 = require("./favorite.service");
const errors_1 = require("../../shared/errors");
const toggleFavorite = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new errors_1.AppError('Authentication required.', 401));
        }
        const { mediaId } = req.body;
        if (!mediaId) {
            return next(new errors_1.AppError('Media ID is required.', 400));
        }
        const result = await favorite_service_1.favoriteService.toggleFavorite(mediaId, req.user._id.toString());
        res.status(200).json({
            status: 'success',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.toggleFavorite = toggleFavorite;
const getMyFavorites = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new errors_1.AppError('Authentication required.', 401));
        }
        const favorites = await favorite_service_1.favoriteService.getFavorites(req.user._id.toString());
        res.status(200).json({
            status: 'success',
            data: { favorites },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyFavorites = getMyFavorites;
