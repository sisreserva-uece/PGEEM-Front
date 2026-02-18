/**
 * Parses a date string (assumed to be UTC from backend) into a Date object
 * adjusted to the user's local timezone.
 *
 * If the string lacks timezone information, 'Z' is appended to force UTC interpretation.
 */
export function parseUtcToLocal(dateString: string): Date {
  if (!dateString) {
    return new Date();
  }
  const safeString = dateString.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(dateString)
    ? dateString
    : `${dateString}Z`;

  return new Date(safeString);
}
