export function replaceSearch(currentUrl, newSearch) {
  const url = new URL(currentUrl);
  url.search = newSearch.startsWith("?") ? newSearch : `?${newSearch}`;
  return `${url.pathname}${url.search}`;
}