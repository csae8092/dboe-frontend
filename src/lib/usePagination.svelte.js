import { browser } from '$app/environment';
import { page } from '$app/state';

/**
 * Composable for handling paginated data fetching in Svelte 5
 * @param {string} apiBaseUrl - The base URL for the API endpoint
 * @returns {Object} - Reactive state and utilities for pagination
 */
export function usePagination(apiBaseUrl) {
	let data = $state({ results: [], count: 0, next: null, previous: null });
	let loading = $state(true);
	let error = $state('');
	let pageSize = $state('10');
	
	const urlSearch = $derived(page.url.search);

	// Sync pageSize with URL
	$effect(() => {
		if (browser && urlSearch !== undefined) {
			pageSize = page.url.searchParams.get('page_size') || '10';
		}
	});

	// Fetch data when URL changes
	$effect(() => {
		if (browser && urlSearch !== undefined) {
			const pageNum = page.url.searchParams.get('page') || '1';
			const size = page.url.searchParams.get('page_size') || '10';
			fetchData(`${apiBaseUrl}?page=${pageNum}&page_size=${size}`);
		}
	});

	async function fetchData(url) {
		loading = true;
		error = '';
		try {
			const response = await fetch(url);
			if (!response.ok) throw new Error('Failed to fetch data');
			data = await response.json();
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	}

	return {
		get data() { return data; },
		set data(value) { data = value; },
		get loading() { return loading; },
		set loading(value) { loading = value; },
		get error() { return error; },
		set error(value) { error = value; },
		get pageSize() { return pageSize; },
		set pageSize(value) { pageSize = value; }
	};
}
