"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favorite_controller_1 = require("./favorite.controller");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Protect all routes
router.use(authMiddleware_1.protect);
router.post('/toggle', favorite_controller_1.toggleFavorite);
router.get('/', favorite_controller_1.getMyFavorites);
exports.default = router;
