export function mask<T>(value: T): T {
  // Handle null and undefined
  if (value === null || value === undefined) {
    return value;
  }

  // Handle boolean
  if (typeof value === "boolean") {
    return false as T;
  }

  // Handle number
  if (typeof value === "number") {
    return 0 as T;
  }

  // Handle string
  if (typeof value === "string") {
    if (value.length === 0) return value as T;
    if (value.length === 1) return "*" as T;

    // Mask all but first and last character
    const firstChar = value[0];
    const lastChar = value[value.length - 1];
    const maskedMiddle = "*".repeat(value.length - 2);

    return `${firstChar}${maskedMiddle}${lastChar}` as T;
  }

  // Handle array
  if (Array.isArray(value)) {
    return value.map((item) => mask(item)) as T;
  }

  // Handle object
  if (typeof value === "object") {
    const maskedObj: Record<string, unknown> = {};

    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        maskedObj[key] = mask((value as Record<string, unknown>)[key]);
      }
    }

    return maskedObj as T;
  }

  // Handle other types (functions, symbols, etc.)
  return value;
}
