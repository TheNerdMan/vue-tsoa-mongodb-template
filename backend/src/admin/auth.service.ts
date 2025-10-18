import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { collections } from '../core/services/database.service';
import User from '../core/models/user';
import logger from "../core/logging/logger";

const SALT_ROUNDS = 10;

export const IN_USE_ERROR = "Email and/or username in use";
export const INSERT_FAILED = "Insert failed";

export async function login(email: string, password: string) {
    const foundUser = await collections.users?.findOne(<Partial<User>>{
        email: email
    });
    
    if (foundUser && foundUser.passwordHash) {
        const isValidPassword = bcrypt.compareSync(password, foundUser.passwordHash);
        if (isValidPassword) {
            return generateToken({ email, soups: foundUser.soups || [] });
        }
    }
    return null;
}

export async function signup(email: string, password: string): Promise<string | void> {
    const foundExistingUser = await collections.users?.findOne(<Partial<User>>{
        email: email
    });

    if (foundExistingUser)
        return Promise.reject(IN_USE_ERROR);

    const hash = bcrypt.hashSync(password, SALT_ROUNDS);
    const writeResult = await collections.users?.insertOne(<User>{
        email,
        passwordHash: hash
    });

    logger.info(`New user attempting sign up: (${email})`);

    if (!writeResult?.acknowledged)
        return Promise.reject(INSERT_FAILED);

    // possibly send "magic link" email to confirm email and login

    logger.info(`New user signed up: (${email})`);

    logger.debug(`Inserted user with id ${writeResult.insertedId}`);

    return Promise.resolve();
}

function generateToken(payload: object) {
    const JWT_SECRET = process.env.JWT_SECRET;
    if(JWT_SECRET === undefined) throw new Error(".env not set up");
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}