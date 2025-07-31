// Sử dụng declare global để chắc chắn rằng nó được áp dụng ở mọi nơi
import role from './role.enum';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        role: role;
      };
    }
  }
}

export {};