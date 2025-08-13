import auth from "middlewares/auth.middlewares";
import switchRole from "middlewares/switchRole.middlewares";
import addSocketIO from "middlewares/socket.middlewares";
const mid = {
    auth,
    switchRole,
    addSocketIO
};

export default mid;