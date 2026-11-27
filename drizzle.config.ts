import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/server/schema.ts',
	out: './drizzle',
	dialect: 'mysql',
	dbCredentials: {
		url: process.env.DATABASE_URL ?? 'mysql://harapanku_app:harapanku_app_secret@127.0.0.1:3306/harapanku'
	}
});
