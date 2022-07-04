/**
 * Get key by value in a map
 * @param map
 * @param searchValue
 */
export function getKeyByValue<T>(map: Map<string, T>, searchValue: T): string | undefined {
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of map.entries()) {
    if (value === searchValue) return key
  }
  return undefined
}
