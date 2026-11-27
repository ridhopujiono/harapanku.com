import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

const connectionString =
	env.DATABASE_URL ?? 'mysql://harapanku_app:harapanku_app_secret@127.0.0.1:3306/harapanku';

export const pool = mysql.createPool(connectionString);
export const db = drizzle(pool, { schema, mode: 'default' });
