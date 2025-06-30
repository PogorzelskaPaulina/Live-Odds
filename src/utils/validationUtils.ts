import type {
  ValidationRule,
  ValidationRuleWithContext,
  ValidationResult,
} from "../types";

export const validate = <T>(
  value: T,
  rules: ValidationRule<T>[]
): ValidationResult => {
  const errors = rules
    .filter((rule) => !rule.test(value))
    .map((rule) => rule.message);

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateWithContext = <T, C>(
  value: T,
  context: C,
  rules: ValidationRuleWithContext<T, C>[]
): ValidationResult => {
  const errors = rules
    .filter((rule) => !rule.test(value, context))
    .map((rule) => rule.message(value));

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const combineResults = (
  ...results: ValidationResult[]
): ValidationResult => {
  const allErrors = results.flatMap((result) => result.errors);
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
};
