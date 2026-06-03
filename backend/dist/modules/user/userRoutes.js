"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("./userController");
const userSchema_1 = require("./userSchema");
const validationMiddleware_1 = require("../../middleware/validationMiddleware");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const uploadMiddleware_1 = require("../../middleware/uploadMiddleware");
const router = (0, express_1.Router)();
router.post('/signup', (0, validationMiddleware_1.validateRequest)(userSchema_1.signupSchema), userController_1.register);
router.post('/login', (0, validationMiddleware_1.validateRequest)(userSchema_1.loginSchema), userController_1.login);
// Authenticated protected routes
router.get('/me', authMiddleware_1.protect, userController_1.getMe);
router.get('/search', authMiddleware_1.protect, userController_1.searchUsers);
router.post('/selfie', authMiddleware_1.protect, uploadMiddleware_1.upload.single('selfie'), userController_1.uploadSelfie);
exports.default = router;
