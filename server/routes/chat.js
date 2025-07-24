import { generate } from "generate-passphrase";

import { redisClient } from "../controllers/redis.js";
import { newChatroom } from "../state.js";

const generatorOptions = {
    numbers: false
};

export async function createChat(req, res) {
    let chatCode = generate(generatorOptions);

    while ((await redisClient.get(chatCode)) !== null) {
        chatCode = generate(generatorOptions);
    }

    await redisClient.set(chatCode, 1, {
        EX: 600
    });

    newChatroom(chatCode);

    await res.send({'success': true, 'code': chatCode});
}