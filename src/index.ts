import 'reflect-metadata'
import 'tsconfig-paths/register'
import dotenv from "dotenv";
import path from 'path'

dotenv.config({
    path: path.resolve(__dirname, `../${process.env.NODE_ENV}.env`),
});

import { loadSubscribers } from "@/events";
import '@/express'

loadSubscribers();

