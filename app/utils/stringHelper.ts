/**
 * Formats a given string to lowercase or uppercase based on the provided option.
 *
 * @param input - The string to be formatted.
 * @param toUpperCase - Optional boolean indicating if the string should be converted to uppercase. Default is false (lowercase).
 * @returns The formatted string in either lowercase or uppercase.
 */

export default function formatString(input: string, toUpperCase: boolean = false): string {
  return toUpperCase ? input.toUpperCase() : input.toLowerCase();
}
