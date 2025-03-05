/** @format */

import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool, Client } = pkg;
import * as schema from "./schema.js";
import "dotenv/config";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

// Create tables if they don't exist