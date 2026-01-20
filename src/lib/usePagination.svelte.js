import { browser } from '$app/environment';
import { page } from '$app/state';

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
			// Parse the base URL to extract any existing query parameters
			const [baseUrl, existingQuery] = apiBaseUrl.split('?');
			const params = new URLSearchParams(existingQuery || '');
			
			// Merge with current page URL parameters
			for (const [key, value] of page.url.searchParams.entries()) {
				params.set(key, value);
			}
			
			// Ensure page and page_size have default values
			if (!params.has('page')) params.set('page', '1');
			if (!params.has('page_size')) params.set('page_size', '10');
			
			fetchData(`${baseUrl}?${params.toString()}`);
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
