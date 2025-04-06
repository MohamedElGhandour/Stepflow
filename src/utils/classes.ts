/**
 * Builds a space-separated class string from the provided values.
 * Ignores any falsy values like false, null, or undefined.
 *
 * @param classes - A list of class names, some of which may be falsy.
 * @returns A final string of valid class names.
 */
export function classes(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
