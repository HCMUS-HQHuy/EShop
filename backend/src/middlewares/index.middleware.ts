import auth from "middlewares/auth.middleware";
import switchRole from "middlewares/switchRole.middleware";

const mid = {
    auth,
    switchRole
};
export default mid;