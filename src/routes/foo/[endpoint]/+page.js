import { API_BASE_URL } from '$lib/constants.js';
import { replaceSearch } from '$lib/utils.js';

export async function load  ({ fetch, url, route, params }) {
    let query_string = new URLSearchParams(Object.fromEntries(url.searchParams));
    if (!query_string.has('page_size')) {
        query_string.set('page_size', '10');
    }
    const fetch_data_path = `${API_BASE_URL}api/${params.endpoint}`
    const fetch_data_url = `${fetch_data_path}${query_string ? '?' + query_string.toString() : ''}`
    const res = await fetch(fetch_data_url);
	const payload = await res.json();
    let next_page = null;
    if (payload.next !== null) {
        next_page = replaceSearch(url.href, new URL(payload.next).search)
    }
    let previous_page = null;
    if (payload.previous !== null) {
        previous_page = replaceSearch(url.href, new URL(payload.previous).search)
    }

    return {
        url: url,
        route: route.id,
        payload: payload,
        previous_page: previous_page,
        next_page: next_page
    }
}