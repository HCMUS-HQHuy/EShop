import express from "express";

import controller from "src/controllers/index.controllers";
import mid from "src/middlewares/index.middlewares";

const router: express.Router = express.Router();

// #### CHAT ROUTES ####
router.get("/conversations", mid.auth, controller.shared.chat.getConversations);
router.post("/conversation/get", mid.auth, controller.shared.chat.getConversation);
router.post("/conversation/create", mid.auth, controller.shared.chat.createConversation);
router.post("/messages", mid.auth, controller.shared.chat.sendMessage);

export default router;