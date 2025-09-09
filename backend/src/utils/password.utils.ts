import { hashSync, compareSync } from "bcrypt-ts";

export function hashPassword(password: string): string {
    const saltRounds = 10;
    return hashSync(password, saltRounds);
}

export function comparePasswords(password: string, hashedPassword: string): boolean {
    return compareSync(password, hashedPassword);
}

const password = {
    hash: hashPassword,
    compare: comparePasswords
}
export default password;