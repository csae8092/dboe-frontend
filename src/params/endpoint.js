import { ROUTE_MAPPER } from '$lib/constants.js';

export function match(param) {
	return Object.keys(ROUTE_MAPPER).includes(param);
}
