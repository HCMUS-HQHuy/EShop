import cron from 'node-cron';
import prisma from 'src/models/prismaClient';

async function startRemoveTokenJob() {
    cron.schedule('*/10 * * * *', async () => {
        try {
            const tokens = await prisma.tokens.deleteMany({
                where: {
                    expiresAt: {
                        lt: new Date()
                    }
                }
            });
            console.log("Removed expired tokens", tokens.count);
        } catch (error) {
            console.error("Error removing expired tokens:", error);
        }
    });
}

async function startRemoveMessageJob() {
    cron.schedule('*/10 * * * *', async () => {
        try {
            const response = await prisma.messages.deleteMany({
                where: {
                    sentAt: {
                        lt: new Date(Date.now() - 10 * 60 * 1000) // 10 phut
                    }
                }
            });
            console.log(`Removed ${response.count} expired messages`);
        } catch (error) {
            console.error("Error removing expired messages:", error);
        }
    });
}

async function startAllCronJobs() {
    await startRemoveTokenJob();
    await startRemoveMessageJob();
}

const cronJobs = {
    startAll: startAllCronJobs
}

export default cronJobs;