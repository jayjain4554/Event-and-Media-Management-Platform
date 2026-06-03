"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aiController_1 = require("./aiController");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Protected: Retrieves media items where current user has been identified
router.get('/spotted', authMiddleware_1.protect, aiController_1.getMySpottedMedia);
exports.default = router;
