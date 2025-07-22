import { createClient } from "redis";
import 'dotenv/config';

const REDIS_PASS = process.env.REDIS_PASS;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = parseInt(process.env.REDIS_PORT);
const REDIS_DB = parseInt(process.env.REDIS_DB);

export const redisClient = await createClient({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASS,
    database: REDIS_DB
})
    .on("error", (err) => console.log("Redis Error:", err));