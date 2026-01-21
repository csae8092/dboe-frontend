import { env } from '$env/dynamic/public';

export const APP_NAME = 'DBOE-Editor';
export const API_BASE_URL = env.PUBLIC_API_BASE_URL || 'https://dboe-backend.acdh-dev.oeaw.ac.at/';
export const BELGE_BASE_URL = `${API_BASE_URL}api/belege-elastic-search/`;
export const SENSE_BASE_URL = `${API_BASE_URL}api/bedeutungen/`;
export const AUTH_URL = `${API_BASE_URL}api-token-auth/`;


export const ROUTE_MAPPER = {
    bedeutungen: SENSE_BASE_URL,
    kontexte: `${API_BASE_URL}api/kontexte/`,
    lautungen: `${API_BASE_URL}api/lautungen/`
}
