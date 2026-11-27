import fs from 'node:fs';
import path from 'node:path';
import type { UserRole } from './auth';

export interface DevUser {
	id: string;
	fullName: string;
	phoneWa: string;
	passwordHash: string;
	role: UserRole;
}

export interface DevAppointment {
	id: string;
	parentName: string;
	parentWa: string;
	childAgeLabel: string;
	mainComplaint: string;
	scheduledAt: string | null;
	status: 'pending_wa' | 'confirmed' | 'completed' | 'cancelled';
	createdAt: string;
}

const STORE_PATH = path.resolve('.svelte-kit/dev-fallback-store.json');

interface StoreData {
	users: DevUser[];
	appointments: DevAppointment[];
}

function readStore(): StoreData {
	try {
		if (fs.existsSync(STORE_PATH)) {
			return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8')) as StoreData;
		}
	} catch {
		// ignore corrupt dev file
	}
	return { users: [], appointments: [] };
}

function writeStore(data: StoreData) {
	try {
		fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
		fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf8');
	} catch {
		// ignore write errors
	}
}

export function saveDevUser(user: DevUser) {
	const store = readStore();
	const idx = store.users.findIndex((u) => u.phoneWa === user.phoneWa);
	if (idx >= 0) {
		store.users[idx] = user;
	} else {
		store.users.push(user);
	}
	writeStore(store);
}

export function findDevUserByWa(phoneWa: string): DevUser | null {
	const store = readStore();
	return store.users.find((u) => u.phoneWa === phoneWa) ?? null;
}

export function saveDevAppointment(appt: DevAppointment) {
	const store = readStore();
	const idx = store.appointments.findIndex((a) => a.id === appt.id);
	if (idx >= 0) {
		store.appointments[idx] = appt;
	} else {
		store.appointments.unshift(appt);
	}
	writeStore(store);
}

export function getDevAppointments(): DevAppointment[] {
	return readStore().appointments;
}

export function updateDevAppointmentStatus(
	id: string,
	status: DevAppointment['status'],
	scheduledAt: string | null
) {
	const store = readStore();
	const item = store.appointments.find((a) => a.id === id);
	if (item) {
		item.status = status;
		item.scheduledAt = scheduledAt;
		writeStore(store);
	}
}
