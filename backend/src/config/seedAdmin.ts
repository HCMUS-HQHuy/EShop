import { env } from 'process';

import prisma from 'src/models/prismaClient';
import { USER_ROLE } from '@prisma/client';
import util from 'src/utils/index.utils';

export default async function seedAdmin() {
    try {
        const cnt = await prisma.users.count({
            where: {
                role: USER_ROLE.ADMIN
            }
        });
        if (cnt > 0) {
            console.log('Log: Admin user already exists. Skipping...');
            return;
        }
        await prisma.users.create({
            data: {
                username: env.DB_ADMIN_USERNAME as string,
                password: util.password.hash(env.DB_ADMIN_PASSWORD as string),
                email: env.DB_ADMIN_EMAIL as string,
                role: USER_ROLE.ADMIN,
                isVerified: true
            }
        })
        console.log('Admin user created successfully.');
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
}
