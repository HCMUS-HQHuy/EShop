import express from "express";
import jwt from "jsonwebtoken";

export default function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number; role: string };
        req.user = decoded;
        console.log(`Authenticated user: ${JSON.stringify(req.user)}`);
        next();
    } catch (error) {
        console.error(`Authentication error: ${error}`);
        return res.status(403).json({ message: 'Invalid Token.' });
    }
}
