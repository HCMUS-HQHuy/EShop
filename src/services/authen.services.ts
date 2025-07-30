import jwt from "jsonwebtoken";

export function authenticate(username: string, password: string) {
    console.log(`Login attempt with username: ${username} and password: ${password}`);
    const token = jwt.sign({ username }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
    return token;
}
