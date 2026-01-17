import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const USER_STORAGE_KEY = 'dboe_user';

// Load initial state from localStorage if in browser
const initialUser = browser && localStorage.getItem(USER_STORAGE_KEY)
	? JSON.parse(localStorage.getItem(USER_STORAGE_KEY))
	: { username: '', usertoken: '' };

function createUserStore() {
	const { subscribe, set, update } = writable(initialUser);

	return {
		subscribe,
		login: (username, token) => {
			const userData = { username, usertoken: token };
			set(userData);
			if (browser) {
				localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
			}
		},
		logout: () => {
			set({ username: '', usertoken: '' });
			if (browser) {
				localStorage.removeItem(USER_STORAGE_KEY);
			}
		},
		set
	};
}

export const user = createUserStore();
