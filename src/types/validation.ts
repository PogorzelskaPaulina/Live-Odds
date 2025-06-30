export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ValidationRule<T = unknown> {
  test: (value: T) => boolean;
  message: string;
}

export interface ValidationRuleWithContext<T = unknown, C = unknown> {
  test: (value: T, context: C) => boolean;
  message: (value: T) => string;
}
