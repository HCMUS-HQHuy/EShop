import express from "express";
import jwt from "jsonwebtoken";

export function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        if (err) {
            console.error("Token verification error:", err);
            return res.sendStatus(403);
        }
        (req as any).user = user;
        console.log("Authenticated user:", (req as any).user);
        next();
    });
}
