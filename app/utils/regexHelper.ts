/**
 * Validates a given name string.
 * @param value - The name string to validate.
 * @returns `true` if the name is valid, `false` otherwise.
 */

export const nameValidation = (value: string): boolean => {
  // Regular expression to match only letters and spaces
  const regExp = /^[a-zA-Z\s]*$/;

  return regExp.test(value);
};
