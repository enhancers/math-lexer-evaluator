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

type NumberBuffer = number | string;

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

function isNumber(input: number | string): boolean {
  if (typeof input === 'string') {
    return Number.isInteger(Number.parseInt(input));
  }

  return Number.isInteger(input);
}

function isNaN(input: number): boolean {
  return Number.isNaN(input);
}

function peek(index: number, input: string): string {
  return input[index + 1];
}

export function lex(
  input: string,
  cb: (token: string) => number,
): (string | number)[] {
  input = removeSpaces(input);

  const variables = input.match(/#?([A-Za-z_]?)+[0-9]?[a-zA-Z_]+[0-9]?/g);

  let operators: Operator[] = [];
  let tokens: (Operator | number)[] = [];
  let numberBuffer: NumberBuffer[] = [];
  let index = 0;

  if (variables && variables.length) {
    for (let i = 0; i < variables.length; i++) {
      const variable = variables[i];
      const number = cb(variable);

      if (isNaN(number)) {
        throw new RangeError('Value is NaN');
      }

      input = input.replace(variable, String(number));
    }
  }

  while (index < input.length) {
    const token = input[index];

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
        numberBuffer = [];
      }
    }

    // if the token is an operator push it onto the operators stack
    if (
      token === ADDITION ||
      token === SUBTRACTION ||
      token === DIVISION ||
      token === MULTIPLICATION
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
        const operator = operators.pop();

        if (operator) {
          tokens.push(operator);
        }
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

        if (operator) {
          tokens.push(operator);
        }
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
    if (operator) {
      tokens.push(operator);
    }
  }

  if (tokens && tokens.length) {
    return tokens;
  } else {
    throw new SyntaxError('Lexer error');
  }
}

export function evaluate(tokens: (number | string)[]): Number {
  let stack: number[] = [];

  for (let i = 0; i < tokens.length; i++) {
    // @ts-ignore
    if (!isNaN(tokens[i]) && isFinite(tokens[i])) {
      // @ts-ignore
      stack.push(tokens[i]);
    } else {
      let a = stack.pop();
      let b = stack.pop();

      if (a && b) {
        switch (tokens[i]) {
          case ADDITION:
            stack.push(a + b);
            break;
          case SUBTRACTION:
            stack.push(b - a);
            break;
          case MULTIPLICATION:
            stack.push(a * b);
            break;
          case DIVISION:
            stack.push(b / a);
            break;
        }
      }
    }
  }

  if (stack.length > 1 || typeof stack[0] !== 'number') {
    throw new Error('Parsing error!');
  } else {
    return stack[0];
  }
}
