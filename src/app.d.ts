declare global {
	namespace App {
		interface Locals {
			user: {
				id: string;
				fullName: string;
				role: 'parent' | 'therapist' | 'psychologist' | 'admin';
			} | null;
			guestToken: string | null;
		}
	}
}

export {};
