"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = require("./notificationController");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.protect); // Secure all notification subroutes
router.get('/', notificationController_1.getNotifications);
router.patch('/read', notificationController_1.markRead);
exports.default = router;
