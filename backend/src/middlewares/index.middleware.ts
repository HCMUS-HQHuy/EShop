import auth from "./auth.middleware";
import switchRole from "./switchRole.middleware";

const mid = {
    auth,
    switchRole
};
export default mid;