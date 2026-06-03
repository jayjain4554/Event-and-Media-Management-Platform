"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("./adminController");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const roleMiddleware_1 = require("../../middleware/roleMiddleware");
const router = (0, express_1.Router)();
// Protected: Restricted solely to Admin users
router.get('/metrics', authMiddleware_1.protect, (0, roleMiddleware_1.restrictTo)('Admin'), adminController_1.getDashboardMetrics);
exports.default = router;
