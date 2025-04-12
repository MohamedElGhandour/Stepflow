/**
 * Checks if the provided value is a plain object.
 */
function isObject<T extends object = object>(item: unknown): item is T {
  return typeof item === "object" && item !== null && !Array.isArray(item);
}

/**
 * Deeply merges one or more source objects into a target object.
 * Undefined values in the sources are skipped, preserving the target's values.
 *
 * @param target - The target object to merge into.
 * @param sources - One or more source objects.
 * @returns The merged target object.
 */
export function merge<T extends object>(target: T, ...sources: Partial<T>[]): T {
  for (const source of sources) {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key];
        if (sourceValue === undefined) continue;

        const targetValue = target[key];
        if (isObject(sourceValue) && isObject(targetValue)) {
          target[key] = merge(targetValue, sourceValue) as T[typeof key];
        } else {
          target[key] = sourceValue as T[typeof key];
        }
      }
    }
  }
  return target;
}
