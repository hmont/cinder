import { redisClient } from "../controllers/redis.js";
import { newChatroom } from "../state.js";

const generatorOptions = {
    numbers: false
};

export async function createChat(req, res) {
    let chatCode = Math.random().toString(36).substring(2, 24);

    while ((await redisClient.get(chatCode)) !== null) {
        chatCode = Math.random().toString(36).substring(2, 24);
    }

    await redisClient.set(chatCode, 1, {
        EX: 600
    });

    newChatroom(chatCode);

    await res.send({'success': true, 'code': chatCode});
}