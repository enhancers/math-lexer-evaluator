// @ts-nocheck

import {
  ADDITION,
  Associativity,
  ASSOCIATIVITY_LEFT,
  BRACKET_LEFT,
  BRACKET_RIGHT,
  DIVISION,
  MULTIPLICATION,
  Operator,
  SUBTRACTION,
} from './operators';

type Rules = {
  [key in Operator]: {
    precedence: number;
    associativity: Associativity;
  };
};

const Rules: Rules = {
  [ADDITION]: {
    precedence: 1,
    associativity: ASSOCIATIVITY_LEFT,
  },
  [SUBTRACTION]: {
    precedence: 1,
    associativity: ASSOCIATIVITY_LEFT,
  },
  [MULTIPLICATION]: {
    precedence: 2,
    associativity: ASSOCIATIVITY_LEFT,
  },
  [DIVISION]: {
    precedence: 2,
    associativity: ASSOCIATIVITY_LEFT,
  },
  [BRACKET_LEFT]: {
    precedence: 1,
    associativity: ASSOCIATIVITY_LEFT,
  },
  [BRACKET_RIGHT]: {
    precedence: 1,
    associativity: ASSOCIATIVITY_LEFT,
  },
};

function removeSpaces(input: string): string {
  return input.replace(/\s/g, '');
}

function isNumber(input: string): boolean {
  return Number.isInteger(Number.parseInt(input));
}

function isNaN(input: number): boolean {
  return Number.isNaN(input);
}

function peek(index: number, input: Array<string>): string {
  return input[index + 1];
}

export function lex(input: string, cb: (token: string) => number): [] {
  input = removeSpaces(input);

  const variables = input.match(/#?([A-Za-z]?)+[0-9]?[a-zA-Z]+[0-9]?/g);

  let operators: Operator[] = [];
  let tokens = [];
  let numberBuffer = [];
  let index = 0;

  if (variables && variables.length) {
    for (let i = 0; i < variables.length; i++) {
      const variable = variables[i];
      const number = cb(variable);

      if (!isNumber(number) || isNaN(number)) {
        throw new RangeError('Value is NaN');
      }

      input = input.replace(variable, number);
    }
  }

  while (index < input.length) {
    const token = input[index];
    console.log('[token]', token);

    // there is a minus sign at the first index
    // or the token is a minus sign and the previous token i an operator or a left bracket
    if (
      token === SUBTRACTION &&
      (index === 0 ||
        [
          ADDITION,
          SUBTRACTION,
          MULTIPLICATION,
          DIVISION,
          BRACKET_LEFT,
        ].includes(input[index - 1]))
    ) {
      numberBuffer = [token];
      index += 1;
      continue;
    }

    // If the token is a number
    if (isNumber(token) || token === '.') {
      numberBuffer.push(token);

      const peeked = peek(index, input);

      if (!isNumber(peeked) && peeked !== '.') {
        tokens.push(Number.parseFloat(numberBuffer.join('')));
        console.log('push number to tokens', numberBuffer, tokens);
        numberBuffer = [];
      }
    }

    // if the token is an operator push it onto the operators stack
    if (
      Object.keys(Rules).includes(token) &&
      token !== BRACKET_LEFT &&
      token !== BRACKET_RIGHT
    ) {
      while (
        // there is an operator at the top of the operator stack
        operators.length &&
        // the operator at the top of the operator stack has greater precedence
        (Rules[operators[operators.length - 1]].precedence >
          Rules[token].precedence ||
          // the operator at the top of the operator stack has equal precedence and the token is left associative
          (Rules[operators[operators.length - 1]].precedence ===
            Rules[token].precedence &&
            Rules[token].associativity === 'left')) &&
        // the operator at the top of the operator stack is not a left parenthesis
        operators[operators.length - 1] !== BRACKET_LEFT
      ) {
        tokens.push(operators.pop());
      }

      operators.push(token);
    }

    // if the token is a left parenthesis
    if (token === BRACKET_LEFT) {
      // push into operators stack
      operators.push(token);
    }

    // if the token is a right parenthesis
    if (token === BRACKET_RIGHT) {
      while (operators.length) {
        const operator = operators.pop();

        // if the stack runs out without finding a left parenthesis, then there are mismatched parentheses.
        if (operators.length === 0 && operator !== BRACKET_LEFT) {
          throw new SyntaxError('Mismatched parentheses');
        }

        if (operator === BRACKET_LEFT) {
          break;
        }

        tokens.push(operator);
      }
    }

    index += 1;
  }

  // if operator stack not null, pop everything to output queue
  while (operators.length) {
    const operator = operators.pop();

    // if the operator token on the top of the stack is a parenthesis, then there are mismatched parentheses.
    if (!!operator && [BRACKET_LEFT, BRACKET_RIGHT].includes(operator)) {
      throw new SyntaxError('Mismatched parentheses');
    }

    // pop the operator from the operator stack onto the output queue.
    tokens.push(operator);
  }

  return tokens;
}

export function evaluate(tokens: (Operator | number)[]): Number {
  let stack = [];

  for (let i = 0; i < tokens.length; i++) {
    if (!isNaN(tokens[i]) && isFinite(tokens[i])) {
      stack.push(tokens[i]);
    } else {
      let a = stack.pop();
      let b = stack.pop();

      switch (tokens[i]) {
        case ADDITION:
          stack.push(parseFloat(a) + parseFloat(b));
          break;
        case SUBTRACTION:
          stack.push(parseFloat(b) - parseFloat(a));
          break;
        case MULTIPLICATION:
          stack.push(parseFloat(a) * parseFloat(b));
          break;
        case DIVISION:
          stack.push(parseFloat(b) / parseFloat(a));
          break;
      }
    }
  }

  console.log('stack', stack);
  if (stack.length > 1 || typeof stack[0] !== 'number') {
    throw new Error('Parsing error!');
  } else {
    return stack[0];
  }
}
