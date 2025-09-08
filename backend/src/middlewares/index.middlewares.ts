import auth from "src/middlewares/auth.middlewares";
import upload from "./upload.middlewares";
import switchRole from "src/middlewares/switchRole.middlewares";
import addSocketIO from "src/middlewares/socket.middlewares";
const mid = {
    auth,
    switchRole,
    addSocketIO,
    upload
};

export default mid;