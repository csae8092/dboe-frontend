import { writable } from 'svelte/store';

function createUserStore() {
	const { subscribe, set, update } = writable({
		username: '',
		usertoken: ''
	});

	return {
		subscribe,
		login: (username, token) => set({ username, usertoken: token }),
		logout: () => set({ username: '', usertoken: '' }),
		set
	};
}

export const user = createUserStore();
