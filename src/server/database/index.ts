import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { relations } from "~/server/database/relations";

const sqlite = new Database(process.env["DATABASE_FILE"]!);

export const database = drizzle({ client: sqlite, relations });
