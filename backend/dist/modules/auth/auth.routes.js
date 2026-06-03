"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const validationMiddleware_1 = require("../../middleware/validationMiddleware");
const auth_middleware_1 = require("./auth.middleware");
const router = (0, express_1.Router)();
router.post('/register', (0, validationMiddleware_1.validateRequest)(auth_validation_1.registerSchema), auth_controller_1.register);
router.post('/login', (0, validationMiddleware_1.validateRequest)(auth_validation_1.loginSchema), auth_controller_1.login);
router.post('/refresh', (0, validationMiddleware_1.validateRequest)(auth_validation_1.refreshSchema), auth_controller_1.refresh);
router.post('/logout', auth_controller_1.logout);
// Authenticated protected routes
router.get('/me', auth_middleware_1.protect, auth_controller_1.getMe);
exports.default = router;
