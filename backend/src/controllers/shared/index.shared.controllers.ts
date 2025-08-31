import auth from './auth.shared.controllers';
import chat from './chat.shared.controllers';
import payment from './payment.shared.controllers';
import upload from './upload.shared.controllers';

const shared = {
    auth,
    chat, 
    payment,
    upload
};

export default shared;