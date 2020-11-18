export const ADDITION = '+';
export const SUBTRACTION = '-';
export const MULTIPLICATION = '*';
export const DIVISION = '/';
export const BRACKET_LEFT = '(';
export const BRACKET_RIGHT = ')';

export type Operator =
  | typeof ADDITION
  | typeof SUBTRACTION
  | typeof MULTIPLICATION
  | typeof DIVISION
  | typeof BRACKET_LEFT
  | typeof BRACKET_RIGHT;

export const ASSOCIATIVITY_LEFT = 'left';
export const ASSOCIATIVITY_RIGHT = 'right';

export type Associativity =
  | typeof ASSOCIATIVITY_LEFT
  | typeof ASSOCIATIVITY_RIGHT;
