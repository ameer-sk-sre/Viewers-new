function preserve(query, current, key) {
  if (current && typeof current.get === 'function') {
    const value = current.get(key);
    if (value) {
      query.append(key, value);
    }
  }
}

export const preserveKeys = ['configUrl', 'multimonitor', 'screenNumber', 'hangingProtocolId'];

export function preserveQueryParameters(
  query,
  current = new URLSearchParams(window.location.search)
) {
  const searchParams = typeof current?.get === 'function' ? current : new URLSearchParams(window.location.search);
  for (const key of preserveKeys) {
    preserve(query, searchParams, key);
  }
}

export function preserveQueryStrings(query, current = new URLSearchParams(window.location.search)) {
  const searchParams = typeof current?.get === 'function' ? current : new URLSearchParams(window.location.search);
  for (const key of preserveKeys) {
    const value = searchParams.get(key);
    if (value) {
      query[key] = value;
    }
  }
}
