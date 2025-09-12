import express from "express";

import controller from "src/controllers/index.controllers";
import mid from "src/middlewares/index.middlewares";

const router: express.Router = express.Router();

// #### CHAT ROUTES ####
router.get("/conversations", mid.auth, controller.shared.chat.getConversations);
router.get("/conversation", mid.auth, controller.shared.chat.getConversationByInfor);
router.post("/conversation", mid.auth, controller.shared.chat.createConversation);
router.post("/messages", mid.auth, controller.shared.chat.sendMessage);

export default router;