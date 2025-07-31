import jwt from "jsonwebtoken";
import { getConnection } from "../config/db";

export async function authenticate(username: string, password: string) {
    const db = await getConnection();

    const query = "SELECT * FROM users WHERE username = $1 AND password = $2";
    const values = [username, password];

    const result = await db.query(query, values);
    if (result.rows.length === 0) {
        throw new Error("Invalid username or password");
    }
    if (result.rows.length > 1) {
        throw new Error("Multiple users found with the same username and password");
    }
    console.log("User authenticated successfully");
    const user = result.rows[0];
    const token = jwt.sign({ user_id: user.user_id, username: user.username, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "15m" });
    return token;
}
