export function isNotNullOrEmpty<T extends string>(
  value: string | null | undefined,
): value is Exclude<T, null | undefined> {
  return value !== null && value !== undefined && value.trim().length > 0;
}
