// Sử dụng declare global để chắc chắn rằng nó được áp dụng ở mọi nơi
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        role: string;
      };
    }
  }
}

export {};