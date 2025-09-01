import express from "express";

import controller from "controllers/index.controllers";
import mid from "middlewares/index.middlewares";

const router: express.Router = express.Router();

// #### CHAT ROUTES ####
router.get("/conversations", mid.auth, controller.shared.chat.getConversations);
router.get("/conversation/:sellerId", mid.auth, controller.shared.chat.getConversation);
router.post("/messages", mid.auth, controller.shared.chat.sendMessage);

export default router;